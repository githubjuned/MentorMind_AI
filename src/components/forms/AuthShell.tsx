import Link from "next/link";
import type { ReactNode } from "react";
import { Brain, CalendarClock, Lightbulb, ListChecks, NotebookPen, Sparkles } from "lucide-react";
import { Logo } from "@/components/common/Logo";

const points = [
  { icon: Lightbulb, text: "Doubts explained at your level", c: "#22d3ee" },
  { icon: NotebookPen, text: "Notes and quizzes on demand", c: "#fbbf24" },
  { icon: CalendarClock, text: "Study plans built around your exams", c: "#34d399" },
  { icon: Brain, text: "A learning memory you can see and edit", c: "#8b7bff" },
];
export function AuthShell({ title, subtitle, children, wide }: { title: string; subtitle: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="bg-aurora relative hidden overflow-hidden border-r border-line p-12 lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div className="relative z-10 max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-xs font-semibold text-muted"><Sparkles className="h-3.5 w-3.5 text-brand" />Multi-agent learning platform</div>
          <h2 className="font-display text-4xl font-bold leading-tight">Learn smarter with a <span className="gradient-text">team of specialists</span>.</h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${p.c}22`, color: p.c }}><p.icon className="h-[18px] w-[18px]" /></span>{p.text}</li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 flex items-center gap-2 text-xs text-muted"><ListChecks className="h-4 w-4" />Demo build: accounts and data stay in this browser. No live AI model is connected.</p>
        <div className="anim-spin-slow absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full border border-dashed border-brand/30" aria-hidden />
        <div className="absolute -bottom-20 -right-20 h-[18rem] w-[18rem] rounded-full border border-brand/20" aria-hidden />
      </aside>
      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mb-8 mt-2 text-sm text-muted">{subtitle}</p>
          {children}
          <p className="mt-8 text-center text-xs text-muted"><Link href="/" className="hover:text-ink hover:underline">← Back to website</Link></p>
        </div>
      </main>
    </div>
  );
}
