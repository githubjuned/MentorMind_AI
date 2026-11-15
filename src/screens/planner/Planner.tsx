"use client";
import { useMemo, useState } from "react";
import { CalendarClock, CalendarPlus, CheckCircle2, Circle, Clock, Pencil, Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Badge, Button, Card, Confirm, EmptyState, Field, Modal, PageHeader, SectionTabs, Tabs, cn, useToast } from "@/components/common/ui";
import { PLANNER_TABS } from "@/components/navigation/sectionNav";
import { WEEKDAYS } from "@/data/seed";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { buildPlan, type PlanEntry } from "@/services/ai/demo";
import type { Difficulty, Task, TaskKind } from "@/types";
import { addDays, addMinutes, daysBetween, fmtDate, fmtTime, fmtWeekday, startOfWeek, todayStr, uid } from "@/utils";

const KINDS: { v: TaskKind; l: string }[] = [{ v: "study", l: "Study session" }, { v: "revision", l: "Revision" }, { v: "quiz", l: "Practice quiz" }, { v: "reminder", l: "Reminder" }, { v: "break", l: "Break" }];

export function TaskModal({ open, onClose, initial, defaultDate }: { open: boolean; onClose: () => void; initial?: Task | null; defaultDate?: string }) {
  const { state, update } = useApp();
  const toast = useToast();
  const [f, setF] = useState<Task>(() => initial ?? { id: uid(), title: "", subjectId: state.subjects[0]?.id ?? "", date: defaultDate ?? todayStr(), start: "16:00", minutes: 45, kind: "study", done: false, priority: "medium" });
  const [err, setErr] = useState("");
  const save = () => {
    if (f.title.trim().length < 2) return setErr("Give the task a title.");
    if (f.minutes < 5 || f.minutes > 480) return setErr("Duration must be between 5 and 480 minutes.");
    update((s) => ({ ...s, tasks: initial ? s.tasks.map((t) => (t.id === f.id ? f : t)) : [...s.tasks, f] }));
    toast(initial ? "Task updated" : "Task added"); onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit task" : "Add task"} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? "Save changes" : "Add task"}</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" className="sm:col-span-2" error={err}><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. SQL joins practice" autoFocus /></Field>
        <Field label="Subject"><select className="input" value={f.subjectId} onChange={(e) => setF({ ...f, subjectId: e.target.value })}>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Type"><select className="input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as TaskKind })}>{KINDS.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}</select></Field>
        <Field label="Date"><input type="date" className="input" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        <Field label="Start time"><input type="time" className="input" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></Field>
        <Field label="Duration (min)"><input type="number" className="input" min={5} max={480} value={f.minutes} onChange={(e) => setF({ ...f, minutes: +e.target.value })} /></Field>
        <Field label="Priority"><select className="input" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Task["priority"] })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></Field>
      </div>
    </Modal>
  );
}

export function TaskRow({ t, onEdit, onDelete, onResched }: { t: Task; onEdit: () => void; onDelete: () => void; onResched?: () => void }) {
  const { state, toggleTask } = useApp();
  const overdue = !t.done && t.date < todayStr() && t.kind !== "break";
  return (
    <li className={cn("flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-surface2", t.kind === "break" && "opacity-70")}>
      {t.kind === "break" || t.kind === "reminder" ? <span className="w-5 text-center text-sm">{t.kind === "break" ? "☕" : "🔔"}</span> : <button onClick={() => toggleTask(t.id)} aria-label={t.done ? "Mark incomplete" : "Mark complete"}>{t.done ? <CheckCircle2 className="h-5 w-5 text-ok" /> : <Circle className="h-5 w-5 text-muted hover:text-ok" />}</button>}
      <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: subjectColor(state, t.subjectId) }} />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", t.done && "text-muted line-through")}>{t.title}</p>
        <p className="text-xs text-muted">{fmtDate(t.date)} · {fmtTime(t.start)}–{fmtTime(addMinutes(t.start, t.minutes))} · {subjectName(state, t.subjectId).split(" ")[0]}</p>
      </div>
      {overdue && <Badge tone="bad">Overdue</Badge>}{t.kind === "revision" && <Badge tone="warn">Revision</Badge>}{t.kind === "quiz" && <Badge tone="bad">Quiz</Badge>}{t.priority === "high" && t.kind !== "break" && <Badge tone="brand">High</Badge>}
      <div className="flex shrink-0">
        {onResched && <button className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink" aria-label="Reschedule" title="Reschedule" onClick={onResched}><CalendarClock className="h-4 w-4" /></button>}
        <button className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink" aria-label="Edit task" onClick={onEdit}><Pencil className="h-4 w-4" /></button>
        <button className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-bad" aria-label="Delete task" onClick={onDelete}><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );
}

export default function Planner() {
  const { state, update, addActivity } = useApp();
  const toast = useToast();
  const today = todayStr();
  const nextExam = [...state.exams].filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const [entries, setEntries] = useState<(PlanEntry & { priority: "low" | "medium" | "high" })[]>([{ subjectId: nextExam?.subjectId ?? state.subjects[0]?.id ?? "", topics: [], difficulty: "medium", priority: "medium" }]);
  const [examDate, setExamDate] = useState(nextExam?.date ?? addDays(today, 14));
  const [hours, setHours] = useState(2);
  const [avail, setAvail] = useState(state.profile.availability);
  const [draft, setDraft] = useState<Task[] | null>(null);
  const [err, setErr] = useState("");
  const [view, setView] = useState<"day" | "week" | "pending" | "done">("day");
  const [date, setDate] = useState(today);
  const [modal, setModal] = useState<{ task?: Task } | null>(null);
  const [del, setDel] = useState<Task | null>(null);
  const [resched, setResched] = useState<{ task: Task; date: string; start: string } | null>(null);
  const [examModal, setExamModal] = useState(false);
  const [exam, setExam] = useState({ subjectId: state.subjects[0]?.id ?? "", title: "", date: addDays(today, 14) });

  const sorted = (l: Task[]) => [...l].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const dayTasks = sorted(state.tasks.filter((t) => t.date === date));
  const wkStart = startOfWeek(date);
  const week = Array.from({ length: 7 }, (_, i) => addDays(wkStart, i));
  const pending = sorted(state.tasks.filter((t) => !t.done && t.kind !== "break" && t.kind !== "reminder"));
  const done = sorted(state.tasks.filter((t) => t.done)).reverse();
  const exams = [...state.exams].sort((a, b) => a.date.localeCompare(b.date));
  const stats = { pending: pending.length, done: state.tasks.filter((t) => t.done).length, rev: state.tasks.filter((t) => t.kind === "revision" && !t.done).length };

  const generate = () => {
    const valid = entries.filter((e) => e.subjectId);
    if (!valid.length || valid.some((e) => !e.topics.length)) return setErr("Choose at least one topic for every subject.");
    if (examDate <= today) return setErr("Exam date must be in the future.");
    if (!Object.values(avail).some(Boolean)) return setErr("Select at least one available day.");
    setErr("");
    const tasks = buildPlan({ entries: valid.map((e) => ({ ...e, difficulty: e.priority === "high" ? "hard" : e.difficulty })), examDate, hoursPerDay: hours, start: today, availability: avail });
    setDraft(tasks);
  };
  const apply = () => {
    if (!draft) return;
    update((s) => {
      const sid = entries[0].subjectId;
      const hasExam = s.exams.some((e) => e.date === examDate && e.subjectId === sid);
      return { ...s, tasks: [...s.tasks, ...draft], exams: hasExam ? s.exams : [...s.exams, { id: uid(), subjectId: sid, title: `${subjectName(s, sid).split(" ")[0]} exam`, date: examDate }] };
    });
    addActivity("plan", `Generated a study plan (${draft.filter((t) => t.kind !== "break").length} sessions)`, `Exam on ${fmtDate(examDate)}`, "/planner");
    toast("Plan added to your planner"); setDraft(null);
  };
  const upd = (i: number, p: Partial<(typeof entries)[number]>) => setEntries((e) => e.map((x, j) => (j === i ? { ...x, ...p } : x)));

  const list = (items: Task[], empty: string) => items.length ? <ul>{items.map((t) => <TaskRow key={t.id} t={t} onEdit={() => setModal({ task: t })} onDelete={() => setDel(t)} onResched={t.done ? undefined : () => setResched({ task: t, date: t.date, start: t.start })} />)}</ul> : <EmptyState icon={CalendarClock} title={empty} action={<Button size="sm" icon={Plus} onClick={() => setModal({})}>Add task</Button>} />;

  return (
    <>
      <PageHeader title="Smart Study Planner" subtitle="Generate a schedule from your subjects, exam dates and available hours — then fine-tune every task." icon={CalendarClock} color="#34d399" eyebrow="Agent 4 · Planner" actions={<><Button variant="secondary" icon={CalendarPlus} onClick={() => setExamModal(true)}>Add exam</Button><Button icon={Plus} onClick={() => setModal({})}>Add task</Button></>} />
      <SectionTabs items={PLANNER_TABS} />
      <div className="grid gap-6 xl:grid-cols-[26rem_1fr]">
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold"><Wand2 className="h-4 w-4 text-ok" />Generate a plan</h2>
            {entries.map((e, i) => {
              const tops = state.topics.filter((t) => t.subjectId === e.subjectId);
              return (
                <div key={i} className="space-y-3 rounded-xl border border-line bg-surface2/50 p-3">
                  <div className="flex gap-2"><select className="input" value={e.subjectId} onChange={(ev) => upd(i, { subjectId: ev.target.value, topics: [] })} aria-label="Subject">{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>{entries.length > 1 && <Button variant="ghost" size="sm" icon={Trash2} aria-label="Remove subject" onClick={() => setEntries((x) => x.filter((_, j) => j !== i))} />}</div>
                  <div className="flex flex-wrap gap-1.5">{tops.map((t) => { const on = e.topics.includes(t.name); return <button key={t.id} aria-pressed={on} onClick={() => upd(i, { topics: on ? e.topics.filter((x) => x !== t.name) : [...e.topics, t.name] })} className={cn("chip", on && "chip-on")}>{t.name}</button>; })}{!tops.length && <span className="text-xs text-muted">No topics for this subject yet.</span>}</div>
                  <div className="grid grid-cols-2 gap-2"><select className="input" value={e.difficulty} onChange={(ev) => upd(i, { difficulty: ev.target.value as Difficulty })} aria-label="Topic difficulty"><option value="easy">Easy topics</option><option value="medium">Medium topics</option><option value="hard">Hard topics</option></select><select className="input" value={e.priority} onChange={(ev) => upd(i, { priority: ev.target.value as "low" | "medium" | "high" })} aria-label="Priority"><option value="low">Low priority</option><option value="medium">Normal priority</option><option value="high">High priority</option></select></div>
                </div>
              );
            })}
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => setEntries((e) => [...e, { subjectId: state.subjects[0]?.id ?? "", topics: [], difficulty: "medium", priority: "medium" }])}>Add another subject</Button>
            <div className="grid grid-cols-2 gap-3"><Field label="Examination date"><input type="date" className="input" min={addDays(today, 1)} value={examDate} onChange={(e) => setExamDate(e.target.value)} /></Field><Field label={`Hours per day: ${hours}`}><input type="range" min={1} max={6} value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-3 w-full accent-[var(--brand)]" aria-label="Hours per day" /></Field></div>
            <Field label="Daily availability"><div className="flex flex-wrap gap-1.5">{WEEKDAYS.map((d) => <button key={d} aria-pressed={avail[d]} onClick={() => setAvail({ ...avail, [d]: !avail[d] })} className={cn("chip w-12 justify-center", avail[d] && "chip-on")}>{d}</button>)}</div></Field>
            {err && <p role="alert" className="text-sm font-medium text-bad">{err}</p>}
            <Button className="w-full" icon={Sparkles} onClick={generate}>Generate schedule</Button>
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 font-display text-base font-semibold">Upcoming examinations</h2>
            <ul className="space-y-2">{exams.map((e) => { const d = daysBetween(today, e.date); return (<li key={e.id} className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2.5"><span className="h-8 w-1 rounded-full" style={{ background: subjectColor(state, e.subjectId) }} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{e.title}</p><p className="text-xs text-muted">{fmtDate(e.date, true)}</p></div><Badge tone={d < 0 ? "muted" : d <= 7 ? "bad" : "info"}>{d < 0 ? "Past" : d === 0 ? "Today" : `${d}d`}</Badge><button aria-label="Delete exam" className="text-muted hover:text-bad" onClick={() => update((s) => ({ ...s, exams: s.exams.filter((x) => x.id !== e.id) }))}><Trash2 className="h-4 w-4" /></button></li>); })}{!exams.length && <li className="text-sm text-muted">No exams added.</li>}</ul>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          {draft && (
            <Card className="anim-fade-up border-ok/40 p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2"><Badge tone="ok">Draft plan</Badge><p className="text-sm text-muted">{draft.filter((t) => t.kind !== "break").length} sessions · {[...new Set(draft.map((t) => t.date))].length} days · includes revision before the exam and breaks</p><div className="ml-auto flex gap-2"><Button size="sm" variant="ghost" onClick={() => setDraft(null)}>Discard</Button><Button size="sm" icon={CalendarPlus} onClick={apply}>Add to planner</Button></div></div>
              <div className="max-h-72 overflow-y-auto"><ul>{sorted(draft).filter((t) => t.kind !== "break").slice(0, 40).map((t) => <li key={t.id} className="flex items-center justify-between gap-3 border-b border-line/50 px-2 py-2 text-sm"><span className="flex min-w-0 items-center gap-2"><span className="h-5 w-1 rounded-full" style={{ background: subjectColor(state, t.subjectId) }} /><span className="truncate">{t.title}</span>{t.kind === "revision" && <Badge tone="warn">Revision</Badge>}{t.kind === "quiz" && <Badge tone="bad">Quiz</Badge>}</span><span className="shrink-0 text-xs text-muted">{fmtWeekday(t.date)} {fmtDate(t.date)} · {fmtTime(t.start)}</span></li>)}</ul></div>
            </Card>
          )}
          <div className="grid grid-cols-3 gap-3 text-center">{[["Pending", stats.pending, "text-warn"], ["Completed", stats.done, "text-ok"], ["Revision due", stats.rev, "text-brand"]].map(([l, v, c]) => <Card key={l as string} className="p-4"><p className={cn("font-display text-2xl font-bold", c as string)}>{v}</p><p className="text-xs text-muted">{l}</p></Card>)}</div>
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Tabs value={view} onChange={setView} tabs={[{ id: "day", label: "Daily plan" }, { id: "week", label: "Weekly schedule" }, { id: "pending", label: "Pending", count: pending.length }, { id: "done", label: "Completed", count: done.length }]} />
              {(view === "day" || view === "week") && <div className="flex items-center gap-2"><Button size="sm" variant="secondary" onClick={() => setDate(addDays(date, view === "day" ? -1 : -7))} aria-label="Previous">‹</Button><input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="input w-auto py-1.5 text-xs" aria-label="Selected date" /><Button size="sm" variant="secondary" onClick={() => setDate(addDays(date, view === "day" ? 1 : 7))} aria-label="Next">›</Button><Button size="sm" variant="ghost" onClick={() => setDate(today)}>Today</Button></div>}
            </div>
            {view === "day" && <><p className="mb-2 flex items-center gap-2 text-sm text-muted"><Clock className="h-4 w-4" />{fmtWeekday(date)}, {fmtDate(date, true)} · {dayTasks.filter((t) => t.kind !== "break").length} sessions</p>{list(dayTasks, "Nothing scheduled for this day")}</>}
            {view === "week" && (
              <div className="grid gap-2 md:grid-cols-7">{week.map((d) => { const ts = sorted(state.tasks.filter((t) => t.date === d && t.kind !== "break")); return (
                <div key={d} className={cn("min-h-28 rounded-xl border p-2", d === today ? "border-brand bg-brand/10" : "border-line bg-surface2/40")}>
                  <button onClick={() => { setDate(d); setView("day"); }} className="mb-2 block w-full text-left text-xs font-bold">{fmtWeekday(d)} <span className="font-normal text-muted">{fmtDate(d)}</span></button>
                  {ts.map((t) => <button key={t.id} onClick={() => setModal({ task: t })} className={cn("mb-1 block w-full truncate rounded-md px-1.5 py-1 text-left text-[11px]", t.done && "line-through opacity-60")} style={{ background: `${subjectColor(state, t.subjectId)}22`, color: subjectColor(state, t.subjectId) }} title={t.title}>{fmtTime(t.start).replace(" ", "")} {t.title}</button>)}
                  {!ts.length && <p className="text-[11px] text-muted">Free</p>}
                </div>); })}</div>
            )}
            {view === "pending" && list(pending, "No pending tasks — nice!")}
            {view === "done" && list(done, "No completed tasks yet")}
          </Card>
        </div>
      </div>

      {modal && <TaskModal key={modal.task?.id ?? "new"} open onClose={() => setModal(null)} initial={modal.task} defaultDate={date} />}
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Delete task?" body={<>“{del?.title}” will be removed from your planner.</>} confirmLabel="Delete" onConfirm={() => { update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== del?.id), sessions: s.sessions.filter((x) => x.id !== `task-${del?.id}`) })); toast("Task deleted", "info"); }} />
      <Modal open={!!resched} onClose={() => setResched(null)} title="Reschedule task" size="sm" footer={<><Button variant="ghost" onClick={() => setResched(null)}>Cancel</Button><Button onClick={() => { if (resched) { update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === resched.task.id ? { ...t, date: resched.date, start: resched.start } : t)) })); toast("Task rescheduled"); setResched(null); } }}>Reschedule</Button></>}>
        {resched && <div className="space-y-4"><p className="text-sm font-medium">{resched.task.title}</p><div className="grid grid-cols-2 gap-3"><Field label="New date"><input type="date" className="input" value={resched.date} onChange={(e) => setResched({ ...resched, date: e.target.value })} /></Field><Field label="New time"><input type="time" className="input" value={resched.start} onChange={(e) => setResched({ ...resched, start: e.target.value })} /></Field></div><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setResched({ ...resched, date: addDays(today, 1) })}>Tomorrow</Button><Button size="sm" variant="secondary" onClick={() => setResched({ ...resched, date: addDays(resched.date, 7) })}>+1 week</Button></div></div>}
      </Modal>
      <Modal open={examModal} onClose={() => setExamModal(false)} title="Add examination" size="sm" footer={<><Button variant="ghost" onClick={() => setExamModal(false)}>Cancel</Button><Button onClick={() => { if (exam.date < today) return toast("Pick a future date", "error"); update((s) => ({ ...s, exams: [...s.exams, { id: uid(), subjectId: exam.subjectId, title: exam.title.trim() || `${subjectName(s, exam.subjectId).split(" ")[0]} exam`, date: exam.date }] })); setExamModal(false); toast("Exam added"); }}>Add exam</Button></>}>
        <div className="space-y-4"><Field label="Subject"><select className="input" value={exam.subjectId} onChange={(e) => setExam({ ...exam, subjectId: e.target.value })}>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Title"><input className="input" value={exam.title} onChange={(e) => setExam({ ...exam, title: e.target.value })} placeholder="e.g. Mid-term" /></Field><Field label="Date"><input type="date" className="input" value={exam.date} onChange={(e) => setExam({ ...exam, date: e.target.value })} /></Field></div>
      </Modal>
    </>
  );
}
