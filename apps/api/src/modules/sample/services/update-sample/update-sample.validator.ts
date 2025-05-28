import { z } from 'zod';

export const updateSampleValidator = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});
