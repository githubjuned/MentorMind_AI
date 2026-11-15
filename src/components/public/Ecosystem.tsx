import { Network } from "lucide-react";
import { SPECIALISTS } from "@/data/agents";

export function Ecosystem() {
  const nodes = SPECIALISTS.map((a, i) => {
    const ang = ((-90 + (i * 360) / SPECIALISTS.length) * Math.PI) / 180;
    return { a, x: 50 + 37 * Math.cos(ang), y: 50 + 37 * Math.sin(ang) };
  });
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]" role="img" aria-label="Diagram: a central coordinator connected to seven specialised learning agents">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="37" fill="none" stroke="var(--line)" strokeWidth="0.3" strokeDasharray="1 1.5" className="anim-spin-slow" style={{ transformOrigin: "50% 50%" }} />
        <circle cx="50" cy="50" r="22" fill="none" stroke="var(--line)" strokeWidth="0.25" />
        {nodes.map(({ a, x, y }) => (
          <g key={a.id}>
            <line x1="50" y1="50" x2={x} y2={y} stroke={a.color} strokeWidth="0.45" strokeDasharray="1.2 1.8" className="anim-dash" opacity="0.8" />
            <circle cx={x} cy={y} r="8.5" fill={a.color} opacity="0.1" />
          </g>
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="anim-pulse-ring absolute inset-0 rounded-full bg-brand/40" />
        <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full text-white shadow-2xl sm:h-28 sm:w-28" style={{ background: "linear-gradient(135deg,#8b7bff,#38d6ff)", boxShadow: "0 0 60px var(--glow)" }}>
          <Network className="h-7 w-7" aria-hidden /><span className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wider">AI<br />Coordinator</span>
        </div>
      </div>
      {nodes.map(({ a, x, y }, i) => (
        <div key={a.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${x}%`, top: `${y}%` }}>
          <div className="anim-float" style={{ animationDelay: `${i * 0.4}s` }}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border bg-surface shadow-lg sm:h-14 sm:w-14" style={{ borderColor: `${a.color}66`, color: a.color, boxShadow: `0 8px 30px -8px ${a.color}66` }}><a.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden /></div>
            <p className="mt-1.5 text-[10px] font-semibold text-muted sm:text-xs">{a.short}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
