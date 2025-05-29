import { z } from 'zod';

export const createSampleValidator = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullish(),
  image: z
    .object({
      base64: z.string().base64('Image must have a base64 string'),
      extension: z
        .string()
        .min(1, 'Image extension is required')
        .refine(
          (value) =>
            value === '.png' ||
            value === '.jpg' ||
            value === '.jpeg' ||
            value === '.gif' ||
            value === '.svg' ||
            value === '.webp',
          'Image extension must be .png, .jpg, .jpeg, .gif, .svg, or .webp',
        ),
      fileName: z.string().min(1, 'Image file name is required'),
      mimeType: z
        .string()
        .min(1, 'Image mime type is required')
        .refine(
          (value) =>
            value === 'image/png' ||
            value === 'image/jpeg' ||
            value === 'image/gif' ||
            value === 'image/svg+xml' ||
            value === 'image/webp',
          'Image mime type must be image/png, image/jpeg, image/gif, image/svg+xml, or image/webp',
        ),
    })
    .nullish(),
});
