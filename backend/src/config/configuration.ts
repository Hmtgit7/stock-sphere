import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('3001'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CACHE_TTL_MS: z.string().default('30000'),
  // Optional: RapidAPI key for fallback paid Yahoo Finance endpoint
  RAPIDAPI_KEY: z.string().optional(),
});

export const configuration = () => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten());
    process.exit(1);
  }
  return parsed.data;
};
