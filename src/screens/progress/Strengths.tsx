"use client";
import { useMemo } from "react";
import { AlertTriangle, ArrowUpRight, Info, Repeat, ShieldCheck, Sparkles, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, Progress, SectionTabs } from "@/components/common/ui";
import { PROGRESS_TABS } from "@/components/navigation/sectionNav";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { setHandoff, fmtDate } from "@/utils";
import { improvement, subjectStats, topicEvidence, topicHistory } from "@/utils/metrics";
import { useRouter } from "next/navigation";

export default function Strengths() {
  const { state, addRevision } = useApp();
  const router = useRouter();
  const d = useMemo(() => {
    const stats = subjectStats(state).filter((s) => s.total > 0);
    const strongSubjects = stats.filter((s) => s.progress >= 65).sort((a, b) => b.progress - a.progress);
    const weakSubjects = stats.filter((s) => s.progress < 65).sort((a, b) => a.progress - b.progress);
    const needRev = state.topics.filter((t) => t.status !== "not_started" && t.mastery < 60).sort((a, b) => a.mastery - b.mastery);
    const improving = state.topics.map((t) => ({ t, delta: improvement(state, t.id), n: topicHistory(state.attempts, t.id).length })).filter((x) => x.delta >= 10).sort((a, b) => b.delta - a.delta);
    const repeated = state.mistakes.filter((m) => m.count >= 2).sort((a, b) => b.count - a.count);
    return { stats, strongSubjects, weakSubjects, needRev, improving, repeated };
  }, [state]);
  const attempts = state.attempts.length;
  const conf = (n: number) => (n >= 3 ? ["Higher confidence", "ok"] as const : n === 2 ? ["Moderate confidence", "warn"] as const : ["Low confidence", "bad"] as const);

  const recs = [
    ...d.needRev.slice(0, 3).map((t) => {
      const n = topicHistory(state.attempts, t.id).length;
      return { key: t.id, title: `Revise ${t.name}`, evidence: topicEvidence(state, t), n, action: "Start revision", run: () => { addRevision(t.id, "weak"); setHandoff("revision", t.id); router.push("/revision/session"); } };
    }),
    ...(d.repeated.length ? [{ key: "rep", title: "Re-practise questions you repeatedly miss", evidence: `${d.repeated.length} question${d.repeated.length > 1 ? "s" : ""} answered incorrectly 2+ times (most recent ${fmtDate(d.repeated[0].lastSeen)})`, n: d.repeated[0].count, action: "Open revision centre", run: () => router.push("/revision") }] : []),
    ...state.topics.filter((t) => t.status === "not_started").slice(0, 1).map((t) => ({ key: t.id, title: `Start ${t.name}`, evidence: "No study activity or quiz attempts recorded for this topic yet", n: 0, action: "Ask the assistant", run: () => { setHandoff("assistant", `Explain ${t.name}`); router.push("/assistant"); } })),
  ];

  return (
    <>
      <PageHeader title="Strengths & weaknesses" subtitle="What your recorded activity suggests — with the evidence behind every point." icon={AlertTriangle} color="#60a5fa" eyebrow="Agent 5 · Progress" />
      <SectionTabs items={PROGRESS_TABS} />
      <Card className="mb-6 flex gap-3 border-brand2/30 bg-brand2/5 p-4 text-sm"><Info className="mt-0.5 h-5 w-5 shrink-0 text-brand2" /><p className="text-muted">These insights are calculated only from <b className="text-ink">{attempts} quiz attempt{attempts === 1 ? "" : "s"}</b> and <b className="text-ink">{state.sessions.length} study sessions</b> stored in this browser{state.isSample && " (sample data)"}. Small samples can be misleading, so every item shows its evidence and a confidence level. They describe current performance, not ability.</p></Card>
      {!state.topics.some((t) => t.mastery > 0) && <EmptyState icon={ShieldCheck} title="Not enough data yet" body="Take a few quizzes and log study sessions to unlock evidence-based insights." action={<Button href="/quizzes">Take a quiz</Button>} />}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><TrendingUp className="h-4 w-4 text-ok" />Strong subjects</h2>
          <ul className="space-y-3">{d.strongSubjects.map((s) => <li key={s.subject.id}><div className="mb-1 flex justify-between text-sm"><span>{s.subject.name}</span><span className="font-bold text-ok">{s.progress}%</span></div><Progress value={s.progress} color={s.subject.color} height={6} /><p className="mt-1 text-xs text-muted">{s.done}/{s.total} topics completed{s.quizAcc !== null ? ` · ${s.quizCount} quiz${s.quizCount > 1 ? "zes" : ""}, avg ${s.quizAcc}%` : " · no quizzes yet"}</p></li>)}{!d.strongSubjects.length && <li className="text-sm text-muted">No subject above 65% mastery yet.</li>}</ul></Card>
        <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><TrendingDown className="h-4 w-4 text-bad" />Subjects needing attention</h2>
          <ul className="space-y-3">{d.weakSubjects.map((s) => <li key={s.subject.id}><div className="mb-1 flex justify-between text-sm"><span>{s.subject.name}</span><span className="font-bold text-bad">{s.progress}%</span></div><Progress value={s.progress} color="#fb7185" height={6} /><p className="mt-1 text-xs text-muted">{s.weak.length ? `Weak topics: ${s.weak.map((t) => t.name).join(", ")}` : "No individual weak topics flagged"}</p></li>)}{!d.weakSubjects.length && <li className="text-sm text-muted">All subjects are above 65% mastery.</li>}</ul></Card>
        <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><Repeat className="h-4 w-4 text-warn" />Topics needing revision</h2>
          <ul className="space-y-3">{d.needRev.map((t) => { const [c, tone] = conf(topicHistory(state.attempts, t.id).length); return <li key={t.id} className="rounded-xl bg-surface2 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{t.name}</p><Badge tone={tone}>{c}</Badge></div><p className="mt-1 text-xs text-muted"><b className="text-ink">Evidence:</b> {topicEvidence(state, t)}</p><p className="text-xs text-muted">{subjectName(state, t.subjectId)}</p></li>; })}{!d.needRev.length && <li className="text-sm text-muted">No started topic is below 60% mastery.</li>}</ul></Card>
        <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><ArrowUpRight className="h-4 w-4 text-ok" />Improving topics</h2>
          <ul className="space-y-3">{d.improving.map(({ t, delta, n }) => <li key={t.id} className="rounded-xl bg-surface2 p-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{t.name}</p><Badge tone="ok">+{delta} pts</Badge></div><p className="mt-1 text-xs text-muted"><b className="text-ink">Evidence:</b> quiz accuracy changed from {topicHistory(state.attempts, t.id)[0].accuracy}% to {topicHistory(state.attempts, t.id).at(-1)?.accuracy}% across {n} attempts.</p></li>)}{!d.improving.length && <li className="text-sm text-muted">Improvement shows up once you retake quizzes on the same topic.</li>}</ul></Card>
        <Card className="p-5 lg:col-span-2"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><AlertTriangle className="h-4 w-4 text-bad" />Repeated mistakes</h2>
          <ul className="grid gap-3 md:grid-cols-2">{d.repeated.map((m) => <li key={m.id} className="rounded-xl bg-surface2 p-3 text-sm"><div className="mb-1 flex items-center gap-2"><Badge tone="bad">Missed {m.count}×</Badge><Badge color={subjectColor(state, m.subjectId)}>{subjectName(state, m.subjectId).split(" ")[0]}</Badge></div><p className="font-medium">{m.question}</p><p className="mt-1 text-xs text-muted">Correct answer: <b className="text-ink">{m.correct.split("|")[0]}</b> · last seen {fmtDate(m.lastSeen)}</p></li>)}{!d.repeated.length && <li className="text-sm text-muted">No question has been answered incorrectly more than once.</li>}</ul></Card>
      </div>
      <h2 className="mb-3 mt-8 flex items-center gap-2 font-display text-lg font-semibold"><Sparkles className="h-5 w-5 text-brand" />Recommended actions</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recs.map((r) => { const [c, tone] = conf(r.n); return (
          <Card key={r.key} className="flex flex-col p-5"><div className="mb-2 flex items-center gap-2"><Zap className="h-4 w-4 text-brand" /><Badge tone={tone}>{c}</Badge></div><h3 className="font-display text-base font-semibold">{r.title}</h3><div className="mt-2 flex-1 rounded-xl bg-surface2 p-3 text-xs text-muted"><b className="text-ink">Why we suggest this:</b> {r.evidence}.</div><Button className="mt-4" size="sm" onClick={r.run}>{r.action}</Button></Card>
        ); })}
        {!recs.length && <p className="text-sm text-muted">No recommendations yet — activity is needed first.</p>}
      </div>
    </>
  );
}
