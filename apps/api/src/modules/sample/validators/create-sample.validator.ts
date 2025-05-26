import { z } from 'zod';

export const createSampleValidator = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
});
