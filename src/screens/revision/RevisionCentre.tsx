"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarClock, Eye, EyeOff, History, Play, Plus, Repeat, Target } from "lucide-react";
import { Badge, Button, Card, EmptyState, Modal, PageHeader, SectionTabs, Tabs, Field, useToast } from "@/components/common/ui";
import { REVISION_TABS } from "@/components/navigation/sectionNav";
import { KB } from "@/data/knowledge";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { useStartQuiz } from "@/hooks/useStartQuiz";
import type { RevisionItem } from "@/types";
import { daysBetween, fmtDate, setHandoff, todayStr } from "@/utils";

const REASON = { weak: ["Weak topic", "bad"], mistake: ["Past mistakes", "warn"], exam: ["Exam topic", "info"], due: ["Spaced repetition", "brand"] } as const;

export default function RevisionCentre() {
  const { state, addRevision } = useApp();
  const router = useRouter();
  const toast = useToast();
  const startQuiz = useStartQuiz();
  const today = todayStr();
  const [tab, setTab] = useState<"all" | "due" | "weak" | "exam" | "mistake">("all");
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [add, setAdd] = useState(false);
  const [topicId, setTopicId] = useState("");

  const priority = (r: RevisionItem) => {
    const t = state.topics.find((x) => x.id === r.topicId);
    const overdue = Math.max(0, daysBetween(r.dueDate, today));
    const examSoon = state.exams.filter((e) => e.subjectId === r.subjectId && e.date >= today).map((e) => daysBetween(today, e.date)).sort((a, b) => a - b)[0];
    const score = overdue * 2 + ({ weak: 3, mistake: 3, exam: 2, due: 1 })[r.reason] + (100 - (t?.mastery ?? 50)) / 20 + (examSoon !== undefined && examSoon <= 14 ? 2 : 0) - (r.dueDate > today ? 3 : 0);
    return { score, label: score >= 6 ? "High" : score >= 3 ? "Medium" : "Low", tone: score >= 6 ? "bad" : score >= 3 ? "warn" : "ok", examSoon } as const;
  };
  const items = useMemo(() => state.revisions.map((r) => ({ r, p: priority(r) })).sort((a, b) => b.p.score - a.p.score), [state]); // eslint-disable-line react-hooks/exhaustive-deps
  const filtered = items.filter(({ r }) => tab === "all" || (tab === "due" ? r.dueDate <= today : r.reason === tab));
  const dueCount = state.revisions.filter((r) => r.dueDate <= today).length;
  const mistakes = [...state.mistakes].sort((a, b) => b.count - a.count);
  const start = (id: string) => { setHandoff("revision", id); router.push("/revision/session"); };
  const practiceMistakes = () => {
    const qs = mistakes.map((m) => KB.flatMap((k) => k.questions).find((q) => q.id === m.questionId)).filter((q): q is NonNullable<typeof q> => !!q).slice(0, 10);
    if (!qs.length) return toast("No questions to practise yet.", "error");
    startQuiz({ subjectId: qs[0].subjectId, topic: "Previously missed questions", difficulty: "medium", questions: qs });
  };
  const upcoming = [...state.exams].filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHeader title="Smart revision centre" subtitle="Topics due, weak spots, exam topics and past mistakes — ranked by priority." icon={Repeat} color="#fb923c" eyebrow="Agent 6 · Revision"
        actions={<><Button variant="secondary" icon={Plus} onClick={() => setAdd(true)}>Add topic</Button><Button icon={Play} disabled={!items.length} onClick={() => items[0] && start(items[0].r.topicId)}>Start top priority</Button></>} />
      <SectionTabs items={REVISION_TABS} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[["Due today or overdue", dueCount, AlertTriangle, "#fb7185"], ["Topics in queue", state.revisions.length, Repeat, "#fb923c"], ["Questions to re-practise", mistakes.length, Target, "#fbbf24"]].map(([l, v, I, c]) => { const Icon = I as typeof Repeat; return <Card key={l as string} className="flex items-center gap-4 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${c}22`, color: c as string }}><Icon className="h-5 w-5" /></span><div><p className="font-display text-2xl font-bold">{v as number}</p><p className="text-xs text-muted">{l as string}</p></div></Card>; })}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-base font-semibold">Revision queue</h2><Tabs value={tab} onChange={setTab} tabs={[{ id: "all", label: "All" }, { id: "due", label: "Due", count: dueCount }, { id: "weak", label: "Weak" }, { id: "exam", label: "Exam" }, { id: "mistake", label: "Mistakes" }]} /></div>
            {filtered.length ? (
              <ul className="space-y-3">
                {filtered.map(({ r, p }) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface2/50 p-4">
                    <span className="h-11 w-1.5 rounded-full" style={{ background: subjectColor(state, r.subjectId) }} />
                    <div className="min-w-0 flex-1"><p className="font-semibold">{r.topic}</p><p className="text-xs text-muted">{subjectName(state, r.subjectId)} · {r.dueDate < today ? `overdue since ${fmtDate(r.dueDate)}` : r.dueDate === today ? "due today" : `due ${fmtDate(r.dueDate)}`} · revised {r.revisionCount}×{p.examSoon !== undefined && p.examSoon <= 14 && ` · exam in ${p.examSoon}d`}</p></div>
                    <Badge tone={REASON[r.reason][1] as "bad"}>{REASON[r.reason][0]}</Badge><Badge tone={p.tone}>{p.label} priority</Badge>
                    <Button size="sm" icon={Play} onClick={() => start(r.topicId)}>Start revision</Button>
                  </li>
                ))}
              </ul>
            ) : <EmptyState icon={Repeat} title="Nothing in this list" body="Weak topics and quiz mistakes are added automatically, or add a topic yourself." action={<Button size="sm" icon={Plus} onClick={() => setAdd(true)}>Add topic</Button>} />}
            <p className="mt-4 text-xs text-muted">Priority combines overdue days, reason, mastery score and nearby exams.</p>
          </Card>
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="font-display text-base font-semibold">Previously incorrect quiz questions</h2><Button size="sm" variant="secondary" icon={Play} onClick={practiceMistakes} disabled={!mistakes.length}>Practise these</Button></div>
            {mistakes.length ? <ul className="space-y-2">{mistakes.slice(0, 8).map((m) => <li key={m.id} className="rounded-xl bg-surface2 p-3 text-sm"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="font-medium">{m.question}</p>{show[m.id] && <p className="mt-1 text-xs text-ok">Answer: {m.correct.split("|")[0]}</p>}<p className="mt-1 text-[11px] text-muted">{subjectName(state, m.subjectId).split(" ")[0]} · missed {m.count}× · last {fmtDate(m.lastSeen)}</p></div><button aria-label={show[m.id] ? "Hide answer" : "Show answer"} className="text-muted hover:text-ink" onClick={() => setShow({ ...show, [m.id]: !show[m.id] })}>{show[m.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></li>)}</ul> : <p className="py-6 text-center text-sm text-muted">No incorrect answers recorded. Take quizzes to build this list.</p>}
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><CalendarClock className="h-4 w-4 text-warn" />Upcoming examination topics</h2>
            <ul className="space-y-3">{upcoming.map((e) => { const rs = state.revisions.filter((r) => r.subjectId === e.subjectId); return <li key={e.id} className="rounded-xl bg-surface2 p-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{e.title}</p><Badge tone="info">{daysBetween(today, e.date)}d</Badge></div><p className="mb-2 text-xs text-muted">{fmtDate(e.date, true)}</p><div className="flex flex-wrap gap-1.5">{rs.length ? rs.map((r) => <button key={r.id} onClick={() => start(r.topicId)} className="chip">{r.topic}</button>) : <span className="text-xs text-muted">No topics queued for this subject.</span>}</div></li>; })}{!upcoming.length && <li className="text-sm text-muted">No upcoming exams.</li>}</ul></Card>
          <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><History className="h-4 w-4 text-brand" />Revision history</h2>
            <ul className="space-y-2">{state.revisionHistory.slice(0, 6).map((h) => <li key={h.id} className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{h.topic}</span><span className="shrink-0 text-xs text-muted">{fmtDate(h.date)} · {h.minutes}m{h.score != null && ` · ${h.score}%`}</span></li>)}{!state.revisionHistory.length && <li className="text-sm text-muted">No revisions completed yet.</li>}</ul></Card>
        </div>
      </div>
      <Modal open={add} onClose={() => setAdd(false)} title="Add a topic to revision" size="sm" footer={<><Button variant="ghost" onClick={() => setAdd(false)}>Cancel</Button><Button onClick={() => { if (!topicId) return toast("Select a topic", "error"); addRevision(topicId, "due"); setAdd(false); toast("Added to your revision queue"); }}>Add</Button></>}>
        <Field label="Topic"><select className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}><option value="">Select a topic</option>{state.topics.filter((t) => !state.revisions.some((r) => r.topicId === t.id)).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
      </Modal>
    </>
  );
}
