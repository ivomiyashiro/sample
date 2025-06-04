import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  API_BASE_URL: z.string().url().default('http://localhost:3030/api'),
  API_LIMIT: z.number().default(10),
  API_OFFSET: z.number().default(0),
  API_TIMEOUT: z.number().default(10000),
});

export type Config = z.infer<typeof configSchema>;

export const config = (): Config => {
  const config = configSchema.safeParse(import.meta.env);

  if (!config.success) {
    throw new Error(`Configuration validation error: ${config.error.message}`);
  }

  return config.data;
};
