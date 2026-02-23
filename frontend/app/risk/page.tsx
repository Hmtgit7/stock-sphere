import { ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';

export default function RiskPage() {
  return (
    <PageShell
      icon={ShieldCheck}
      title="Risk Analysis"
      description="Portfolio risk metrics and exposure breakdown"
    />
  );
}
