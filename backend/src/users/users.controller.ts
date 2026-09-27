import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { updateProfileSchema } from './users.validation.js';

export class UsersController {
  // Retrieve profile details for the authenticated user
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authentication context missing' });
      }

      // Query User, UserProfile, and UserSkill join mappings
      const user = await prisma.user.findUnique({
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
    } catch (err: any) {
      console.error('getProfile controller error:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }

  // Update profile details and reconcile dynamic skill tags inside a transactional session
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authentication context missing' });
      }

      const validated = updateProfileSchema.parse(req.body);

      // Verify UserProfile exists
      const currentProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!currentProfile) {
        return res.status(404).json({ error: 'Not Found', message: 'User profile not found' });
      }

      // Reconcile details inside a transaction
      const updatedProfile = await prisma.$transaction(async (tx) => {
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
            if (!normalizedName) continue;

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
      const refetchedUser = await prisma.user.findUnique({
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
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      console.error('updateProfile controller error:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }

  // Retrieve resume upload history logs
  static async getResumes(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authentication context missing' });
      }

      const resumes = await prisma.resume.findMany({
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
    } catch (err: any) {
      console.error('getResumes controller error:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
}
