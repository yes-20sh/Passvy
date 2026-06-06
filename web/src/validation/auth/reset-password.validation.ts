import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6, { message: 'OTP must be exactly 6 characters' }),
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
