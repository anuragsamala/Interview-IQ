"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("../config/db.js"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-access-token-key-change-this-in-production';
async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Access token required' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Access token empty' });
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Unauthorized', message: 'Token expired', code: 'TOKEN_EXPIRED' });
            }
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid access token' });
        }
        const payload = decoded;
        // Verify user still exists in database
        const user = await db_js_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, role: true, isEmailVerified: true },
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User no longer exists' });
        }
        // Attach user information to request
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        console.error('requireAuth middleware error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Authentication verification failure' });
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden', message: 'Insufficient access privileges' });
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map