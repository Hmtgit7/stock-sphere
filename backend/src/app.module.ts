// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { configuration } from './config/configuration';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Config — loads .env, validates via Zod
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),

    // In-memory cache with 30s TTL for market data
    CacheModule.register({
      isGlobal: true,
      ttl: 30_000, // 30 seconds matches the 15s poll + buffer
      max: 200,
    }),

    // Throttle incoming requests: 100 req / 60s per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    PortfolioModule,
    MarketDataModule,
    HealthModule,
  ],
})
export class AppModule {}
