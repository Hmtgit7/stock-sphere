import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Expose backend URL as a public runtime env variable
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  },
  // Allow streaming + partial prerendering
  experimental: {
    ppr: false,
  },
};

export default nextConfig;
