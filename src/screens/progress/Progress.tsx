"use client";
import { useMemo, useState } from "react";
import { BookCheck, ChevronDown, Clock, Flame, Gauge, TrendingUp } from "lucide-react";
import { AreaTrend, BarsChart, Heatmap, LineTrend, RadarSkills } from "@/components/charts/charts";
import { Badge, Card, PageHeader, Progress as Bar, Ring, SectionTabs, Segmented, Stat, cn } from "@/components/common/ui";
import { PROGRESS_TABS } from "@/components/navigation/sectionNav";
import { useApp } from "@/hooks/useApp";
import { addDays, fmtDate, minsLabel, todayStr } from "@/utils";
import { minutesByDay, overallProgress, quizAvg, streak, subjectStats, totalMinutes } from "@/utils/metrics";

export default function ProgressPage() {
  const { state } = useApp();
  const today = todayStr();
  const [range, setRange] = useState<"week" | "month">("week");
  const [open, setOpen] = useState<string | null>(null);
  const [status, setStatus] = useState<"all" | "completed" | "learning" | "not_started">("all");
  const stats = useMemo(() => subjectStats(state), [state]);
  const days = range === "week" ? 7 : 30;
  const trend = minutesByDay(state.sessions, addDays(today, -(days - 1)), today).map((d) => ({ label: fmtDate(d.date), hours: +(d.minutes / 60).toFixed(2) }));
  const quizTrend = [...state.attempts].sort((a, b) => a.date.localeCompare(b.date)).map((a) => ({ label: fmtDate(a.date.slice(0, 10)), accuracy: a.accuracy }));
  const heat = minutesByDay(state.sessions, addDays(today, -83), today);
  const active30 = minutesByDay(state.sessions, addDays(today, -29), today).filter((d) => d.minutes > 0).length;
  const prog = overallProgress(state.topics);

  return (
    <>
      <PageHeader title="Learning progress" subtitle="Where you stand across subjects, topics, study time and quiz accuracy." icon={TrendingUp} color="#60a5fa" eyebrow="Agent 5 · Progress" />
      <SectionTabs items={PROGRESS_TABS} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="col-span-2 flex items-center gap-4 p-5 lg:col-span-1 lg:flex-col lg:text-center"><Ring value={prog} size={104} color="#60a5fa" /><div><p className="font-display font-semibold">Overall progress</p><p className="text-xs text-muted">Average topic mastery</p></div></Card>
        <Stat label="Topics completed" value={`${state.topics.filter((t) => t.status === "completed").length}/${state.topics.length}`} icon={BookCheck} color="#34d399" />
        <Stat label="Study time" value={minsLabel(totalMinutes(state.sessions))} sub="All recorded sessions" icon={Clock} color="#22d3ee" />
        <Stat label="Quiz accuracy" value={state.attempts.length ? `${quizAvg(state.attempts, 100)}%` : "—"} sub={`${state.attempts.length} quizzes`} icon={Gauge} color="#fb7185" />
        <Stat label="Consistency" value={`${active30}/30`} sub={`Active days · streak ${streak(state.sessions)}`} icon={Flame} color="#fb923c" />
      </div>
      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Study time trend</h2><Segmented value={range} onChange={setRange} options={[{ value: "week", label: "Weekly" }, { value: "month", label: "Monthly" }]} /></div>
          <AreaTrend data={trend} xKey="label" yKey="hours" color="#60a5fa" unit="h" name="Hours" />
        </Card>
        <Card className="p-5"><h2 className="mb-1 font-display text-base font-semibold">Subject balance</h2><RadarSkills data={stats.map((s) => ({ subject: s.subject.name.split(" ")[0], value: s.progress }))} color="#60a5fa" /></Card>
      </div>
      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Quiz accuracy over time</h2>{quizTrend.length ? <LineTrend data={quizTrend} xKey="label" lines={[{ key: "accuracy", color: "#fb7185", name: "Accuracy" }]} domain={[0, 100]} unit="%" /> : <p className="py-16 text-center text-sm text-muted">No quizzes yet.</p>}</Card>
        <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Learning consistency · 12 weeks</h2><Heatmap days={heat} /><p className="mt-3 text-xs text-muted">Darker squares mean more minutes studied that day.</p></Card>
      </div>
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-base font-semibold">Subject-wise progress & topic completion</h2><Segmented value={status} onChange={setStatus} options={[{ value: "all", label: "All" }, { value: "completed", label: "Completed" }, { value: "learning", label: "In progress" }, { value: "not_started", label: "Not started" }]} /></div>
        <ul className="space-y-3">
          {stats.map((s) => {
            const topics = state.topics.filter((t) => t.subjectId === s.subject.id && (status === "all" || t.status === status));
            return (
              <li key={s.subject.id} className="rounded-2xl border border-line bg-surface2/40">
                <button onClick={() => setOpen(open === s.subject.id ? null : s.subject.id)} aria-expanded={open === s.subject.id} className="flex w-full items-center gap-4 p-4 text-left">
                  <span className="h-10 w-1.5 rounded-full" style={{ background: s.subject.color }} />
                  <div className="min-w-0 flex-1"><div className="mb-1.5 flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold">{s.subject.name}</p><span className="text-sm font-bold">{s.progress}%</span></div><Bar value={s.progress} color={s.subject.color} /><p className="mt-1.5 text-xs text-muted">{s.done}/{s.total} topics · {minsLabel(s.minutes)} studied{s.quizAcc !== null && ` · quiz avg ${s.quizAcc}%`}</p></div>
                  <ChevronDown className={cn("h-5 w-5 text-muted transition", open === s.subject.id && "rotate-180")} />
                </button>
                {open === s.subject.id && (
                  <ul className="space-y-2 border-t border-line p-4">
                    {topics.map((t) => <li key={t.id} className="flex items-center gap-3 text-sm"><span className="w-44 truncate sm:w-56">{t.name}</span><div className="flex-1"><Bar value={t.mastery} color={s.subject.color} height={6} /></div><span className="w-10 text-right text-xs font-semibold">{t.mastery}%</span><Badge tone={t.status === "completed" ? "ok" : t.status === "learning" ? "info" : "muted"}>{t.status === "not_started" ? "Not started" : t.status === "learning" ? "In progress" : "Completed"}</Badge></li>)}
                    {!topics.length && <li className="text-sm text-muted">No topics with this status.</li>}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
      <Card className="mt-6 p-5"><h2 className="mb-3 font-display text-base font-semibold">Mastery by subject</h2><BarsChart data={stats.map((s) => ({ name: s.subject.name.split(" ")[0], Mastery: s.progress, "Quiz accuracy": s.quizAcc ?? 0 }))} xKey="name" bars={[{ key: "Mastery", color: "#60a5fa" }, { key: "Quiz accuracy", color: "#fb7185" }]} unit="%" /></Card>
    </>
  );
}
