import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP code must be exactly 6 characters'),
  purpose: z.enum(['EMAIL_VERIFICATION', 'LOGIN', 'PASSWORD_RESET']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  code: z.string().length(6, 'OTP code must be exactly 6 characters').optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP code must be exactly 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const oauthSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  provider: z.enum(['GOOGLE', 'GITHUB']),
  providerUserId: z.string().min(1, 'Provider User ID is required'),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});
