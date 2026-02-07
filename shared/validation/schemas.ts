import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must not exceed 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

export const pinSchema = z
  .string()
  .regex(/^\d+$/, 'PIN must contain only digits')
  .min(4, 'PIN must be at least 4 digits')
  .max(5, 'PIN must not exceed 5 digits');

export type EmailInput = z.infer<typeof emailSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type NameInput = z.infer<typeof nameSchema>;
export type PinInput = z.infer<typeof pinSchema>;
