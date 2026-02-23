import { Controller, Get, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
@UseGuards(ThrottlerGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  getPortfolio() {
    return this.portfolioService.getEnrichedPortfolio();
  }
}
