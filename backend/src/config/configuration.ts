import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('3001'),
  // comma-separated origins, set this in Railway
  // e.g. https://stock-sphere-frontend-lyart.vercel.app,http://localhost:3000
  ALLOWED_ORIGINS: z.string().optional(),
  // kept for backwards compatibility , use ALLOWED_ORIGINS going forward
  FRONTEND_URL: z.string().optional(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CACHE_TTL_MS: z.string().default('30000'),
  // only needed if using the paid RapidAPI Yahoo Finance endpoint
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
