import Link from "next/link";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="lm-g" x1="4" y1="4" x2="44" y2="44"><stop stopColor="#8b7bff" /><stop offset="1" stopColor="#38d6ff" /></linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#lm-g)" />
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".85">
        <path d="M24 24 14 14M24 24l10-10M24 24 14 34M24 24l10 10" />
      </g>
      <circle cx="24" cy="24" r="5.5" fill="#fff" />
      <g fill="#fff"><circle cx="14" cy="14" r="3" /><circle cx="34" cy="14" r="3" /><circle cx="14" cy="34" r="3" /><circle cx="34" cy="34" r="3" /></g>
    </svg>
  );
}
export function Logo({ href = "/", collapsed = false }: { href?: string; collapsed?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="MentorMind AI home">
      <LogoMark />
      {!collapsed && (
        <span className="font-display text-lg font-bold tracking-tight">
          MentorMind<span className="gradient-text"> AI</span>
        </span>
      )}
    </Link>
  );
}
