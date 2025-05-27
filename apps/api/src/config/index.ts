import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3030),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const config = registerAs('config', (): Config => {
  const config = configSchema.safeParse(process.env);

  if (!config.success) {
    throw new Error(`Configuration validation error: ${config.error.message}`);
  }

  return config.data;
});
