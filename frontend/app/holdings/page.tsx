import { Database } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';
import { FlatHoldingsTable } from '@/components/portfolio/flat-holdings-table';

export default function HoldingsPage() {
  return (
    <PageShell
      icon={Database}
      title="All Holdings"
      description="Complete flat view of every position in your portfolio"
      badge={undefined} // no badge — this is live
    >
      <FlatHoldingsTable />
    </PageShell>
  );
}
