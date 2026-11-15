"use client";
import { useState } from "react";
import { CheckCircle2, Pencil, Plus, Target, Trash2, Trophy } from "lucide-react";
import { Badge, Button, Card, Confirm, EmptyState, Field, Modal, PageHeader, Progress, Tabs, useToast } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";
import type { Goal } from "@/types";
import { daysBetween, fmtDate, todayStr, uid } from "@/utils";

const KINDS = [["academic", "Academic"], ["daily", "Daily"], ["weekly", "Weekly"], ["exam", "Examination"]] as const;
const blank = (): Goal => ({ id: uid(), title: "", kind: "weekly", target: 5, progress: 0, unit: "tasks", done: false });

export default function Goals() {
  const { state, update, notify, addMemory, addActivity } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<"all" | Goal["kind"]>("all");
  const [edit, setEdit] = useState<Goal | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState("");
  const [del, setDel] = useState<Goal | null>(null);
  const list = state.goals.filter((g) => tab === "all" || g.kind === tab);
  const pending = list.filter((g) => !g.done);
  const done = list.filter((g) => g.done);

  const setProgress = (g: Goal, progress: number) => {
    const p = Math.max(0, Math.min(g.target, progress));
    const nowDone = p >= g.target;
    update((s) => ({ ...s, goals: s.goals.map((x) => (x.id === g.id ? { ...x, progress: p, done: nowDone } : x)) }));
    if (nowDone && !g.done) { if (state.settings.notifPrefs.goals) notify("goal", `Goal achieved: ${g.title}`, "Nicely done — you reached your target.", "/goals"); addActivity("topic", `Goal achieved: ${g.title}`, "Goals", "/goals"); toast("Goal achieved! 🎉"); }
  };
  const save = () => {
    if (!edit) return;
    if (edit.title.trim().length < 3) return setErr("Describe your goal (at least 3 characters).");
    if (!(edit.target > 0)) return setErr("Target must be greater than zero.");
    const g = { ...edit, title: edit.title.trim(), progress: Math.min(edit.progress, edit.target), done: edit.progress >= edit.target };
    update((s) => ({ ...s, goals: isNew ? [g, ...s.goals] : s.goals.map((x) => (x.id === g.id ? g : x)) }));
    if (isNew) addMemory("stored", `Goal added: ${g.title}`, `${g.kind} goal, target ${g.target} ${g.unit}.`);
    toast(isNew ? "Goal added" : "Goal updated"); setEdit(null);
  };
  const open = (g?: Goal) => { setErr(""); setIsNew(!g); setEdit(g ?? blank()); };
  const card = (g: Goal) => {
    const pct = (g.progress / g.target) * 100;
    const left = g.due ? daysBetween(todayStr(), g.due) : null;
    return (
      <Card key={g.id} className="p-5">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${g.done ? "bg-ok/15 text-ok" : "bg-brand/15 text-brand"}`}>{g.done ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}</span>
          <div className="min-w-0 flex-1"><h3 className={`text-sm font-semibold ${g.done ? "text-muted line-through" : ""}`}>{g.title}</h3><div className="mt-1 flex flex-wrap gap-1.5"><Badge tone="brand">{KINDS.find((k) => k[0] === g.kind)?.[1]}</Badge>{g.due && !g.done && <Badge tone={left! < 0 ? "bad" : left! <= 3 ? "warn" : "muted"}>{left! < 0 ? "Overdue" : left === 0 ? "Due today" : `${left}d left`} · {fmtDate(g.due)}</Badge>}</div></div>
          <div className="flex"><button className="rounded-lg p-1.5 text-muted hover:bg-surface2 hover:text-ink" aria-label="Edit goal" onClick={() => open(g)}><Pencil className="h-4 w-4" /></button><button className="rounded-lg p-1.5 text-muted hover:bg-surface2 hover:text-bad" aria-label="Delete goal" onClick={() => setDel(g)}><Trash2 className="h-4 w-4" /></button></div>
        </div>
        <div className="mt-4"><div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">Progress</span><span className="font-semibold">{g.progress}/{g.target} {g.unit} · {Math.round(pct)}%</span></div><Progress value={pct} color={g.done ? "var(--ok)" : "var(--brand)"} /></div>
        {!g.done && <div className="mt-4 flex items-center gap-2"><input type="range" min={0} max={g.target} value={g.progress} onChange={(e) => setProgress(g, +e.target.value)} className="flex-1 accent-[var(--brand)]" aria-label={`Progress for ${g.title}`} /><Button size="sm" variant="secondary" onClick={() => setProgress(g, g.progress + Math.max(1, Math.round(g.target / 10)))}>+ Step</Button><Button size="sm" variant="soft" icon={CheckCircle2} onClick={() => setProgress(g, g.target)}>Complete</Button></div>}
      </Card>
    );
  };

  return (
    <>
      <PageHeader title="My goals" subtitle="Set academic, daily, weekly and exam goals, then track them as you learn." icon={Target} color="#8b7bff" eyebrow="Library" actions={<Button icon={Plus} onClick={() => open()}>New goal</Button>} />
      <div className="mb-6 grid grid-cols-3 gap-3 text-center">{[["Pending", state.goals.filter((g) => !g.done).length, "text-warn"], ["Completed", state.goals.filter((g) => g.done).length, "text-ok"], ["Total", state.goals.length, ""]].map(([l, v, c]) => <Card key={l as string} className="p-4"><p className={`font-display text-2xl font-bold ${c}`}>{v}</p><p className="text-xs text-muted">{l}</p></Card>)}</div>
      <div className="mb-5 overflow-x-auto"><Tabs value={tab} onChange={setTab} tabs={[{ id: "all", label: "All" }, ...KINDS.map(([id, label]) => ({ id: id as Goal["kind"], label, count: state.goals.filter((g) => g.kind === id).length }))]} /></div>
      <h2 className="mb-3 font-display text-base font-semibold">Pending ({pending.length})</h2>
      {pending.length ? <div className="grid gap-4 lg:grid-cols-2">{pending.map(card)}</div> : <EmptyState icon={Target} title="No pending goals" body="Create a goal to give your studying a direction." action={<Button icon={Plus} onClick={() => open()}>New goal</Button>} />}
      {done.length > 0 && <><h2 className="mb-3 mt-8 font-display text-base font-semibold">Completed ({done.length})</h2><div className="grid gap-4 lg:grid-cols-2">{done.map(card)}</div></>}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? "New goal" : "Edit goal"} footer={<><Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>{isNew ? "Create goal" : "Save"}</Button></>}>
        {edit && <div className="grid gap-4 sm:grid-cols-2"><Field label="Goal" className="sm:col-span-2" error={err}><input className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="e.g. Finish 3 DBMS practice sets" autoFocus /></Field><Field label="Type"><select className="input" value={edit.kind} onChange={(e) => setEdit({ ...edit, kind: e.target.value as Goal["kind"] })}>{KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field><Field label="Due date (optional)"><input type="date" className="input" value={edit.due ?? ""} onChange={(e) => setEdit({ ...edit, due: e.target.value || undefined })} /></Field><Field label="Target"><input type="number" min={1} className="input" value={edit.target} onChange={(e) => setEdit({ ...edit, target: +e.target.value })} /></Field><Field label="Unit"><input className="input" value={edit.unit} onChange={(e) => setEdit({ ...edit, unit: e.target.value })} placeholder="tasks, min, quizzes, %" /></Field><Field label="Current progress" className="sm:col-span-2"><input type="number" min={0} className="input" value={edit.progress} onChange={(e) => setEdit({ ...edit, progress: +e.target.value })} /></Field></div>}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Delete this goal?" body={<>“{del?.title}” will be removed.</>} confirmLabel="Delete" onConfirm={() => { update((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== del?.id) })); toast("Goal deleted", "info"); }} />
    </>
  );
}
