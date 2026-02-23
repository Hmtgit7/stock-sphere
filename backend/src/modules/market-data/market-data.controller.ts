import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MarketDataService } from './market-data.service';

@Controller('market-data')
@UseGuards(ThrottlerGuard)
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('cmp/:ticker')
  getCMP(@Param('ticker') ticker: string) {
    return this.marketDataService.getCMP(ticker);
  }

  @Get('fundamentals/:ticker')
  getFundamentals(@Param('ticker') ticker: string) {
    return this.marketDataService.getFundamentals(decodeURIComponent(ticker));
  }
}
