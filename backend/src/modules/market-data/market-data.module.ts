import { Module } from '@nestjs/common';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';
import { YahooFinanceProvider } from './providers/yahoo-finance.provider';
import { GoogleFinanceProvider } from './providers/google-finance.provider';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService, YahooFinanceProvider, GoogleFinanceProvider],
  exports: [MarketDataService], // exported so PortfolioModule can inject it
})
export class MarketDataModule {}
