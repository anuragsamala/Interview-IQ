"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters long'),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').optional().nullable(),
    college: zod_1.z.string().optional().nullable(),
    graduationYear: zod_1.z.number().int().min(1900).max(2100).optional().nullable(),
    preferredRole: zod_1.z.string().optional().nullable(),
    preferredLanguage: zod_1.z.string().min(2).optional().nullable(),
    skills: zod_1.z.array(zod_1.z.string().min(1)).optional(),
});
//# sourceMappingURL=users.validation.js.map