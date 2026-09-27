"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.verifyOtpSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters long'),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    code: zod_1.z.string().length(6, 'OTP code must be exactly 6 characters'),
    purpose: zod_1.z.enum(['EMAIL_VERIFICATION', 'LOGIN', 'PASSWORD_RESET']),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().optional(),
    code: zod_1.z.string().length(6, 'OTP code must be exactly 6 characters').optional(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    code: zod_1.z.string().length(6, 'OTP code must be exactly 6 characters'),
    newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
});
exports.oauthSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters long'),
    provider: zod_1.z.enum(['GOOGLE', 'GITHUB']),
    providerUserId: zod_1.z.string().min(1, 'Provider User ID is required'),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').optional(),
});
//# sourceMappingURL=auth.validation.js.map