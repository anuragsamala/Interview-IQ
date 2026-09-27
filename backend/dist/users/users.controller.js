"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
const users_validation_js_1 = require("./users.validation.js");
class UsersController {
    // Retrieve profile details for the authenticated user
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Authentication context missing' });
            }
            // Query User, UserProfile, and UserSkill join mappings
            const user = await db_js_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isEmailVerified: true,
                    createdAt: true,
                    profile: {
                        include: {
                            skills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'Not Found', message: 'User not found' });
            }
            // Format profile outputs flattening skill records into string arrays
            const skillsArray = user.profile?.skills.map((us) => us.skill.name) || [];
            res.status(200).json({
                id: user.id,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                profile: user.profile
                    ? {
                        name: user.profile.name,
                        avatarUrl: user.profile.avatarUrl,
                        college: user.profile.college,
                        graduationYear: user.profile.graduationYear,
                        preferredRole: user.profile.preferredRole,
                        preferredLanguage: user.profile.preferredLanguage,
                        skills: skillsArray,
                    }
                    : null,
            });
        }
        catch (err) {
            console.error('getProfile controller error:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        }
    }
    // Update profile details and reconcile dynamic skill tags inside a transactional session
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Authentication context missing' });
            }
            const validated = users_validation_js_1.updateProfileSchema.parse(req.body);
            // Verify UserProfile exists
            const currentProfile = await db_js_1.default.userProfile.findUnique({
                where: { userId },
            });
            if (!currentProfile) {
                return res.status(404).json({ error: 'Not Found', message: 'User profile not found' });
            }
            // Reconcile details inside a transaction
            const updatedProfile = await db_js_1.default.$transaction(async (tx) => {
                // 1. Update basic profile info
                const profile = await tx.userProfile.update({
                    where: { userId },
                    data: {
                        name: validated.name,
                        avatarUrl: validated.avatarUrl,
                        college: validated.college,
                        graduationYear: validated.graduationYear,
                        preferredRole: validated.preferredRole,
                        preferredLanguage: validated.preferredLanguage || undefined,
                    },
                });
                // 2. Skill array synchronization (if provided)
                if (validated.skills !== undefined) {
                    // A. Resolve IDs for all input skills (create any missing global skills)
                    const skillLinks = [];
                    for (const skillName of validated.skills) {
                        const normalizedName = skillName.trim();
                        if (!normalizedName)
                            continue;
                        const skillRecord = await tx.skill.upsert({
                            where: { name: normalizedName },
                            update: {},
                            create: { name: normalizedName },
                        });
                        skillLinks.push(skillRecord.id);
                    }
                    // B. Clear existing mappings for this profile
                    await tx.userSkill.deleteMany({
                        where: { userProfileId: profile.id },
                    });
                    // C. Re-insert new maps
                    if (skillLinks.length > 0) {
                        await tx.userSkill.createMany({
                            data: skillLinks.map((skillId) => ({
                                userProfileId: profile.id,
                                skillId,
                            })),
                        });
                    }
                }
                return profile;
            });
            // Query updated full relations to return formatted response
            const refetchedUser = await db_js_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    profile: {
                        include: {
                            skills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                },
            });
            const finalSkills = refetchedUser?.profile?.skills.map((us) => us.skill.name) || [];
            res.status(200).json({
                message: 'Profile updated successfully',
                profile: updatedProfile
                    ? {
                        name: updatedProfile.name,
                        avatarUrl: updatedProfile.avatarUrl,
                        college: updatedProfile.college,
                        graduationYear: updatedProfile.graduationYear,
                        preferredRole: updatedProfile.preferredRole,
                        preferredLanguage: updatedProfile.preferredLanguage,
                        skills: finalSkills,
                    }
                    : null,
            });
        }
        catch (err) {
            if (err.name === 'ZodError') {
                return res.status(400).json({ error: 'Validation Error', details: err.errors });
            }
            console.error('updateProfile controller error:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        }
    }
    // Retrieve resume upload history logs
    static async getResumes(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Authentication context missing' });
            }
            const resumes = await db_js_1.default.resume.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    fileName: true,
                    fileUrl: true,
                    fileType: true,
                    fileSize: true,
                    isCurrent: true,
                    createdAt: true,
                },
            });
            res.status(200).json(resumes);
        }
        catch (err) {
            console.error('getResumes controller error:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map