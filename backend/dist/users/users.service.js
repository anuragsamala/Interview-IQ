"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
const client_1 = require("@prisma/client");
class UsersService {
    static async findByEmail(email) {
        return db_js_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
            include: { profile: true },
        });
    }
    static async findById(id) {
        return db_js_1.default.user.findUnique({
            where: { id },
            include: { profile: true },
        });
    }
    static async createUser({ email, passwordHash, role = client_1.Role.USER, name, isEmailVerified = false }) {
        return db_js_1.default.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    passwordHash,
                    role,
                    isEmailVerified,
                },
                include: { profile: true },
            });
            // 2. Create UserProfile
            await tx.userProfile.create({
                data: {
                    userId: user.id,
                    name,
                },
            });
            // 3. Create initial UserStatistics record
            await tx.userStatistics.create({
                data: {
                    userId: user.id,
                    streak: 0,
                    totalInterviews: 0,
                    averageScore: 0,
                    hoursPracticed: 0,
                },
            });
            return user;
        });
    }
    static async verifyEmail(userId) {
        return db_js_1.default.user.update({
            where: { id: userId },
            data: { isEmailVerified: true },
        });
    }
    static async updatePassword(userId, passwordHash) {
        return db_js_1.default.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map