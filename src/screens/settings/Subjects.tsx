"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, ListPlus, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, Confirm, EmptyState, Field, Modal, PageHeader, Progress, Ring, cn, useToast } from "@/components/common/ui";
import { SUBJECT_COLORS } from "@/data/seed";
import { useApp } from "@/hooks/useApp";
import type { Difficulty, Subject, Topic } from "@/types";
import { minsLabel, setHandoff, uid } from "@/utils";
import { subjectStats } from "@/utils/metrics";

export default function Subjects() {
  const { state, update, addMemory } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [edit, setEdit] = useState<Subject | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState("");
  const [topicsFor, setTopicsFor] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newDiff, setNewDiff] = useState<Difficulty>("medium");
  const [del, setDel] = useState<Subject | null>(null);
  const stats = subjectStats(state);

  const open = (s?: Subject) => { setIsNew(!s); setErr(""); setEdit(s ?? { id: uid(), name: "", color: SUBJECT_COLORS[state.subjects.length % SUBJECT_COLORS.length], targetHours: 4 }); };
  const save = () => {
    if (!edit) return;
    if (edit.name.trim().length < 2) return setErr("Enter a subject name.");
    if (state.subjects.some((s) => s.id !== edit.id && s.name.toLowerCase() === edit.name.trim().toLowerCase())) return setErr("You already have a subject with this name.");
    const sub = { ...edit, name: edit.name.trim() };
    update((s) => ({ ...s, subjects: isNew ? [...s.subjects, sub] : s.subjects.map((x) => (x.id === sub.id ? sub : x)) }));
    if (isNew) addMemory("stored", `Subject added: ${sub.name}`, "You added a subject of interest.");
    toast(isNew ? "Subject added" : "Subject updated"); setEdit(null);
  };
  const startLearning = (id: string) => {
    const t = state.topics.filter((x) => x.subjectId === id && x.status !== "completed").sort((a, b) => a.mastery - b.mastery)[0];
    setHandoff("assistant", t ? `Explain ${t.name}` : `Give me a revision plan for ${state.subjects.find((s) => s.id === id)?.name}`);
    router.push("/assistant");
  };
  const addTopic = () => {
    if (!topicsFor || newTopic.trim().length < 2) return toast("Enter a topic name", "error");
    const t: Topic = { id: uid(), subjectId: topicsFor, name: newTopic.trim(), status: "not_started", mastery: 0, difficulty: newDiff };
    update((s) => ({ ...s, topics: [...s.topics, t] })); setNewTopic(""); toast("Topic added");
  };
  const tSub = state.subjects.find((s) => s.id === topicsFor);

  return (
    <>
      <PageHeader title="My subjects" subtitle="Everything you're studying, with progress, quiz performance and weak areas at a glance." icon={BookOpen} color="#8b7bff" eyebrow="Library" actions={<Button icon={Plus} onClick={() => open()}>Add subject</Button>} />
      {stats.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.subject.id} className="card-hover relative flex flex-col overflow-hidden p-5">
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: s.subject.color }} />
              <div className="flex items-start gap-4">
                <Ring value={s.progress} size={80} stroke={8} color={s.subject.color} />
                <div className="min-w-0 flex-1"><h2 className="font-display text-base font-bold leading-snug">{s.subject.name}</h2><p className="mt-1 text-xs text-muted">{s.done}/{s.total} topics completed</p><div className="mt-2"><Progress value={s.total ? (s.done / s.total) * 100 : 0} color={s.subject.color} height={5} /></div></div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-surface2 px-3 py-2"><dt className="text-[11px] uppercase tracking-wide text-muted">Quiz performance</dt><dd className="font-bold">{s.quizAcc === null ? "—" : `${s.quizAcc}%`} <span className="text-xs font-normal text-muted">({s.quizCount})</span></dd></div><div className="rounded-xl bg-surface2 px-3 py-2"><dt className="text-[11px] uppercase tracking-wide text-muted">Study time</dt><dd className="font-bold">{minsLabel(s.minutes)} <span className="text-xs font-normal text-muted">/ {s.subject.targetHours}h wk</span></dd></div></dl>
              <div className="mt-3 min-h-8"><p className="label">Weak areas</p><div className="flex flex-wrap gap-1.5">{s.weak.length ? s.weak.map((t) => <Badge key={t.id} tone="bad">{t.name} · {t.mastery}%</Badge>) : <span className="text-xs text-muted">None flagged</span>}</div></div>
              <div className="mt-auto flex gap-2 pt-4"><Button size="sm" className="flex-1" icon={Play} onClick={() => startLearning(s.subject.id)}>Start learning</Button><Button size="sm" variant="secondary" icon={ListPlus} aria-label="Manage topics" title="Manage topics" onClick={() => setTopicsFor(s.subject.id)} /><Button size="sm" variant="secondary" icon={Pencil} aria-label={`Edit ${s.subject.name}`} onClick={() => open(s.subject)} /><Button size="sm" variant="ghost" icon={Trash2} aria-label={`Delete ${s.subject.name}`} onClick={() => setDel(s.subject)} /></div>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon={BookOpen} title="No subjects yet" body="Add the subjects you're studying to track progress." action={<Button icon={Plus} onClick={() => open()}>Add subject</Button>} />}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? "Add subject" : "Edit subject"} size="sm" footer={<><Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>{isNew ? "Add subject" : "Save"}</Button></>}>
        {edit && <div className="space-y-4"><Field label="Subject name" error={err}><input className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} autoFocus /></Field><Field label={`Weekly target: ${edit.targetHours} hours`}><input type="range" min={1} max={20} value={edit.targetHours} onChange={(e) => setEdit({ ...edit, targetHours: +e.target.value })} className="w-full accent-[var(--brand)]" aria-label="Weekly target hours" /></Field><Field label="Colour"><div className="flex flex-wrap gap-2">{SUBJECT_COLORS.map((c) => <button key={c} aria-label={`Colour ${c}`} aria-pressed={edit.color === c} onClick={() => setEdit({ ...edit, color: c })} className={cn("h-8 w-8 rounded-full border-2", edit.color === c ? "border-ink" : "border-transparent")} style={{ background: c }} />)}</div></Field></div>}
      </Modal>
      <Modal open={!!topicsFor} onClose={() => setTopicsFor(null)} title={`Topics · ${tSub?.name ?? ""}`} footer={<Button onClick={() => setTopicsFor(null)}>Done</Button>}>
        <ul className="mb-4 space-y-2">{state.topics.filter((t) => t.subjectId === topicsFor).map((t) => (
          <li key={t.id} className="flex items-center gap-2 rounded-xl bg-surface2 px-3 py-2 text-sm"><span className="min-w-0 flex-1 truncate">{t.name}</span><span className="text-xs text-muted">{t.mastery}%</span>
            <select className="input !w-auto !py-1 text-xs" value={t.status} aria-label={`Status of ${t.name}`} onChange={(e) => update((s) => ({ ...s, topics: s.topics.map((x) => (x.id === t.id ? { ...x, status: e.target.value as Topic["status"] } : x)) }))}><option value="not_started">Not started</option><option value="learning">In progress</option><option value="completed">Completed</option></select>
            <button aria-label={`Remove ${t.name}`} className="text-muted hover:text-bad" onClick={() => update((s) => ({ ...s, topics: s.topics.filter((x) => x.id !== t.id) }))}><Trash2 className="h-4 w-4" /></button></li>
        ))}{!state.topics.some((t) => t.subjectId === topicsFor) && <li className="text-sm text-muted">No topics yet.</li>}</ul>
        <div className="flex gap-2"><input className="input" placeholder="New topic name" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTopic()} aria-label="New topic" /><select className="input !w-auto" value={newDiff} onChange={(e) => setNewDiff(e.target.value as Difficulty)} aria-label="Difficulty"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select><Button icon={Plus} onClick={addTopic}>Add</Button></div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} danger title={`Delete ${del?.name}?`} confirmLabel="Delete subject" body="The subject and its topics are removed. Existing sessions, notes and tasks stay but show as 'General'." onConfirm={() => { update((s) => ({ ...s, subjects: s.subjects.filter((x) => x.id !== del?.id), topics: s.topics.filter((t) => t.subjectId !== del?.id), revisions: s.revisions.filter((r) => r.subjectId !== del?.id) })); toast("Subject deleted", "info"); }} />
    </>
  );
}
