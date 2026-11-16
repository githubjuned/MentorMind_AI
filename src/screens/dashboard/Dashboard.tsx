"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, BookCheck, Brain, CalendarClock, CheckCircle2, Circle, Clock, Flame, Gauge, GraduationCap, Lightbulb, ListChecks, NotebookPen, Play, Repeat, Send, Sparkles, Target, TrendingUp, Upload, Zap } from "lucide-react";
import { AgentIcon } from "@/components/agents/AgentBadge";
import { BarsChart, Heatmap, LineTrend } from "@/components/charts/charts";
import { Badge, Button, Card, Progress, Ring, Stat, cn } from "@/components/common/ui";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { addDays, fmtDate, fmtTime, greeting, minsLabel, setHandoff, timeAgo, todayStr } from "@/utils";
import { improvement, minutesByDay, overallProgress, quizAvg, streak, subjectStats, totalMinutes, weeklyMinutes, bestStudyHour, topicEvidence } from "@/utils/metrics";

const ACTIONS = [
  { label: "Ask AI", href: "/assistant", icon: Sparkles, c: "#8b7bff" }, { label: "Generate Notes", href: "/notes", icon: NotebookPen, c: "#fbbf24" },
  { label: "Create Quiz", href: "/quizzes", icon: ListChecks, c: "#fb7185" }, { label: "Plan My Study", href: "/planner", icon: CalendarClock, c: "#34d399" },
  { label: "Upload Material", href: "/materials", icon: Upload, c: "#22d3ee", handoff: "upload" }, { label: "Start Revision", href: "/revision", icon: Repeat, c: "#fb923c" },
];
const KIND_ICON = { session: Clock, quiz: ListChecks, notes: NotebookPen, topic: BookCheck, revision: Repeat, doubt: Lightbulb, plan: CalendarClock } as const;

export default function Dashboard() {
  const { state, toggleTask } = useApp();
  const router = useRouter();
  const [ask, setAsk] = useState("");
  const today = todayStr();
  const first = state.profile.name.split(" ")[0];

  const m = useMemo(() => {
    const todays = state.tasks.filter((t) => t.date === today).sort((a, b) => a.start.localeCompare(b.start));
    const work = todays.filter((t) => t.kind !== "break");
    const stats = subjectStats(state);
    const weak = state.topics.filter((t) => t.status !== "not_started" && t.mastery < 60).sort((a, b) => a.mastery - b.mastery).slice(0, 3);
    const improved = state.topics.map((t) => ({ t, d: improvement(state, t.id) })).filter((x) => x.d >= 10).sort((a, b) => b.d - a.d).slice(0, 3);
    const suggested = [...state.topics.filter((t) => t.status === "not_started"), ...state.topics.filter((t) => t.status === "learning").sort((a, b) => a.mastery - b.mastery)].slice(0, 3);
    const due = state.revisions.filter((r) => r.dueDate <= today).slice(0, 3);
    return {
      todays, work, stats, weak, improved, suggested, due,
      remaining: work.filter((t) => !t.done).reduce((a, t) => a + t.minutes, 0),
      doneCount: work.filter((t) => t.done).length,
      hours: totalMinutes(state.sessions) / 60,
      week: weeklyMinutes(state.sessions),
      streak: streak(state.sessions),
      completed: state.topics.filter((t) => t.status === "completed").length,
      quiz: quizAvg(state.attempts), progress: overallProgress(state.topics),
      heat: minutesByDay(state.sessions, addDays(today, -34), today),
      quizTrend: [...state.attempts].sort((a, b) => a.date.localeCompare(b.date)).slice(-8).map((a) => ({ label: fmtDate(a.date.slice(0, 10)), accuracy: a.accuracy })),
      best: bestStudyHour(state.sessions),
    };
  }, [state, today]);
  const weekMin = m.week.reduce((a, b) => a + b.minutes, 0);
  const send = (t: string) => { if (!t.trim()) return; setHandoff("assistant", t.trim()); router.push("/assistant"); };
  const pendingLater = state.tasks.filter((t) => t.date > today && !t.done && t.kind !== "break").sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)).slice(0, 2);

  return (
    <div className="space-y-6">
      {!state.onboarded && <Card className="flex flex-wrap items-center gap-3 border-brand/40 bg-brand/10 p-4 text-sm"><GraduationCap className="h-5 w-5 text-brand" /><span className="flex-1">Finish onboarding to personalise explanations and study plans.</span><Button size="sm" href="/onboarding">Continue setup</Button></Card>}

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="bg-aurora relative overflow-hidden rounded-3xl border border-line p-6 sm:p-8">
          <p className="eyebrow">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{greeting()}, {first}! <span className="gradient-text">Ready to learn something new today?</span></h1>
          <p className="mt-3 max-w-xl text-sm text-muted">{m.remaining > 0 ? `You have ${minsLabel(m.remaining)} of study planned for the rest of today.` : m.work.length ? "Today's plan is complete. Great consistency!" : "Nothing planned for today yet. Ask MentorMind to build a plan."}</p>
          <form onSubmit={(e) => { e.preventDefault(); send(ask); }} className="mt-6 flex gap-2 rounded-2xl border border-line bg-surface/80 p-2 backdrop-blur">
            <AgentIcon id="coordinator" size={40} />
            <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask MentorMind anything…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted" aria-label="Ask MentorMind" />
            <Button type="submit" size="sm" icon={Send} disabled={!ask.trim()}>Ask</Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Explain SQL joins", "Quiz me on trees", "What should I revise today?"].map((p) => <button key={p} className="chip" onClick={() => send(p)}>{p}</button>)}
          </div>
        </div>
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-center gap-5">
            <Ring value={m.progress} size={112} stroke={11} color="var(--brand)"><div><p className="font-display text-2xl font-bold">{m.progress}%</p><p className="text-[10px] uppercase tracking-wide text-muted">mastery</p></div></Ring>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold">Overall learning progress</p>
              <p className="mt-1 text-sm text-muted">{m.completed} of {state.topics.length} topics completed across {state.subjects.length} subjects.</p>
              <Link href="/progress" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">View progress<ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
          <div className="mt-5 space-y-2">{m.stats.slice(0, 4).map((s) => (<div key={s.subject.id}><div className="mb-1 flex justify-between text-xs"><span className="truncate text-muted">{s.subject.name}</span><span className="font-semibold">{s.progress}%</span></div><Progress value={s.progress} color={s.subject.color} height={6} /></div>))}</div>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Learning hours" value={m.hours.toFixed(1)} sub={`${minsLabel(weekMin)} this week`} icon={Clock} color="#22d3ee" />
        <Stat label="Topics completed" value={`${m.completed}/${state.topics.length}`} sub="Mastery 80%+ or finished" icon={BookCheck} color="#34d399" />
        <Stat label="Study streak" value={`${m.streak} day${m.streak === 1 ? "" : "s"}`} sub={m.streak ? "Keep it going today" : "Study today to start one"} icon={Flame} color="#fb923c" />
        <Stat label="Quiz performance" value={state.attempts.length ? `${m.quiz}%` : "—"} sub={state.attempts.length ? `Average of last ${Math.min(5, state.attempts.length)} quizzes` : "No quizzes yet"} icon={Gauge} color="#fb7185" />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div><h2 className="font-display text-lg font-semibold">Today&apos;s study plan</h2><p className="text-xs text-muted">{m.doneCount} of {m.work.length} completed · {minsLabel(m.remaining)} remaining</p></div>
            <div className="flex gap-2"><Button size="sm" variant="secondary" href="/planner">Edit plan</Button><Button size="sm" icon={Play} href="/routine">Start learning</Button></div>
          </div>
          <Progress value={m.work.length ? (m.doneCount / m.work.length) * 100 : 0} color="var(--ok)" label="Today's completion" />
          <ul className="mt-4 divide-y divide-line">
            {m.todays.map((t) => (
              <li key={t.id} className={cn("flex items-center gap-3 py-2.5", t.kind === "break" && "opacity-60")}>
                {t.kind === "break" ? <span className="w-5 text-center text-xs">☕</span> : <button onClick={() => toggleTask(t.id)} aria-label={t.done ? `Mark ${t.title} incomplete` : `Mark ${t.title} complete`} className="text-muted hover:text-ok">{t.done ? <CheckCircle2 className="h-5 w-5 text-ok" /> : <Circle className="h-5 w-5" />}</button>}
                <span className="h-8 w-1 rounded-full" style={{ background: subjectColor(state, t.subjectId) }} />
                <div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-medium", t.done && "text-muted line-through")}>{t.title}</p><p className="text-xs text-muted">{fmtTime(t.start)} · {t.minutes} min · {subjectName(state, t.subjectId).split(" ")[0]}</p></div>
                {t.kind === "revision" && <Badge tone="warn">Revision</Badge>}{t.kind === "quiz" && <Badge tone="bad">Quiz</Badge>}
              </li>
            ))}
            {!m.todays.length && <li className="py-8 text-center text-sm text-muted">No sessions today. <Link href="/planner" className="font-semibold text-brand hover:underline">Plan your study</Link></li>}
          </ul>
          {pendingLater.length > 0 && <div className="mt-3 rounded-xl bg-surface2 p-3 text-xs text-muted"><b className="text-ink">Up next:</b> {pendingLater.map((t) => `${t.title} (${fmtDate(t.date)})`).join(" · ")}</div>}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map((a) => (
              <Link key={a.label} href={a.href} onClick={() => a.handoff && setHandoff(a.handoff, "1")} className="card-hover flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface2 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${a.c}22`, color: a.c }}><a.icon className="h-[18px] w-[18px]" /></span><span className="text-sm font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2"><Brain className="h-5 w-5 text-brand" /><h2 className="font-display text-lg font-semibold">AI learning insights</h2><Badge tone="muted">from your activity</Badge></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Insight title="Weak areas" color="#fb7185" empty="No weak areas detected yet.">{m.weak.map((t) => <Row key={t.id} a={t.name} b={topicEvidence(state, t)} tone="bad" />)}</Insight>
            <Insight title="Recently improved" color="#34d399" empty="Improvements appear after repeat quiz attempts.">{m.improved.map(({ t, d }) => <Row key={t.id} a={t.name} b={`Quiz accuracy +${d} points across attempts`} tone="ok" />)}</Insight>
            <Insight title="Recommended revision" color="#fb923c" empty="Nothing due. Nice work.">{m.due.map((r) => <Row key={r.id} a={r.topic} b={r.dueDate < today ? `Overdue since ${fmtDate(r.dueDate)}` : "Due today"} tone="warn" />)}</Insight>
            <Insight title="Suggested topics" color="#22d3ee" empty="You've started every topic.">{m.suggested.map((t) => <Row key={t.id} a={t.name} b={t.status === "not_started" ? "Not started yet" : `In progress · ${t.mastery}% mastery`} tone="info" />)}</Insight>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/10 p-3.5 text-sm"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><p>{m.best ? <>You&apos;ve logged most study time in the <b>{m.best.toLowerCase()}</b>. Try scheduling your hardest topic ({m.weak[0]?.name ?? "your weakest subject"}) then.</> : "Log a few study sessions and MentorMind will suggest the best time for hard topics."} {state.profile.styles[0] && <>Explanations favour <b>{state.profile.styles[0].toLowerCase()}</b>.</>}</p></div>
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Recent activity</h2><Link href="/memory" className="text-xs font-semibold text-brand hover:underline">History</Link></div>
          <ul className="space-y-3">
            {state.activity.slice(0, 7).map((a) => { const I = KIND_ICON[a.kind]; return (
              <li key={a.id}><Link href={a.href ?? "/dashboard"} className="flex gap-3 rounded-xl p-1.5 hover:bg-surface2"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"><I className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-sm font-medium">{a.title}</span><span className="block truncate text-xs text-muted">{a.detail} · {timeAgo(a.time)}</span></span></Link></li>
            ); })}
            {!state.activity.length && <li className="py-6 text-center text-sm text-muted">Your sessions, quizzes and notes will appear here.</li>}
          </ul>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Weekly learning analytics</h2><Link href="/analytics" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">Full analytics<ArrowRight className="h-3.5 w-3.5" /></Link></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Clock className="h-4 w-4 text-brand2" />Daily study time (h)</p><BarsChart data={m.week} xKey="label" bars={[{ key: "hours", color: "#38d6ff", name: "Hours" }]} height={180} unit="h" /></Card>
          <Card className="p-5"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-ok" />Subject-wise progress</p><BarsChart data={m.stats.map((s) => ({ name: s.subject.name.split(" ")[0], progress: s.progress }))} xKey="name" bars={[{ key: "progress", color: "#34d399", name: "Mastery" }]} height={180} unit="%" /></Card>
          <Card className="p-5"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-bad" />Quiz performance</p>{m.quizTrend.length ? <LineTrend data={m.quizTrend} xKey="label" lines={[{ key: "accuracy", color: "#fb7185", name: "Accuracy" }]} height={180} domain={[0, 100]} unit="%" /> : <p className="py-16 text-center text-sm text-muted">Take a quiz to see your trend.</p>}</Card>
          <Card className="p-5"><p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Flame className="h-4 w-4 text-warn" />Study consistency · 5 weeks</p><Heatmap days={m.heat} /></Card>
        </div>
      </section>
      <p className="text-center text-xs text-muted">All learning activity, quiz attempts and study hours are recorded live in your MentorMind account.</p>
    </div>
  );
}

function Insight({ title, color, children, empty }: { title: string; color: string; children: React.ReactNode[]; empty: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface2/50 p-3.5">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color }}>{title}</p>
      {children.length ? <ul className="space-y-2">{children}</ul> : <p className="text-xs text-muted">{empty}</p>}
    </div>
  );
}
function Row({ a, b, tone }: { a: string; b: string; tone: "bad" | "ok" | "warn" | "info" }) {
  const c = { bad: "bg-bad", ok: "bg-ok", warn: "bg-warn", info: "bg-brand2" }[tone];
  return <li className="flex gap-2.5"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${c}`} /><span className="min-w-0"><span className="block truncate text-sm font-medium">{a}</span><span className="block text-xs text-muted">{b}</span></span></li>;
}
