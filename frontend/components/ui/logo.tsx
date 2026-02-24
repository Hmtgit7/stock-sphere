import { cn } from '@/lib/helpers';

interface LogoProps {
  /** Size of the square icon in px */
  size?: number;
  className?: string;
  /** Show the wordmark next to the icon */
  showWordmark?: boolean;
}

export function Logo({ size = 32, className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5 select-none', className)}>
      <LogoIcon size={size} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className="font-bold tracking-tight text-[var(--text-primary)]"
            style={{ fontSize: size * 0.44 }}
          >
            Stock
            <span className="text-[var(--accent-green)]">Sphere</span>
          </span>
        </span>
      )}
    </span>
  );
}

export function LogoIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stock Sphere logo"
    >
      <defs>
        {/* Radial glow for the centre sphere */}
        <radialGradient id="sphereGrad" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>

        {/* Green glow for the chart line */}
        <filter id="lineGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip to keep contents inside the circular badge */}
        <clipPath id="circleClip">
          <circle cx="20" cy="20" r="17.5" />
        </clipPath>
      </defs>

      {/* ── Outer ring ── */}
      <circle cx="20" cy="20" r="18.5" stroke="#2e3828" strokeWidth="1" fill="none" />

      {/* ── Badge background ── */}
      <circle cx="20" cy="20" r="17.5" fill="#1e2419" />

      {/* ── Subtle radial glow ── */}
      <circle cx="20" cy="20" r="17.5" fill="url(#sphereGrad)" />

      {/* ── Orbit ellipse (horizontal) — suggests "sphere" ── */}
      <ellipse
        cx="20"
        cy="20"
        rx="13"
        ry="5.5"
        stroke="#2e3828"
        strokeWidth="0.9"
        fill="none"
        strokeDasharray="2.5 1.8"
      />

      {/* ── Orbit ellipse (tilted ~30°) ── */}
      <ellipse
        cx="20"
        cy="20"
        rx="13"
        ry="5.5"
        stroke="#2e3828"
        strokeWidth="0.9"
        fill="none"
        strokeDasharray="2.5 1.8"
        transform="rotate(-50 20 20)"
      />

      {/* ── Grid lines (subtle) ── */}
      <g clipPath="url(#circleClip)" opacity="0.18">
        <line x1="2.5" y1="20" x2="37.5" y2="20" stroke="#4ade80" strokeWidth="0.4" />
        <line x1="20" y1="2.5" x2="20" y2="37.5" stroke="#4ade80" strokeWidth="0.4" />
      </g>

      {/* ── Stock trend line (main hero element) ── */}
      {/* Glow copy */}
      <polyline
        points="8,27  13,22  17,25  22,16  27,18  32,10"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
        filter="url(#lineGlow)"
        clipPath="url(#circleClip)"
      />
      {/* Crisp line */}
      <polyline
        points="8,27  13,22  17,25  22,16  27,18  32,10"
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#circleClip)"
      />

      {/* ── Area fill under trend line ── */}
      <polygon
        points="8,27  13,22  17,25  22,16  27,18  32,10  32,37.5  8,37.5"
        fill="#4ade80"
        opacity="0.055"
        clipPath="url(#circleClip)"
      />

      {/* ── Data-point dots ── */}
      {(
        [
          [8, 27],
          [13, 22],
          [17, 25],
          [22, 16],
          [27, 18],
        ] as [number, number][]
      ).map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1.1"
          fill="#1e2419"
          stroke="#4ade80"
          strokeWidth="1"
          clipPath="url(#circleClip)"
        />
      ))}

      {/* ── Terminal dot (rightmost, filled + glow) ── */}
      <circle cx="32" cy="10" r="2" fill="#4ade80" opacity="0.25" clipPath="url(#circleClip)" />
      <circle cx="32" cy="10" r="1.4" fill="#4ade80" clipPath="url(#circleClip)" />

      {/* ── Inner accent ring highlight ── */}
      <circle
        cx="20"
        cy="20"
        r="17.5"
        fill="none"
        stroke="#4ade80"
        strokeWidth="0.6"
        opacity="0.18"
      />
    </svg>
  );
}
