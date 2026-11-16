import Link from "next/link";
import { Compass, Home, LayoutDashboard, Sparkles } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export default function NotFound() {
  return (
    <div className="bg-aurora relative flex min-h-screen flex-col overflow-hidden px-6 py-6">
      <Logo />
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        <svg viewBox="0 0 400 200" className="absolute -z-0 w-full max-w-2xl opacity-60" aria-hidden>
          {[[60, 50], [340, 60], [90, 160], [320, 150], [200, 20]].map(([x, y], i) => <g key={i}><line x1="200" y1="100" x2={x} y2={y} stroke="var(--brand)" strokeWidth="1" strokeDasharray="4 6" className="anim-dash" /><circle cx={x} cy={y} r="5" fill="var(--brand2)" opacity=".7" /></g>)}
        </svg>
        <div className="relative z-10">
          <p className="font-display text-[8rem] font-extrabold leading-none gradient-text anim-float sm:text-[11rem]">404</p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">This page wandered off the syllabus</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved. None of the agents could find it either.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/app" className="btn btn-primary"><LayoutDashboard className="h-4 w-4" />Go to dashboard</Link>
            <Link href="/chat" className="btn btn-secondary"><Sparkles className="h-4 w-4" />Ask AI Mentor</Link>
            <Link href="/" className="btn btn-ghost"><Home className="h-4 w-4" />Home</Link>
            <Link href="/features" className="btn btn-ghost"><Compass className="h-4 w-4" />Agent Features</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
