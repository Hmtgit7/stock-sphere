import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4">
      {/* Glowing number */}
      <div className="relative mb-6 select-none sm:mb-8">
        <p className="text-[100px] font-black leading-none tracking-tighter text-[var(--surface-elevated)] sm:text-[160px]">
          404
        </p>
        {/* Green glow overlay */}
        <p className="absolute inset-0 text-[100px] font-black leading-none tracking-tighter text-[var(--accent-green)] opacity-10 blur-2xl sm:text-[160px]">
          404
        </p>
        {/* Thin green outline version */}
        <p
          className="absolute inset-0 text-[100px] font-black leading-none tracking-tighter sm:text-[160px]"
          style={{
            WebkitTextStroke: '1px rgba(74, 222, 128, 0.3)',
            color: 'transparent',
          }}
        >
          404
        </p>
      </div>

      {/* Message */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--text-primary)]">Page not found</h1>
        <p className="max-w-sm text-[var(--text-secondary)]">
          This route doesn&apos;t exist in Stock Sphere. Check the URL or head back to the
          dashboard.
        </p>
      </div>

      {/* Decorative grid lines — matches the UI vibe */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--accent-green) 1px, transparent 1px), linear-gradient(90deg, var(--accent-green) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial fade so grid fades toward edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_80%)]" />
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 px-5 py-2.5 text-sm font-medium text-[var(--accent-green)] transition-colors hover:bg-[var(--accent-green)]/20"
        >
          <LayoutDashboard className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <Link
          href="/holdings"
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          View Holdings
        </Link>
      </div>

      {/* Small breadcrumb hint */}
      <p className="mt-8 font-mono text-xs text-[var(--text-secondary)]/50">
        stock-sphere · error 404 · page_not_found
      </p>
    </div>
  );
}
