import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.use(helmet());
  app.use(compression());

  // ALLOWED_ORIGINS is a comma-separated list set in Railway env vars.
  // Falls back to FRONTEND_URL for backwards compat.
  // e.g. https://stock-sphere-frontend-lyart.vercel.app,http://localhost:3000
  const rawOrigins =
    process.env.ALLOWED_ORIGINS ?? process.env.FRONTEND_URL ?? '';
  const allowedOrigins: string[] = rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  // Using origin as a function so we can validate against the allowlist.
  // Passing '*' with credentials:true doesn't work — browsers block it.
  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // no Origin header means it's a direct server call, let it through
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${requestOrigin}`), false);
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  console.log(
    `Allowed CORS origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : '(none — set ALLOWED_ORIGINS)'}`,
  );
}

bootstrap();
