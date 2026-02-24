import { memo } from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3, History } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import type { PortfolioResponse } from '@/types/portfolio';
import { formatCurrency } from '@/lib/formatters';

export const StatsBar = memo(function StatsBar({ data }: { data: PortfolioResponse }) {
  const { totalInvestment, totalPresentValue, totalGainLoss, totalGainLossPct, totalRealizedPnL } =
    data;
  const isPositive = totalGainLoss >= 0;
  const isRealizedPositive = totalRealizedPnL >= 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
      <StatCard
        label="Total Invested"
        value={formatCurrency(totalInvestment)}
        icon={<Wallet className="h-4 w-4" />}
      />
      <StatCard
        label="Present Value"
        value={formatCurrency(totalPresentValue)}
        subValue={`${isPositive ? '+' : ''}${totalGainLossPct.toFixed(2)}% overall`}
        isPositive={isPositive}
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <StatCard
        label="Unrealised P&L"
        value={formatCurrency(Math.abs(totalGainLoss))}
        subValue={isPositive ? '▲ Profit' : '▼ Loss'}
        isPositive={isPositive}
        icon={
          isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
        }
      />
      <StatCard
        label="Realised P&L"
        value={formatCurrency(Math.abs(totalRealizedPnL))}
        subValue={isRealizedPositive ? '▲ Profit' : '▼ Loss'}
        isPositive={isRealizedPositive}
        icon={<History className="h-4 w-4" />}
      />
      <StatCard
        label="Active Holdings"
        value={String(data.holdings.length)}
        subValue={`${data.sectors.length} sectors`}
        icon={<BarChart3 className="h-4 w-4" />}
      />
    </div>
  );
});
