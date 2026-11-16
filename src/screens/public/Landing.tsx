"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Brain, CalendarClock, Check, ChevronDown, CircleCheck, Layers, ListChecks, Menu, Network, NotebookPen, PlayCircle, Repeat, Sparkles, Target, TrendingUp, X, Zap, ShieldCheck } from "lucide-react";
import { Ecosystem } from "@/components/public/Ecosystem";
import { AreaTrend, BarsChart } from "@/components/charts/charts";
import { Progress, Ring, cn } from "@/components/common/ui";
import { SPECIALISTS, AGENTS } from "@/data/agents";
import { FAQS } from "@/screens/settings/Help";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

const NAV = [["Home", "#home"], ["Features", "#features"], ["AI Agents", "#agents"], ["How It Works", "#how"], ["About", "#about"]] as const;
const trend = [{ d: "Mon", h: 1.5 }, { d: "Tue", h: 2.2 }, { d: "Wed", h: 1.1 }, { d: "Thu", h: 2.8 }, { d: "Fri", h: 2.4 }, { d: "Sat", h: 3.1 }, { d: "Sun", h: 1.6 }];
const subj = [{ n: "Python", v: 82 }, { n: "DBMS", v: 61 }, { n: "Maths", v: 57 }, { n: "DS", v: 74 }, { n: "AI", v: 66 }];

function Window({ children, title, className }: { children: React.ReactNode; title: string; className?: string }) {
  return (
    <div className={cn("card overflow-hidden shadow-2xl shadow-black/20", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-bad/70" /><span className="h-2.5 w-2.5 rounded-full bg-warn/70" /><span className="h-2.5 w-2.5 rounded-full bg-ok/70" /><span className="ml-3 text-[11px] text-muted">{title}</span><span className="ml-auto rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand">live preview</span></div>
      {children}
    </div>
  );
}
const Section = ({ id, eyebrow, title, sub, children }: { id?: string; eyebrow: string; title: React.ReactNode; sub?: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20 px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>{sub && <p className="mt-4 text-muted">{sub}</p>}</div>{children}</div></section>
);

export default function Landing() {
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <div className="bg-app flex min-h-screen flex-col">
      <PublicHeader />

      {/* Hero */}
      <section id="home" className="bg-aurora relative overflow-hidden px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-xs font-semibold text-muted backdrop-blur"><span className="relative flex h-2 w-2"><span className="anim-pulse-ring absolute inset-0 rounded-full bg-ok" /><span className="h-2 w-2 rounded-full bg-ok" /></span>7 specialist agents · 1 coordinator</div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Meet Your Personal <span className="gradient-text">AI Learning Companion.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">Learn smarter with multiple AI agents that understand your learning style, remember your progress and help you achieve your academic goals.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="btn btn-primary btn-lg"><PlayCircle className="h-5 w-5" />Start Learning</Link><a href="#agents" className="btn btn-secondary btn-lg">Explore AI Agents<ArrowRight className="h-5 w-5" /></a></div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">{["Doubts, notes & quizzes", "Study plans & revision", "A memory you control"].map((t) => <li key={t} className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-ok" />{t}</li>)}</ul>
          </div>
          <Ecosystem />
        </div>
      </section>

      {/* Problem / solution */}
      <Section eyebrow="The problem" title={<>Studying is scattered. <span className="gradient-text">Learning shouldn&apos;t be.</span></>} sub="Students juggle chat tools, note apps, planners and quiz sites. None of them remember what you struggled with last week.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-7"><p className="mb-4 text-sm font-bold uppercase tracking-wider text-bad">Without MentorMind</p><ul className="space-y-3 text-sm text-muted">{["One generic chatbot for every kind of task", "Notes, quizzes and plans live in separate tools", "No memory of repeated mistakes or weak topics", "Revision happens at the last minute"].map((t) => <li key={t} className="flex gap-3"><X className="mt-0.5 h-4 w-4 shrink-0 text-bad" />{t}</li>)}</ul></div>
          <div className="card border-brand/40 bg-brand/5 p-7"><p className="mb-4 text-sm font-bold uppercase tracking-wider text-ok">With MentorMind</p><ul className="space-y-3 text-sm">{["A coordinator routes each request to the right specialist", "Everything connected: ask, summarise, quiz, plan, revise", "A learning memory that shows what it knows and why", "Spaced revision and evidence-based recommendations"].map((t) => <li key={t} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" />{t}</li>)}</ul></div>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" eyebrow="How it works" title="From question to progress in four steps">
        <ol className="grid gap-5 md:grid-cols-4">
          {[[Sparkles, "Ask or choose", "Type a request in plain language or open any specialist directly.", "#8b7bff"], [Network, "Coordinator routes", "It detects intent, picks an agent and passes along topic and difficulty.", "#22d3ee"], [Layers, "Specialist delivers", "Explanation, notes, quiz, plan, revision set or resources — with attribution.", "#fbbf24"], [TrendingUp, "Memory updates", "Scores, mistakes and sessions refine your progress and next steps.", "#34d399"]].map(([I, t, d, c], i) => { const Icon = I as typeof Sparkles; return (
            <li key={t as string} className="card card-hover relative p-6"><span className="absolute right-5 top-5 font-display text-4xl font-black opacity-10">{i + 1}</span><span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${c}22`, color: c as string }}><Icon className="h-5 w-5" /></span><h3 className="font-display font-semibold">{t as string}</h3><p className="mt-2 text-sm text-muted">{d as string}</p></li>
          ); })}
        </ol>
      </Section>

      {/* Agents */}
      <Section id="agents" eyebrow="Specialised AI agents" title="A coordinator and seven specialists" sub="Each agent is purpose-built for one learning job, so you get focused help instead of a one-size-fits-all chat.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALISTS.map((a) => (
            <article key={a.id} className="card card-hover relative overflow-hidden p-5"><div className="absolute inset-x-0 top-0 h-1" style={{ background: a.color }} /><span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${a.color}22`, color: a.color }}><a.icon className="h-5 w-5" /></span><h3 className="font-display text-base font-semibold">{a.name}</h3><p className="mt-2 text-sm text-muted">{a.purpose}</p></article>
          ))}
          <article className="card relative flex flex-col justify-between overflow-hidden border-brand/40 bg-brand/10 p-5"><div><span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white"><Network className="h-5 w-5" /></span><h3 className="font-display text-base font-semibold">{AGENTS[0].name}</h3><p className="mt-2 text-sm text-muted">{AGENTS[0].purpose}</p></div><Link href="/signup" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">Meet them in the app<ArrowRight className="h-4 w-4" /></Link></article>
        </div>
      </Section>

      {/* Features: personalization + dashboard */}
      <Section id="features" eyebrow="Personalised learning" title="Your dashboard, shaped by how you learn" sub="Preferences are starting points that evolve with your activity — never permanent labels.">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Window title="mentormind.app/dashboard"><div className="p-5">
            <p className="font-display text-xl font-bold">Good morning, Alex! <span className="gradient-text">Ready to learn?</span></p>
            <div className="mt-4 grid grid-cols-3 gap-3">{[["Hours", "38.5", "#22d3ee"], ["Streak", "6 days", "#fb923c"], ["Quiz avg", "64%", "#fb7185"]].map(([l, v, c]) => <div key={l} className="rounded-xl bg-surface2 p-3"><p className="text-[10px] uppercase tracking-wide text-muted">{l}</p><p className="font-display text-lg font-bold" style={{ color: c }}>{v}</p></div>)}</div>
            <div className="mt-4 rounded-xl bg-surface2 p-3"><p className="mb-1 text-xs font-semibold">Study hours this week</p><AreaTrend data={trend} xKey="d" yKey="h" color="#8b7bff" height={130} unit="h" /></div>
          </div></Window>
          <ul className="space-y-4">{[[Brain, "Learning styles you can edit", "Choose several preferences. MentorMind adapts answer format and notes style, and you stay in control."], [Target, "Insights with evidence", "Weak topics and improvements show the quiz results and mistakes behind them."], [Zap, "Adaptive suggestions", "Suggested topics, revision and resources follow your goals and recent performance."]].map(([I, t, d]) => { const Icon = I as typeof Brain; return <li key={t as string} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand"><Icon className="h-5 w-5" /></span><div><h3 className="font-display font-semibold">{t as string}</h3><p className="mt-1 text-sm text-muted">{d as string}</p></div></li>; })}</ul>
        </div>
      </Section>

      {/* Planning */}
      <Section eyebrow="Smart study planning" title="Exam dates in. Realistic schedule out.">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <ul className="space-y-4 order-2 lg:order-1">{["Give subjects, topics, difficulty, exam date and available hours", "Get daily sessions, revision blocks and breaks", "Reschedule, edit or complete tasks — your dashboard updates instantly", "Run sessions with a focus timer and break reminders"].map((t) => <li key={t} className="flex gap-3 text-sm"><Check className="mt-0.5 h-5 w-5 shrink-0 text-ok" />{t}</li>)}<li><Link href="/signup" className="btn btn-secondary mt-2"><CalendarClock className="h-4 w-4" />Plan my study</Link></li></ul>
          <Window title="mentormind.app/planner" className="order-1 lg:order-2"><ul className="divide-y divide-line p-3">{[["09:00", "Normalization: 2NF & 3NF", "#fb923c", true], ["11:00", "Revise: Binary tree traversals", "#34d399", false], ["14:30", "Derivatives: chain rule", "#a78bfa", false], ["17:00", "Python collections quiz", "#22d3ee", false]].map(([t, n, c, d]) => <li key={n as string} className="flex items-center gap-3 px-2 py-3"><span className="w-12 text-xs text-muted">{t as string}</span><span className="h-8 w-1 rounded-full" style={{ background: c as string }} /><span className={cn("flex-1 text-sm", d && "text-muted line-through")}>{n as string}</span>{d ? <CircleCheck className="h-5 w-5 text-ok" /> : <span className="h-5 w-5 rounded-full border-2 border-line" />}</li>)}</ul></Window>
        </div>
      </Section>

      {/* Notes & quizzes */}
      <Section eyebrow="AI-powered notes and quizzes" title="Turn any topic into notes, then test yourself">
        <div className="grid gap-6 lg:grid-cols-2">
          <Window title="Smart Notes"><div className="p-5 text-sm"><p className="mb-3 flex items-center gap-2 text-xs font-semibold text-warn"><NotebookPen className="h-4 w-4" />Short notes · SQL Joins</p><div className="rounded-xl border-l-4 border-brand bg-brand/10 px-4 py-2.5">A JOIN combines rows from two tables based on a related column.</div><p className="mb-1 mt-4 font-semibold">Key points</p><ul className="list-disc space-y-1 pl-5 text-muted"><li>INNER keeps matches only</li><li>LEFT keeps every left row</li><li>Join conditions go in ON</li></ul></div></Window>
          <Window title="Quiz · Question 2 of 5"><div className="p-5 text-sm"><p className="mb-1 flex items-center gap-2 text-xs font-semibold text-bad"><ListChecks className="h-4 w-4" />Multiple choice · medium</p><p className="font-display text-base font-semibold">In a LEFT JOIN, unmatched right-table columns appear as:</p><div className="mt-3 space-y-2">{["0", "Empty string", "NULL", "The row is dropped"].map((o, i) => <div key={o} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5", i === 2 ? "border-brand bg-brand/15" : "border-line bg-surface2")}><span className={cn("flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold", i === 2 ? "bg-brand text-white" : "bg-surface text-muted")}>{"ABCD"[i]}</span>{o}</div>)}</div><Progress value={40} color="#fb7185" height={5} /></div></Window>
        </div>
      </Section>

      {/* Progress + memory */}
      <Section eyebrow="Progress tracking & learning memory" title="See your growth — and what MentorMind remembers">
        <div className="grid gap-6 lg:grid-cols-2">
          <Window title="Learning progress"><div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center"><Ring value={64} size={110} color="#60a5fa" /><div className="min-w-0"><p className="mb-1 text-xs font-semibold">Subject mastery</p><BarsChart data={subj} xKey="n" bars={[{ key: "v", color: "#60a5fa", name: "Mastery" }]} height={140} unit="%" /></div></div></Window>
          <Window title="My learning memory"><ul className="space-y-3 p-5 text-sm">{[["Stored", "Prefers practical examples & step-by-step", "info"], ["Inferred", "Normalization: 40% → 60% across 2 quizzes", "warn"], ["Inferred", "Repeated mistake: transitive dependency (2×)", "warn"], ["You edited", "Goal updated: 80%+ in DBMS", "brand"]].map(([k, t, tone]) => <li key={t} className="flex items-center gap-3"><span className={`badge ${tone === "info" ? "bg-brand2/15 text-brand2" : tone === "warn" ? "bg-warn/15 text-warn" : "bg-brand/15 text-brand"}`}>{k}</span><span className="text-muted">{t}</span></li>)}<li className="rounded-xl bg-surface2 p-3 text-xs text-muted">You can see, edit and clear everything. Nothing is shared with other students.</li></ul></Window>
        </div>
      </Section>

      {/* Benefits */}
      <Section eyebrow="Benefits for students" title="Built to help you study better, not just faster">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[[Layers, "One connected workspace", "Doubts, notes, quizzes, plans, revision and resources share the same context."], [Repeat, "Smarter revision", "Weak topics and past mistakes feed a spaced revision queue."], [Brain, "Transparent memory", "See what is stored, what is inferred, and edit or clear it."], [Target, "Goal-driven", "Daily, weekly and exam goals tied to real activity."], [TrendingUp, "Honest analytics", "Charts and insights show their evidence and sample size."], [Sparkles, "Clear AI attribution", "Every reply shows which agent produced it and why it was chosen."]].map(([I, t, d]) => { const Icon = I as typeof Brain; return <div key={t as string} className="card card-hover p-6"><Icon className="mb-3 h-6 w-6 text-brand" /><h3 className="font-display font-semibold">{t as string}</h3><p className="mt-1.5 text-sm text-muted">{d as string}</p></div>; })}</div>
      </Section>

      {/* About */}
      <Section id="about" eyebrow="Our Mission" title="Next-generation multi-agent architecture for every student">
        <div className="card mx-auto max-w-3xl p-7 text-center text-muted">
          <p>
            MentorMind AI combines the analytical power of state-of-the-art Google Gemini LLMs with dedicated cognitive agents specializing in Socratic inquiry, conceptual clarity, adaptive testing, and active recall.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/about" className="btn btn-secondary text-xs">Read Full Story & Team</Link>
            <Link href="/features" className="btn btn-ghost text-xs">Explore Agent Specs</Link>
            <Link href="/how-it-works" className="btn btn-ghost text-xs">How It Works</Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Frequently asked questions">
        <ul className="mx-auto max-w-3xl space-y-2">{FAQS.map(([q, a], i) => <li key={q} className="card overflow-hidden"><button className="flex w-full items-center gap-3 p-4 text-left" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}><span className="flex-1 text-sm font-semibold">{q}</span><ChevronDown className={cn("h-4 w-4 text-muted transition", faq === i && "rotate-180")} /></button>{faq === i && <p className="border-t border-line px-4 py-3 text-sm text-muted">{a}</p>}</li>)}</ul>
        <div className="mt-6 text-center">
          <Link href="/faq" className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1">
            Browse all categorized questions and exam guidelines <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </Section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8"><div className="bg-aurora mx-auto max-w-5xl rounded-3xl border border-line p-10 text-center sm:p-14"><h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to meet your <span className="gradient-text">learning companion</span>?</h2><p className="mx-auto mt-4 max-w-xl text-muted">Create your free account and start your personalized AI-powered learning journey today.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/signup" className="btn btn-primary btn-lg">Start Learning</Link><Link href="/login" className="btn btn-secondary btn-lg">Sign In</Link></div></div></section>

      <PublicFooter />
    </div>
  );
}
