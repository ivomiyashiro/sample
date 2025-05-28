import { z } from 'zod';

export const refreshTokenValidator = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
