'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Zap,
  Database,
  AlertTriangle,
  Settings,
  Bell,
  User,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/helpers';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Zap, label: 'Live Feed', href: '/live' },
  { icon: Database, label: 'Holdings', href: '/holdings' },
  { icon: AlertTriangle, label: 'Alerts', href: '/alerts' },
  { icon: ShieldCheck, label: 'Risk', href: '/risk' },
  { icon: Settings, label: 'Settings', href: '/settings' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [alertCount] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);
  const activeTheme = resolvedTheme ?? theme;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4">
        <nav
          className={cn(
            'flex w-full max-w-[1400px] items-center justify-between',
            'rounded-2xl border border-[var(--border)]',
            'bg-[var(--surface-elevated)]/80 backdrop-blur-md',
            'px-3 py-2 shadow-xl shadow-black/30 sm:px-4'
          )}
        >
          <Link href="/" className="select-none shrink-0">
            <Logo size={32} />
          </Link>

          <ul className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={label}
                    className={cn(
                      'group relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150',
                      isActive
                        ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--accent-green)]" />
                    )}
                    <span
                      className={cn(
                        'pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2',
                        'rounded-md border border-[var(--border)] bg-[var(--surface-elevated)]',
                        'px-2 py-0.5 text-[10px] text-[var(--text-secondary)]',
                        'opacity-0 transition-opacity group-hover:opacity-100',
                        'whitespace-nowrap'
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* theme toggle - mounted guard prevents SSR mismatch */}
            {mounted && (
              <button
                title={activeTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
              >
                {activeTheme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            <button
              title="Alerts"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
            >
              <Bell className="h-4 w-4" />
              {alertCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-red)] opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-[var(--accent-red)]" />
                </span>
              )}
            </button>

            <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />

            <button
              title="Profile"
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-green)]/40 hover:text-[var(--text-primary)] sm:flex"
            >
              <User className="h-4 w-4" />
            </button>

            <button
              title="Menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] sm:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-in menu */}
          <div className="fixed inset-x-0 top-[72px] z-40 mx-3 sm:hidden">
            <nav className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/95 backdrop-blur-md shadow-2xl p-3">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 border-t border-[var(--border)] pt-3">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]">
                  <User className="h-4 w-4 shrink-0" />
                  Profile
                </button>
                <button
                  onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                >
                  {activeTheme === 'dark' ? (
                    <Sun className="h-4 w-4 shrink-0" />
                  ) : (
                    <Moon className="h-4 w-4 shrink-0" />
                  )}
                  {activeTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
