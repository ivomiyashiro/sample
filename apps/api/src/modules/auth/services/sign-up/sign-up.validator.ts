import { z } from 'zod';

export const signUpValidator = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters'),
});
