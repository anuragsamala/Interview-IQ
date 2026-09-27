"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("../config/db.js"));
const redis_js_1 = __importDefault(require("../config/redis.js"));
const users_service_js_1 = require("../users/users.service.js");
const email_service_js_1 = require("../notifications/email.service.js");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-access-token-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-change-this-in-production';
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
class AuthService {
    // Helper to generate a 6-digit OTP code
    static generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    // Create active JWT access and refresh token pair
    static generateTokenPair(userId, email, role) {
        const accessToken = jsonwebtoken_1.default.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
        return { accessToken, refreshToken };
    }
    // Register a new user
    static async register(email, passwordPlain, name) {
        // Check if user already exists
        const existingUser = await users_service_js_1.UsersService.findByEmail(email);
        if (existingUser) {
            throw new Error('User already registered with this email address');
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(passwordPlain, salt);
        // Create User record and initial profile
        const user = await users_service_js_1.UsersService.createUser({
            email,
            passwordHash,
            name,
            isEmailVerified: false,
        });
        // Send verification OTP
        const code = await this.sendVerificationOtp(user.id, user.email, 'EMAIL_VERIFICATION');
        return {
            userId: user.id,
            email: user.email,
            otpCode: code,
            message: 'Registration successful. Verification code generated.',
        };
    }
    // Generate and dispatch OTP code
    static async sendVerificationOtp(userId, email, purpose) {
        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        // 1. Save OTP in Redis (with 10-minute TTL)
        const redisKey = `otp:${email.toLowerCase()}:${purpose}`;
        await redis_js_1.default.set(redisKey, code, 'EX', 600);
        // 2. Save OTP in Database (for records and fallback audit)
        await db_js_1.default.otpCode.create({
            data: {
                userId,
                email: email.toLowerCase(),
                code,
                purpose,
                expiresAt,
            },
        });
        // 3. Dispatch Email
        await (0, email_service_js_1.sendOtpEmail)(email, code, purpose, userId || undefined);
        return code;
    }
    // Verify OTP
    static async verifyOtp(email, code, purpose) {
        const normalizedEmail = email.toLowerCase();
        const redisKey = `otp:${normalizedEmail}:${purpose}`;
        // 1. Check Redis
        const cachedCode = await redis_js_1.default.get(redisKey);
        let isValid = false;
        if (cachedCode) {
            if (cachedCode === code) {
                isValid = true;
                // Delete key immediately on success (one-time use check)
                await redis_js_1.default.del(redisKey);
            }
        }
        else {
            // 2. Fallback to Database if Redis check expired or failed
            const dbCode = await db_js_1.default.otpCode.findFirst({
                where: {
                    email: normalizedEmail,
                    purpose,
                    code,
                    expiresAt: { gt: new Date() },
                },
                orderBy: { createdAt: 'desc' },
            });
            if (dbCode) {
                isValid = true;
                // Delete OTP code so it cannot be reused
                await db_js_1.default.otpCode.delete({ where: { id: dbCode.id } });
            }
        }
        if (!isValid) {
            throw new Error('Invalid or expired OTP verification code');
        }
        // Handle post-verification database mutations
        const user = await users_service_js_1.UsersService.findByEmail(normalizedEmail);
        if (!user) {
            throw new Error('User not found');
        }
        if (purpose === 'EMAIL_VERIFICATION' && !user.isEmailVerified) {
            await users_service_js_1.UsersService.verifyEmail(user.id);
        }
        return user;
    }
    // Login credentials check
    static async loginWithCredentials(email, passwordPlain) {
        const user = await users_service_js_1.UsersService.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        if (!user.passwordHash) {
            throw new Error('This account uses social sign-on. Please use OAuth to login.');
        }
        const isMatch = await bcryptjs_1.default.compare(passwordPlain, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        if (!user.isEmailVerified) {
            // Re-trigger verification OTP
            await this.sendVerificationOtp(user.id, user.email, 'EMAIL_VERIFICATION');
            throw new Error('Email verification required. A new OTP has been sent to your email.');
        }
        // Generate sessions and token pairs
        return this.createSession(user.id, user.email, user.role);
    }
    // Login with OTP
    static async loginWithOtp(email, code) {
        const user = await this.verifyOtp(email, code, 'LOGIN');
        return this.createSession(user.id, user.email, user.role);
    }
    // OAuth authentication
    static async authenticateOAuth(email, name, provider, providerUserId) {
        const normalizedEmail = email.toLowerCase();
        // Check if user already exists
        let user = await users_service_js_1.UsersService.findByEmail(normalizedEmail);
        if (!user) {
            // Create user and profile
            user = await users_service_js_1.UsersService.createUser({
                email: normalizedEmail,
                name,
                isEmailVerified: true, // OAuth emails are pre-verified
            });
        }
        // Check if provider is mapped
        const oauthAccount = await db_js_1.default.oAuthAccount.findFirst({
            where: {
                userId: user.id,
                provider,
                providerUserId,
            },
        });
        if (!oauthAccount) {
            await db_js_1.default.oAuthAccount.create({
                data: {
                    userId: user.id,
                    provider,
                    providerUserId,
                },
            });
        }
        return this.createSession(user.id, user.email, user.role);
    }
    // Create active session in Database
    static async createSession(userId, email, role) {
        const { accessToken, refreshToken } = this.generateTokenPair(userId, email, role);
        // Save refresh token
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await db_js_1.default.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                expiresAt,
            },
        });
        // Create session record
        await db_js_1.default.userSession.create({
            data: {
                userId,
                token: accessToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
            },
        });
        return {
            user: {
                id: userId,
                email,
                role,
            },
            accessToken,
            refreshToken,
        };
    }
    // Rotate refresh token
    static async refreshSession(oldRefreshToken) {
        try {
            // 1. Verify token signature
            const decoded = jsonwebtoken_1.default.verify(oldRefreshToken, JWT_REFRESH_SECRET);
            // 2. Lookup token in DB
            const storedToken = await db_js_1.default.refreshToken.findUnique({
                where: { token: oldRefreshToken },
                include: { user: true },
            });
            if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
                // Potential security breach: revoke all refresh tokens for this user
                if (storedToken) {
                    await db_js_1.default.refreshToken.updateMany({
                        where: { userId: storedToken.userId },
                        data: { isRevoked: true },
                    });
                }
                throw new Error('Invalid or expired refresh token');
            }
            // 3. Delete/Revoke old refresh token (Refresh Token Rotation)
            await db_js_1.default.refreshToken.delete({
                where: { id: storedToken.id },
            });
            // 4. Generate new session
            return this.createSession(storedToken.user.id, storedToken.user.email, storedToken.user.role);
        }
        catch (err) {
            throw new Error('Session renewal failed');
        }
    }
    // Terminate session
    static async logout(accessToken, refreshToken) {
        // 1. Delete access token session from Database
        try {
            await db_js_1.default.userSession.deleteMany({
                where: { token: accessToken },
            });
        }
        catch (err) {
            console.warn('Access token session delete failed or already removed');
        }
        // 2. Blacklist refresh token
        if (refreshToken) {
            try {
                await db_js_1.default.refreshToken.deleteMany({
                    where: { token: refreshToken },
                });
            }
            catch (err) {
                console.warn('Refresh token delete failed or already removed');
            }
        }
        // 3. Blacklist access token in Redis for remainder of its lifespans
        try {
            const decoded = jsonwebtoken_1.default.decode(accessToken);
            if (decoded && decoded.exp) {
                const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
                if (remainingTime > 0) {
                    await redis_js_1.default.set(`blacklist:${accessToken}`, '1', 'EX', remainingTime);
                }
            }
        }
        catch (err) {
            console.error('Failed to blacklist token in Redis:', err);
        }
    }
    // Request password reset
    static async forgotPassword(email) {
        const user = await users_service_js_1.UsersService.findByEmail(email);
        if (!user) {
            // Don't throw error to prevent email enumeration, mock response
            return;
        }
        await this.sendVerificationOtp(user.id, user.email, 'PASSWORD_RESET');
    }
    // Reset password logic
    static async resetPassword(email, code, passwordPlain) {
        const user = await this.verifyOtp(email, code, 'PASSWORD_RESET');
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(passwordPlain, salt);
        await users_service_js_1.UsersService.updatePassword(user.id, passwordHash);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map