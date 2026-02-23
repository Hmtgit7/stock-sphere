import { Settings } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';

export default function SettingsPage() {
  return (
    <PageShell
      icon={Settings}
      title="Settings"
      description="Configure dashboard preferences and data sources"
    />
  );
}
