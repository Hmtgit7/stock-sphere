/**
 * ComingSoonCard — placeholder card shown when a page/module has not been
 * built yet.  Extracted from page-shell.tsx so it lives in its own file and
 * can be swapped out or reused independently.
 */
export function ComingSoonCard({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-elevated)]/40">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]">
        {/* Animated pulse indicator */}
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute h-8 w-8 animate-ping rounded-full border border-[var(--accent-green)]/20" />
          <div className="h-3 w-3 rounded-full bg-[var(--accent-green)]/60" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title} is being built</h2>
      <p className="mt-1 max-w-xs text-center text-sm text-[var(--text-secondary)]">
        This module is under active development and will be available soon.
      </p>
      <div className="mt-6 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: i === 0 ? 'var(--accent-green)' : 'var(--border)' }}
          />
        ))}
      </div>
    </div>
  );
}
