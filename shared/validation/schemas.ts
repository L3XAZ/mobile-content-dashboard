import i18n from '@/shared/i18n';
import { z } from 'zod';

const getTranslation = (key: string): string => {
  try {
    return i18n.t(key);
  } catch {
    const fallbacks: Record<string, string> = {
      'auth.validation.emailInvalid': 'Invalid email address',
      'auth.validation.passwordMinLength': 'Password must be at least 8 characters',
      'auth.validation.passwordMaxLength': 'Password must not exceed 64 characters',
      'auth.validation.passwordUppercase': 'Password must contain at least one uppercase letter',
      'auth.validation.passwordLowercase': 'Password must contain at least one lowercase letter',
      'auth.validation.passwordSpecialChar': 'Password must contain at least one special character',
      'auth.validation.nameMinLength': 'Name must be at least 2 characters',
      'auth.validation.usernameMinLength': 'Username must be at least 2 characters',
      'auth.validation.pinOnlyDigits': 'PIN must contain only digits',
      'auth.validation.pinExactLength': 'PIN must be exactly 4 digits',
    };
    return fallbacks[key] || key;
  }
};

export const emailSchema = z.string().email(getTranslation('auth.validation.emailInvalid'));

export const passwordSchema = z
  .string()
  .min(8, getTranslation('auth.validation.passwordMinLength'))
  .max(64, getTranslation('auth.validation.passwordMaxLength'))
  .regex(/[A-Z]/, getTranslation('auth.validation.passwordUppercase'))
  .regex(/[a-z]/, getTranslation('auth.validation.passwordLowercase'))
  .regex(/[!@#$%^&*(),.?":{}|<>]/, getTranslation('auth.validation.passwordSpecialChar'));

export const nameSchema = z.string().min(2, getTranslation('auth.validation.nameMinLength'));

export const usernameSchema = z
  .string()
  .min(2, getTranslation('auth.validation.usernameMinLength'));

export const pinSchema = z
  .string()
  .regex(/^\d+$/, getTranslation('auth.validation.pinOnlyDigits'))
  .length(4, getTranslation('auth.validation.pinExactLength'));

export type EmailInput = z.infer<typeof emailSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type NameInput = z.infer<typeof nameSchema>;
export type UsernameInput = z.infer<typeof usernameSchema>;
export type PinInput = z.infer<typeof pinSchema>;
