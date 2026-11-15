"use client";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge, Button, Card, PageHeader, SectionTabs, Segmented, cn } from "@/components/common/ui";
import { PLANNER_TABS } from "@/components/navigation/sectionNav";
import { TaskModal } from "@/screens/planner/Planner";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { addDays, fmtDate, fmtTime, fmtWeekday, parseDate, startOfWeek, toDateStr, todayStr } from "@/utils";

type Item = { id: string; label: string; color: string; kind: "task" | "exam" | "revision" | "reminder"; time?: string; done?: boolean; taskId?: string };

export default function Calendar() {
  const { state, toggleTask } = useApp();
  const today = todayStr();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [cursor, setCursor] = useState(today);
  const [selected, setSelected] = useState(today);
  const [modal, setModal] = useState<{ date: string; task?: (typeof state.tasks)[number] } | null>(null);

  const items = useMemo(() => {
    const map = new Map<string, Item[]>();
    const push = (d: string, i: Item) => map.set(d, [...(map.get(d) ?? []), i]);
    state.tasks.filter((t) => t.kind !== "break").forEach((t) => push(t.date, { id: t.id, taskId: t.id, label: t.title, color: subjectColor(state, t.subjectId), kind: t.kind === "revision" ? "revision" : t.kind === "reminder" ? "reminder" : "task", time: t.start, done: t.done }));
    state.exams.forEach((e) => push(e.date, { id: e.id, label: e.title, color: "#fb7185", kind: "exam" }));
    map.forEach((v, k) => map.set(k, v.sort((a, b) => (a.kind === "exam" ? -1 : b.kind === "exam" ? 1 : (a.time ?? "").localeCompare(b.time ?? "")))));
    return map;
  }, [state]);
  const at = (d: string) => items.get(d) ?? [];

  const move = (dir: number) => {
    const d = parseDate(cursor);
    if (view === "month") d.setMonth(d.getMonth() + dir); else d.setDate(d.getDate() + dir * (view === "week" ? 7 : 1));
    setCursor(toDateStr(d));
  };
  const first = parseDate(cursor);
  first.setDate(1);
  const gridStart = startOfWeek(toDateStr(first));
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i));
  const title = view === "month" ? parseDate(cursor).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : view === "week" ? `${fmtDate(weekDays[0])} – ${fmtDate(weekDays[6], true)}` : `${fmtWeekday(cursor)}, ${fmtDate(cursor, true)}`;
  const chip = (i: Item) => (
    <span key={i.id} className={cn("block truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium", i.done && "line-through opacity-60")} style={{ background: `${i.color}26`, color: i.color }} title={i.label}>{i.kind === "exam" ? "📝 " : i.kind === "reminder" ? "🔔 " : i.kind === "revision" ? "↻ " : ""}{i.label}</span>
  );
  const selItems = at(selected);

  const dayList = (d: string) => (
    <ul className="space-y-2">
      {at(d).map((i) => (
        <li key={i.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface2/60 p-3">
          <span className="h-9 w-1 rounded-full" style={{ background: i.color }} />
          <div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-semibold", i.done && "line-through opacity-60")}>{i.label}</p><p className="text-xs text-muted">{i.kind === "exam" ? "Examination" : `${i.time ? fmtTime(i.time) : ""} · ${i.kind === "revision" ? "Revision session" : i.kind === "reminder" ? "Reminder" : "Study session"}`}</p></div>
          {i.taskId && i.kind !== "reminder" && <Button size="sm" variant={i.done ? "soft" : "secondary"} onClick={() => toggleTask(i.taskId!)}>{i.done ? "Done" : "Complete"}</Button>}
          {i.taskId && <Button size="sm" variant="ghost" onClick={() => setModal({ date: d, task: state.tasks.find((t) => t.id === i.taskId) })}>Edit</Button>}
        </li>
      ))}
      {!at(d).length && <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">Nothing scheduled.</li>}
    </ul>
  );

  return (
    <>
      <PageHeader title="Study calendar" subtitle="Study sessions, revision, reminders and exam dates in one view. Click a date to add a session." icon={CalendarDays} color="#34d399" eyebrow="Agent 4 · Planner" actions={<Button icon={Plus} onClick={() => setModal({ date: selected })}>Add session</Button>} />
      <SectionTabs items={PLANNER_TABS} />
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <Card className="min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1"><Button size="sm" variant="secondary" icon={ChevronLeft} aria-label="Previous" onClick={() => move(-1)} /><Button size="sm" variant="secondary" icon={ChevronRight} aria-label="Next" onClick={() => move(1)} /><Button size="sm" variant="ghost" onClick={() => { setCursor(today); setSelected(today); }}>Today</Button></div>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <Segmented className="ml-auto" value={view} onChange={setView} options={[{ value: "month", label: "Month" }, { value: "week", label: "Week" }, { value: "day", label: "Day" }]} />
          </div>
          {view === "month" && (<>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="py-1">{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d) => { const its = at(d); const inMonth = parseDate(d).getMonth() === parseDate(cursor).getMonth(); return (
                <button key={d} onClick={() => setSelected(d)} onDoubleClick={() => setModal({ date: d })} aria-label={`${fmtDate(d, true)}, ${its.length} items`} aria-pressed={d === selected}
                  className={cn("min-h-[4.5rem] rounded-xl border p-1 text-left transition sm:min-h-24 sm:p-1.5", d === selected ? "border-brand bg-brand/10" : "border-line hover:border-brand/50", !inMonth && "opacity-40")}>
                  <span className={cn("mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold", d === today && "bg-brand text-white")}>{parseDate(d).getDate()}</span>
                  <span className="hidden space-y-0.5 sm:block">{its.slice(0, 3).map(chip)}{its.length > 3 && <span className="block text-[10px] text-muted">+{its.length - 3} more</span>}</span>
                  <span className="flex flex-wrap gap-0.5 sm:hidden">{its.slice(0, 4).map((i) => <span key={i.id} className="h-1.5 w-1.5 rounded-full" style={{ background: i.color }} />)}</span>
                </button>); })}
            </div>
          </>)}
          {view === "week" && (
            <div className="grid gap-2 md:grid-cols-7">{weekDays.map((d) => (
              <div key={d} className={cn("min-h-40 rounded-xl border p-2", d === today ? "border-brand bg-brand/10" : "border-line")}>
                <button onClick={() => { setSelected(d); setCursor(d); setView("day"); }} className="mb-2 block w-full text-left text-xs font-bold">{fmtWeekday(d)} <span className="font-normal text-muted">{fmtDate(d)}</span></button>
                <div className="space-y-1">{at(d).map(chip)}</div>
                <button onClick={() => setModal({ date: d })} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-line py-1 text-[11px] text-muted hover:border-brand hover:text-brand"><Plus className="h-3 w-3" />Add</button>
              </div>))}</div>
          )}
          {view === "day" && dayList(cursor)}
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">{fmtWeekday(selected)}, {fmtDate(selected)}</h2><Button size="sm" icon={Plus} onClick={() => setModal({ date: selected })}>Add</Button></div>
            {view !== "day" ? dayList(selected) : <p className="text-sm text-muted">{selItems.length} item{selItems.length === 1 ? "" : "s"} on this day.</p>}
          </Card>
          <Card className="p-5"><p className="label">Legend</p><div className="space-y-2 text-xs"><p className="flex items-center gap-2"><Badge color="#fb7185">📝 Exam</Badge>Examination date</p><p className="flex items-center gap-2"><Badge tone="warn">↻ Revision</Badge>Revision session</p><p className="flex items-center gap-2"><Badge tone="info">🔔</Badge>Reminder</p><p className="flex items-center gap-2 text-muted">Coloured by subject: {state.subjects.slice(0, 3).map((s) => <span key={s.id} className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{subjectName(state, s.id).split(" ")[0]}</span>)}</p></div></Card>
        </div>
      </div>
      {modal && <TaskModal key={(modal.task?.id ?? "new") + modal.date} open onClose={() => setModal(null)} initial={modal.task} defaultDate={modal.date} />}
    </>
  );
}
