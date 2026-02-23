import { Zap } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';
import { LiveFeedPreview } from '@/components/live/live-feed-preview';

export default function LivePage() {
  return (
    <PageShell
      icon={Zap}
      title="Live Feed"
      description="Real-time transaction activity across your holdings"
      badge="Live"
    >
      <LiveFeedPreview />
    </PageShell>
  );
}
