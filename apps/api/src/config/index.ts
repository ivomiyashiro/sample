import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3030),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.coerce.number().default(7 * 24 * 60 * 60 * 1000),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

export type Config = z.infer<typeof configSchema>;

export const config = registerAs('config', (): Config => {
  const config = configSchema.safeParse(process.env);

  if (!config.success) {
    throw new Error(`Configuration validation error: ${config.error.message}`);
  }

  return config.data;
});
