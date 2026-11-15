"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, Circle, Coffee, Pause, Play, RotateCcw, Sun, Target } from "lucide-react";
import { DonutChart } from "@/components/charts/charts";
import { Badge, Button, Card, PageHeader, Progress, Ring, SectionTabs, cn, useToast } from "@/components/common/ui";
import { PLANNER_TABS } from "@/components/navigation/sectionNav";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { addMinutes, fmtTime, minsLabel, todayStr } from "@/utils";

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function Routine() {
  const { state, toggleTask } = useApp();
  const toast = useToast();
  const today = todayStr();
  const todays = useMemo(() => state.tasks.filter((t) => t.date === today).sort((a, b) => a.start.localeCompare(b.start)), [state.tasks, today]);
  const work = todays.filter((t) => t.kind !== "break" && t.kind !== "reminder");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [breakDue, setBreakDue] = useState(false);
  const idRef = useRef<string | null>(null);
  const active = todays.find((t) => t.id === activeId);

  const pick = (id: string) => {
    const t = todays.find((x) => x.id === id);
    if (!t) return;
    setActiveId(id); idRef.current = id; setLeft(t.minutes * 60); setRunning(false); setBreakDue(false);
  };
  useEffect(() => { if (!activeId) { const next = work.find((t) => !t.done); if (next) pick(next.id); } /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [todays.length]);
  useEffect(() => {
    if (!running) return;
    if (left <= 0) { setRunning(false); setBreakDue(true); toast("Session time is up. Mark it complete and take a break!", "info"); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left, toast]);

  const complete = () => {
    if (!active) return;
    if (!active.done) toggleTask(active.id);
    toast(`Session completed: ${active.title}`);
    setRunning(false);
    const next = work.find((t) => !t.done && t.id !== active.id);
    if (next) { setBreakDue(true); } else setBreakDue(false);
  };
  const goNext = () => { const next = work.find((t) => !t.done && t.id !== activeId); if (next) pick(next.id); setBreakDue(false); };

  const planned = work.reduce((a, t) => a + t.minutes, 0);
  const doneMin = work.filter((t) => t.done).reduce((a, t) => a + t.minutes, 0);
  const bySubject = state.subjects.map((s) => ({ s, plan: work.filter((t) => t.subjectId === s.id).reduce((a, t) => a + t.minutes, 0), done: work.filter((t) => t.subjectId === s.id && t.done).reduce((a, t) => a + t.minutes, 0) })).filter((x) => x.plan > 0);
  const dailyGoals = state.goals.filter((g) => g.kind === "daily");
  const total = active ? active.minutes * 60 : 1;

  return (
    <>
      <PageHeader title="Daily study routine" subtitle="Run today's sessions with a focus timer, break reminders and live goal tracking." icon={Sun} color="#34d399" eyebrow="Agent 4 · Planner" />
      <SectionTabs items={PLANNER_TABS} />
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <Card className="overflow-hidden p-6 sm:p-8">
            {active ? (
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <Ring value={((total - left) / total) * 100} size={190} stroke={14} color={subjectColor(state, active.subjectId)}>
                  <div><p className="font-display text-4xl font-bold tabular-nums" aria-live="off">{mmss(left)}</p><p className="text-xs text-muted">{running ? "Focus time" : left === 0 ? "Finished" : "Ready"}</p></div>
                </Ring>
                <div className="flex-1">
                  <Badge color={subjectColor(state, active.subjectId)}>{subjectName(state, active.subjectId)}</Badge>
                  <h2 className="mt-2 font-display text-2xl font-bold">{active.title}</h2>
                  <p className="mt-1 text-sm text-muted">{fmtTime(active.start)}–{fmtTime(addMinutes(active.start, active.minutes))} · {active.minutes} min {active.done && "· completed"}</p>
                  <div className="mt-5 flex flex-wrap gap-2 md:justify-start">
                    <Button icon={running ? Pause : Play} onClick={() => setRunning((r) => !r)} disabled={active.done || left === 0}>{running ? "Pause" : left < active.minutes * 60 ? "Resume" : "Start session"}</Button>
                    <Button variant="secondary" icon={RotateCcw} onClick={() => { setLeft(active.minutes * 60); setRunning(false); }}>Reset</Button>
                    <Button variant="secondary" icon={CheckCircle2} onClick={complete} disabled={active.done}>Complete session</Button>
                  </div>
                </div>
              </div>
            ) : <div className="py-10 text-center"><Sun className="mx-auto mb-3 h-10 w-10 text-ok" /><h2 className="font-display text-lg font-semibold">{work.length ? "All of today's sessions are complete" : "No sessions planned today"}</h2><p className="mt-1 text-sm text-muted">{work.length ? "Great job. Review your progress or revise a weak topic." : "Add tasks in the planner to get a routine."}</p><Button className="mt-4" href="/planner">Open planner</Button></div>}
          </Card>
          {breakDue && (
            <Card className="anim-fade-up flex flex-wrap items-center gap-3 border-warn/40 bg-warn/10 p-4"><Coffee className="h-6 w-6 text-warn" /><div className="flex-1 text-sm"><p className="font-semibold">Break reminder</p><p className="text-muted">Take 10 minutes: stretch, drink water, look away from the screen.</p></div><Button size="sm" onClick={goNext}>Next session</Button><Button size="sm" variant="ghost" onClick={() => setBreakDue(false)}>Dismiss</Button></Card>
          )}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Today&apos;s sessions</h2><p className="text-xs text-muted">{work.filter((t) => t.done).length}/{work.length} done</p></div>
            <ul className="divide-y divide-line">
              {todays.map((t) => (
                <li key={t.id} className={cn("flex items-center gap-3 py-3", t.id === activeId && "rounded-xl bg-brand/10 px-3")}>
                  {t.kind === "break" ? <Coffee className="h-5 w-5 text-warn" /> : t.kind === "reminder" ? <Bell className="h-5 w-5 text-brand2" /> : <button onClick={() => toggleTask(t.id)} aria-label={t.done ? "Mark incomplete" : "Mark complete"}>{t.done ? <CheckCircle2 className="h-5 w-5 text-ok" /> : <Circle className="h-5 w-5 text-muted" />}</button>}
                  <div className="min-w-0 flex-1"><p className={cn("truncate text-sm font-medium", t.done && "text-muted line-through")}>{t.title}</p><p className="text-xs text-muted">{fmtTime(t.start)} · {t.minutes} min</p></div>
                  {t.kind !== "break" && t.kind !== "reminder" && !t.done && <Button size="sm" variant={t.id === activeId ? "soft" : "secondary"} onClick={() => pick(t.id)}>{t.id === activeId ? "Selected" : "Focus"}</Button>}
                </li>
              ))}
              {!todays.length && <li className="py-8 text-center text-sm text-muted">Nothing scheduled today.</li>}
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-5"><h2 className="mb-1 flex items-center gap-2 font-display text-base font-semibold"><Target className="h-4 w-4 text-brand" />Daily goals</h2>
            <div className="mt-3 space-y-4"><div><div className="mb-1 flex justify-between text-sm"><span>Planned study time</span><span className="font-semibold">{minsLabel(doneMin)} / {minsLabel(planned)}</span></div><Progress value={planned ? (doneMin / planned) * 100 : 0} color="var(--ok)" /></div>
              {dailyGoals.map((g) => <div key={g.id}><div className="mb-1 flex justify-between text-sm"><span className="truncate">{g.title}</span><span className="font-semibold">{g.progress}/{g.target} {g.unit}</span></div><Progress value={(g.progress / g.target) * 100} color="var(--brand)" /></div>)}</div></Card>
          <Card className="p-5"><h2 className="mb-2 font-display text-base font-semibold">Time allocation</h2>{bySubject.length ? <><DonutChart data={bySubject.map((x) => ({ name: x.s.name.split(" ")[0], value: x.plan, color: x.s.color }))} unit=" min" height={170} /><ul className="mt-2 space-y-2">{bySubject.map((x) => <li key={x.s.id}><div className="mb-1 flex justify-between text-xs"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: x.s.color }} />{x.s.name.split(" ")[0]}</span><span className="text-muted">{minsLabel(x.done)} of {minsLabel(x.plan)}</span></div><Progress value={(x.done / x.plan) * 100} color={x.s.color} height={5} /></li>)}</ul></> : <p className="py-6 text-center text-sm text-muted">No planned sessions to show.</p>}</Card>
        </div>
      </div>
    </>
  );
}
