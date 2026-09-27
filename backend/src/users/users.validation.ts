import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  avatarUrl: z.string().url('Invalid avatar URL').optional().nullable(),
  college: z.string().optional().nullable(),
  graduationYear: z.number().int().min(1900).max(2100).optional().nullable(),
  preferredRole: z.string().optional().nullable(),
  preferredLanguage: z.string().min(2).optional().nullable(),
  skills: z.array(z.string().min(1)).optional(),
});
