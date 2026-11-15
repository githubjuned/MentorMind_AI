"use client";
import { useMemo, useState } from "react";
import { Brain, ChevronDown, Clock, Eye, History, Lock, Pencil, RotateCcw, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { Badge, Button, Card, ChipSelect, Confirm, Field, Modal, PageHeader, Tabs, Toggle, cn, useToast } from "@/components/common/ui";
import { LEARNING_STYLES } from "@/data/seed";
import { useApp, subjectName } from "@/hooks/useApp";
import { fmtDate, minsLabel, timeAgo } from "@/utils";
import { bestStudyHour, improvement, streak, topicEvidence } from "@/utils/metrics";

const TAG = { stored: { l: "Stored", t: "info", d: "You provided this" }, inferred: { l: "Inferred", t: "warn", d: "Worked out from your activity" }, edited: { l: "You edited", t: "brand", d: "Changed by you" } } as const;
const Tag = ({ k }: { k: keyof typeof TAG }) => <Badge tone={TAG[k].t as "info"} className="shrink-0">{TAG[k].l}</Badge>;

export default function Memory() {
  const { state, update, addMemory, resetDemo, clearProfile } = useApp();
  const toast = useToast();
  const p = state.profile;
  const [prefs, setPrefs] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [draftStyles, setDraftStyles] = useState<string[]>(p.styles);
  const [draftGoals, setDraftGoals] = useState(p.goals);
  const [history, setHistory] = useState(false);
  const [hTab, setHTab] = useState<"sessions" | "quizzes" | "revisions">("sessions");
  const [confirm, setConfirm] = useState<"clear" | "reset" | null>(null);
  const [explain, setExplain] = useState(false);

  const m = useMemo(() => {
    const strong = state.topics.filter((t) => t.mastery >= 75).sort((a, b) => b.mastery - a.mastery);
    const weak = state.topics.filter((t) => t.status !== "not_started" && t.mastery < 60).sort((a, b) => a.mastery - b.mastery);
    const repeated = state.mistakes.filter((x) => x.count >= 2);
    const byDiff = (["easy", "medium", "hard"] as const).map((d) => { const a = state.attempts.filter((x) => x.difficulty === d); return { d, n: a.length, acc: a.length ? Math.round(a.reduce((s, x) => s + x.accuracy, 0) / a.length) : null }; });
    const types: Record<string, { r: number; n: number }> = {};
    state.attempts.forEach((a) => a.questions.forEach((q) => { const t = (types[q.type] ??= { r: 0, n: 0 }); t.n++; if (a.results[q.id]) t.r++; }));
    const typeAcc = Object.entries(types).map(([k, v]) => ({ k: { mcq: "Multiple choice", tf: "True/False", fill: "Fill in the blank", short: "Short answer" }[k] ?? k, acc: Math.round((v.r / v.n) * 100), n: v.n })).sort((a, b) => b.acc - a.acc);
    const wd: Record<string, number> = {};
    state.sessions.forEach((s) => { const d = new Date(s.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" }); wd[d] = (wd[d] ?? 0) + s.minutes; });
    const topDay = Object.entries(wd).sort((a, b) => b[1] - a[1])[0]?.[0];
    const avgSession = state.sessions.length ? Math.round(state.sessions.reduce((a, b) => a + b.minutes, 0) / state.sessions.length) : 0;
    const improving = state.topics.filter((t) => improvement(state, t.id) >= 10);
    return { strong, weak, repeated, byDiff, typeAcc, topDay, avgSession, improving, best: bestStudyHour(state.sessions) };
  }, [state]);

  const savePrefs = () => { update((s) => ({ ...s, profile: { ...s.profile, styles: draftStyles } })); addMemory("edited", "Learning preferences updated", `Preferred styles: ${draftStyles.join(", ") || "none selected"}.`); setPrefs(false); toast("Preferences updated"); };
  const saveGoals = () => { update((s) => ({ ...s, profile: { ...s.profile, goals: draftGoals } })); addMemory("edited", "Learning goals updated", draftGoals.slice(0, 120)); setGoalsOpen(false); toast("Goals updated"); };

  return (
    <>
      <PageHeader title="My learning memory" subtitle="Everything MentorMind remembers about your learning — what you told it, what it worked out, and what you can change." icon={Brain} color="#8b7bff" eyebrow="Personalisation"
        actions={<><Button variant="secondary" icon={History} onClick={() => setHistory(true)}>View learning history</Button><Button variant="secondary" icon={Pencil} onClick={() => { setDraftStyles(p.styles); setPrefs(true); }}>Edit preferences</Button></>} />

      <Card className="mb-6 grid gap-4 border-brand/30 bg-brand/5 p-5 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">{(Object.keys(TAG) as (keyof typeof TAG)[]).map((k) => <span key={k} className="flex items-center gap-2"><Tag k={k} /><span className="text-muted">{TAG[k].d}</span></span>)}</div>
          <p className="flex items-start gap-2 text-sm text-muted"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Your memory stays in this browser. It isn&apos;t shared with other students. Educators only ever see anonymous class-level totals, and only if you allow that in Settings → Privacy.</p>
          <div className="flex items-center gap-3 text-sm"><Toggle checked={state.settings.privacy.useMemory} onChange={(v) => { update((s) => ({ ...s, settings: { ...s.settings, privacy: { ...s.settings.privacy, useMemory: v } } })); toast(v ? "Memory will personalise your experience" : "Memory personalisation paused", "info"); }} label="Use memory to personalise" /><span>Use my learning memory to personalise explanations and plans</span></div>
        </div>
        <button onClick={() => setExplain((e) => !e)} className="flex items-center gap-1 self-start text-sm font-semibold text-brand hover:underline" aria-expanded={explain}>How memory works<ChevronDown className={cn("h-4 w-4 transition", explain && "rotate-180")} /></button>
        {explain && <div className="md:col-span-2 grid gap-3 rounded-xl bg-surface p-4 text-sm text-muted md:grid-cols-3"><p><b className="text-ink">Stored</b> — things you entered: profile, goals, preferred styles, subjects, notes, tasks.</p><p><b className="text-ink">Inferred</b> — patterns calculated from quizzes, sessions and mistakes (e.g. weak topics). They can be wrong, show their evidence, and update as you learn.</p><p><b className="text-ink">Your control</b> — edit preferences and goals, dismiss any timeline entry, pause personalisation, or clear everything below. Learning styles aren&apos;t fixed labels; they&apos;re starting points.</p></div>}
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-base font-semibold"><UserRound className="h-4 w-4 text-brand" />Learning profile</h2><Tag k="stored" /></div>
          <dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted">Name</dt><dd>{p.name}</dd></div><div className="flex justify-between"><dt className="text-muted">Department</dt><dd>{p.department}</dd></div><div className="flex justify-between"><dt className="text-muted">Year</dt><dd>{p.year}</dd></div><div className="flex justify-between"><dt className="text-muted">Daily study target</dt><dd>{minsLabel(p.dailyMinutes)}</dd></div></dl>
          <div className="mt-4 border-t border-line pt-4"><div className="mb-2 flex items-center justify-between"><p className="label !mb-0">Learning goals</p><button className="text-xs font-semibold text-brand hover:underline" onClick={() => { setDraftGoals(p.goals); setGoalsOpen(true); }}>Update</button></div><p className="text-sm text-muted">{p.goals || "No goals written yet."}</p></div>
          <div className="mt-4 border-t border-line pt-4"><p className="label">Subjects of interest</p><div className="flex flex-wrap gap-1.5">{state.subjects.map((s) => <Badge key={s.id} color={s.color}>{s.name.split(" (")[0]}</Badge>)}</div></div></Card>
        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Preferred explanation style</h2><Tag k="stored" /></div>
          <div className="flex flex-wrap gap-2">{p.styles.map((s) => <Badge key={s} tone="brand" className="px-3 py-1.5">{s}</Badge>)}{!p.styles.length && <span className="text-sm text-muted">None selected.</span>}</div>
          <p className="mt-3 text-xs text-muted">Editable any time. These guide the default answer format and notes style, but they&apos;re refined by what you actually use — they&apos;re not a permanent label.</p>
          <Button size="sm" variant="secondary" className="mt-3" icon={Pencil} onClick={() => { setDraftStyles(p.styles); setPrefs(true); }}>Edit</Button></Card>
        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Study habits</h2><Tag k="inferred" /></div>
          {state.sessions.length ? <ul className="space-y-2.5 text-sm"><li className="flex justify-between"><span className="text-muted">Most productive time</span><b>{m.best}</b></li><li className="flex justify-between"><span className="text-muted">Most active day</span><b>{m.topDay}</b></li><li className="flex justify-between"><span className="text-muted">Average session</span><b>{minsLabel(m.avgSession)}</b></li><li className="flex justify-between"><span className="text-muted">Current streak</span><b>{streak(state.sessions)} days</b></li></ul> : <p className="text-sm text-muted">No sessions recorded yet.</p>}
          <p className="mt-3 text-xs text-muted">Calculated from {state.sessions.length} recorded sessions.</p></Card>

        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Strong topics</h2><Tag k="inferred" /></div>
          <ul className="space-y-2.5">{m.strong.slice(0, 5).map((t) => <li key={t.id}><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted">{topicEvidence(state, t)}</p></li>)}{!m.strong.length && <li className="text-sm text-muted">No topic above 75% mastery yet.</li>}</ul></Card>
        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Weak topics</h2><Tag k="inferred" /></div>
          <ul className="space-y-2.5">{m.weak.slice(0, 5).map((t) => <li key={t.id}><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted">{topicEvidence(state, t)}</p></li>)}{!m.weak.length && <li className="text-sm text-muted">No weak topics detected.</li>}</ul></Card>
        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Repeated mistakes</h2><Tag k="inferred" /></div>
          <ul className="space-y-2.5">{m.repeated.slice(0, 4).map((x) => <li key={x.id} className="text-sm"><p className="line-clamp-2 font-medium">{x.question}</p><p className="text-xs text-muted">Missed {x.count}× · {subjectName(state, x.subjectId).split(" ")[0]}</p></li>)}{!m.repeated.length && <li className="text-sm text-muted">No question missed more than once.</li>}</ul></Card>

        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Quiz performance patterns</h2><Tag k="inferred" /></div>
          {state.attempts.length ? <><ul className="space-y-1.5 text-sm">{m.byDiff.map((d) => <li key={d.d} className="flex justify-between"><span className="capitalize text-muted">{d.d} quizzes ({d.n})</span><b>{d.acc === null ? "—" : `${d.acc}%`}</b></li>)}</ul><div className="my-3 border-t border-line" /><p className="label">By question type</p><ul className="space-y-1.5 text-sm">{m.typeAcc.map((t) => <li key={t.k} className="flex justify-between"><span className="text-muted">{t.k} ({t.n})</span><b>{t.acc}%</b></li>)}</ul></> : <p className="text-sm text-muted">Take quizzes to see patterns.</p>}</Card>
        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Recently improved</h2><Tag k="inferred" /></div>
          <ul className="space-y-2.5">{m.improving.map((t) => <li key={t.id} className="text-sm"><p className="font-medium">{t.name}</p><p className="text-xs text-ok">+{improvement(state, t.id)} points between first and latest quiz</p></li>)}{!m.improving.length && <li className="text-sm text-muted">Appears after repeated quizzes on the same topic.</li>}</ul></Card>
        <Card className="p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Revision history</h2><Tag k="stored" /></div>
          <ul className="space-y-2 text-sm">{state.revisionHistory.slice(0, 5).map((r) => <li key={r.id} className="flex justify-between gap-2"><span className="truncate">{r.topic}</span><span className="shrink-0 text-xs text-muted">{fmtDate(r.date)}</span></li>)}{!state.revisionHistory.length && <li className="text-muted">No revisions yet.</li>}</ul></Card>
      </div>

      <Card className="mt-6 p-5"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-base font-semibold"><Clock className="h-4 w-4 text-brand" />How your learning profile evolved</h2><Badge>{state.memory.length} entries</Badge></div>
        <ol className="relative space-y-4 border-l border-line pl-6">
          {state.memory.slice(0, 14).map((e) => (
            <li key={e.id} className="relative"><span className={cn("absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-surface", e.kind === "inferred" ? "bg-warn" : e.kind === "edited" ? "bg-brand" : "bg-brand2")} />
              <div className="flex flex-wrap items-center gap-2"><Tag k={e.kind} /><p className="text-sm font-semibold">{e.title}</p><span className="text-xs text-muted">{fmtDate(e.date, true)}</span><button className="ml-auto rounded p-1 text-muted hover:text-bad" aria-label={`Dismiss: ${e.title}`} title="Dismiss this entry" onClick={() => update((s) => ({ ...s, memory: s.memory.filter((x) => x.id !== e.id) }))}><X className="h-3.5 w-3.5" /></button></div>
              <p className="mt-0.5 text-xs text-muted">{e.detail}</p></li>
          ))}
          {!state.memory.length && <li className="text-sm text-muted">No memory entries.</li>}
        </ol></Card>

      <Card className="mt-6 border-bad/30 p-5"><h2 className="mb-1 flex items-center gap-2 font-display text-base font-semibold"><ShieldCheck className="h-4 w-4 text-bad" />Your data controls</h2><p className="mb-4 text-sm text-muted">{state.isSample ? "You are currently viewing sample demo data." : "Sample data has been cleared."} Both actions only affect this browser.</p>
        <div className="flex flex-wrap gap-2"><Button variant="danger" icon={Trash2} onClick={() => setConfirm("clear")}>Clear learning profile</Button><Button variant="secondary" icon={RotateCcw} onClick={() => setConfirm("reset")}>Reset to sample data</Button></div></Card>

      <Modal open={prefs} onClose={() => setPrefs(false)} title="Edit learning preferences" footer={<><Button variant="ghost" onClick={() => setPrefs(false)}>Cancel</Button><Button onClick={savePrefs}>Save preferences</Button></>}><p className="mb-4 text-sm text-muted">Choose as many as you like. You can change them any time, and they are refined by your activity.</p><ChipSelect options={LEARNING_STYLES} value={draftStyles} onChange={setDraftStyles} /></Modal>
      <Modal open={goalsOpen} onClose={() => setGoalsOpen(false)} title="Update learning goals" footer={<><Button variant="ghost" onClick={() => setGoalsOpen(false)}>Cancel</Button><Button onClick={saveGoals}>Save goals</Button></>}><Field label="Your goals"><textarea className="input min-h-32" value={draftGoals} onChange={(e) => setDraftGoals(e.target.value)} /></Field></Modal>
      <Modal open={history} onClose={() => setHistory(false)} title="Learning history" size="lg" footer={<Button onClick={() => setHistory(false)}>Close</Button>}>
        <Tabs value={hTab} onChange={setHTab} tabs={[{ id: "sessions", label: "Sessions", count: state.sessions.length }, { id: "quizzes", label: "Quizzes", count: state.attempts.length }, { id: "revisions", label: "Revisions", count: state.revisionHistory.length }]} />
        <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1 text-sm">
          {hTab === "sessions" && [...state.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 40).map((s) => <li key={s.id} className="flex justify-between gap-3 rounded-lg bg-surface2 px-3 py-2"><span className="truncate">{s.topic} <span className="text-xs text-muted">· {s.kind}</span></span><span className="shrink-0 text-xs text-muted">{fmtDate(s.date)} · {s.minutes}m</span></li>)}
          {hTab === "quizzes" && state.attempts.map((a) => <li key={a.id} className="flex justify-between gap-3 rounded-lg bg-surface2 px-3 py-2"><span className="truncate">{a.topic} <span className="text-xs text-muted">· {a.difficulty}</span></span><span className="shrink-0 text-xs text-muted">{fmtDate(a.date.slice(0, 10))} · {a.accuracy}%</span></li>)}
          {hTab === "revisions" && state.revisionHistory.map((r) => <li key={r.id} className="flex justify-between gap-3 rounded-lg bg-surface2 px-3 py-2"><span className="truncate">{r.topic}</span><span className="shrink-0 text-xs text-muted">{fmtDate(r.date)} · {r.minutes}m{r.score != null && ` · ${r.score}%`}</span></li>)}
          {((hTab === "sessions" && !state.sessions.length) || (hTab === "quizzes" && !state.attempts.length) || (hTab === "revisions" && !state.revisionHistory.length)) && <li className="py-6 text-center text-muted">Nothing recorded yet.</li>}
        </ul>
      </Modal>
      <Confirm open={confirm === "clear"} onClose={() => setConfirm(null)} danger title="Clear your learning profile?" confirmLabel="Clear everything" body="This removes sessions, quiz history, mistakes, revision queue, inferred insights, tasks and activity from this browser. Your preferences, goals, notes and materials are kept." onConfirm={() => { clearProfile(); toast("Learning profile cleared", "info"); }} />
      <Confirm open={confirm === "reset"} onClose={() => setConfirm(null)} title="Reset to sample data?" confirmLabel="Reset" body="All your changes to learning data will be replaced with the original sample dataset. Your profile details and settings stay." onConfirm={() => { resetDemo(); toast("Sample data restored", "info"); }} />
      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted"><Eye className="h-3.5 w-3.5" />Last updated {state.memory[0] ? timeAgo(new Date(state.memory[0].date + "T12:00:00").toISOString()) : "never"}</p>
    </>
  );
}
