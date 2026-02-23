import { AlertTriangle } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';

export default function AlertsPage() {
  return (
    <PageShell
      icon={AlertTriangle}
      title="Alerts"
      description="Critical and high-priority portfolio alerts"
    />
  );
}
