import { z } from 'zod';

import { emailSchema, passwordSchema, usernameSchema } from './schemas';

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: usernameSchema,
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  });

export const createSignUpSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t('auth.validation.nameMinLength')),
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
  });
