import prisma from '../config/db.js';
import { Role } from '@prisma/client';

export interface CreateUserData {
  email: string;
  passwordHash?: string;
  role?: Role;
  name: string;
  isEmailVerified?: boolean;
}

export class UsersService {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  static async createUser({ email, passwordHash, role = Role.USER, name, isEmailVerified = false }: CreateUserData) {
    return prisma.$transaction(async (tx) => {
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

  static async verifyEmail(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  static async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
