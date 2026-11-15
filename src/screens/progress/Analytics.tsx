"use client";
import { useMemo, useState } from "react";
import { BarChart3, Download } from "lucide-react";
import { AreaTrend, BarsChart, DonutChart, Heatmap, LineTrend } from "@/components/charts/charts";
import { Button, Card, PageHeader, SectionTabs, Segmented, Stat, useToast } from "@/components/common/ui";
import { PROGRESS_TABS } from "@/components/navigation/sectionNav";
import { useApp } from "@/hooks/useApp";
import { addDays, daysBetween, download, fmtDate, minsLabel, todayStr } from "@/utils";
import { minutesByDay, topicHistory } from "@/utils/metrics";
import { Clock, Flame, Gauge, BookCheck } from "lucide-react";

type R = "7" | "30" | "90" | "custom";
export default function Analytics() {
  const { state } = useApp();
  const toast = useToast();
  const today = todayStr();
  const [r, setR] = useState<R>("30");
  const [from, setFrom] = useState(addDays(today, -29));
  const [to, setTo] = useState(today);
  const range = r === "custom" ? { a: from <= to ? from : to, b: from <= to ? to : from } : { a: addDays(today, -(+r - 1)), b: today };
  const span = daysBetween(range.a, range.b) + 1;

  const d = useMemo(() => {
    const sess = state.sessions.filter((s) => s.date >= range.a && s.date <= range.b);
    const daily = minutesByDay(sess, range.a, range.b);
    const weekly = span > 35;
    const series = weekly
      ? Array.from({ length: Math.ceil(daily.length / 7) }, (_, i) => { const chunk = daily.slice(i * 7, i * 7 + 7); return { label: fmtDate(chunk[0].date), hours: +(chunk.reduce((a, b) => a + b.minutes, 0) / 60).toFixed(1) }; })
      : daily.map((x) => ({ label: fmtDate(x.date), hours: +(x.minutes / 60).toFixed(2) }));
    const bySubject = state.subjects.map((s) => ({ name: s.name.split(" ")[0], value: sess.filter((x) => x.subjectId === s.id).reduce((a, b) => a + b.minutes, 0), color: s.color })).filter((x) => x.value > 0);
    const att = state.attempts.filter((a) => a.date.slice(0, 10) >= range.a && a.date.slice(0, 10) <= range.b).sort((a, b) => a.date.localeCompare(b.date));
    const topicsImp = state.topics.map((t) => { const h = topicHistory(att, t.id); return h.length >= 2 ? { name: t.name.split(" ").slice(0, 2).join(" "), Change: h[h.length - 1].accuracy - h[0].accuracy } : null; }).filter((x): x is { name: string; Change: number } => !!x);
    const total = sess.reduce((a, b) => a + b.minutes, 0);
    const activeDays = daily.filter((x) => x.minutes > 0).length;
    return { sess, daily, series, weekly, bySubject, att, topicsImp, total, activeDays, completion: state.subjects.map((s) => ({ name: s.name.split(" ")[0], Completed: state.topics.filter((t) => t.subjectId === s.id && t.status === "completed").length, Remaining: state.topics.filter((t) => t.subjectId === s.id && t.status !== "completed").length })) };
  }, [state, range.a, range.b, span]);

  const exportCsv = () => {
    const rows = ["date,subject,topic,minutes,type", ...d.sess.map((s) => `${s.date},"${state.subjects.find((x) => x.id === s.subjectId)?.name ?? s.subjectId}","${s.topic.replace(/"/g, "'")}",${s.minutes},${s.kind}`)];
    download(`mentormind-sessions-${range.a}_${range.b}.csv`, rows.join("\n"), "text/csv");
    toast("CSV downloaded");
  };

  return (
    <>
      <PageHeader title="Learning analytics" subtitle="Study time, quiz performance and consistency over the period you choose." icon={BarChart3} color="#60a5fa" eyebrow="Agent 5 · Progress" actions={<Button variant="secondary" icon={Download} onClick={exportCsv} disabled={!d.sess.length}>Export CSV</Button>} />
      <SectionTabs items={PROGRESS_TABS} />
      <Card className="mb-6 flex flex-wrap items-center gap-3 p-4">
        <Segmented value={r} onChange={setR} options={[{ value: "7", label: "7 days" }, { value: "30", label: "30 days" }, { value: "90", label: "90 days" }, { value: "custom", label: "Custom" }]} />
        {r === "custom" && <div className="flex items-center gap-2 text-sm"><input type="date" className="input w-auto py-1.5" value={from} max={today} onChange={(e) => e.target.value && setFrom(e.target.value)} aria-label="From date" />to<input type="date" className="input w-auto py-1.5" value={to} max={today} onChange={(e) => e.target.value && setTo(e.target.value)} aria-label="To date" /></div>}
        <p className="ml-auto text-xs text-muted">{fmtDate(range.a, true)} – {fmtDate(range.b, true)} · {span} days</p>
      </Card>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Study time" value={minsLabel(d.total)} sub={`${(d.total / 60 / span).toFixed(1)} h per day avg`} icon={Clock} color="#22d3ee" />
        <Stat label="Active days" value={`${d.activeDays}/${span}`} sub={`${Math.round((d.activeDays / span) * 100)}% consistency`} icon={Flame} color="#fb923c" />
        <Stat label="Quizzes" value={d.att.length} sub={d.att.length ? `Avg ${Math.round(d.att.reduce((a, b) => a + b.accuracy, 0) / d.att.length)}%` : "None in range"} icon={Gauge} color="#fb7185" />
        <Stat label="Sessions" value={d.sess.length} sub={`${d.sess.filter((s) => s.kind === "revision").length} revision`} icon={BookCheck} color="#34d399" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2"><h2 className="mb-3 font-display text-base font-semibold">Study hours over time {d.weekly && <span className="text-xs font-normal text-muted">(weekly totals)</span>}</h2>{d.total ? <AreaTrend data={d.series} xKey="label" yKey="hours" color="#22d3ee" unit="h" name="Hours" /> : <p className="py-16 text-center text-sm text-muted">No study sessions in this period.</p>}</Card>
        <Card className="p-5"><h2 className="mb-1 font-display text-base font-semibold">Subject-wise learning time</h2>{d.bySubject.length ? <><DonutChart data={d.bySubject} unit=" min" height={180} /><ul className="space-y-1.5 text-xs">{d.bySubject.map((x) => <li key={x.name} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: x.color }} />{x.name}</span><span className="text-muted">{minsLabel(x.value)}</span></li>)}</ul></> : <p className="py-16 text-center text-sm text-muted">No data.</p>}</Card>
        <Card className="p-5 lg:col-span-2"><h2 className="mb-3 font-display text-base font-semibold">Quiz performance trend</h2>{d.att.length ? <LineTrend data={d.att.map((a) => ({ label: fmtDate(a.date.slice(0, 10)), Accuracy: a.accuracy }))} xKey="label" lines={[{ key: "Accuracy", color: "#fb7185" }]} domain={[0, 100]} unit="%" /> : <p className="py-16 text-center text-sm text-muted">No quizzes in this period.</p>}</Card>
        <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Improvement trends</h2>{d.topicsImp.length ? <BarsChart data={d.topicsImp} xKey="name" bars={[{ key: "Change", color: "#34d399", name: "Accuracy change (pts)" }]} height={220} /> : <p className="py-16 text-center text-sm text-muted">Needs 2+ quizzes on a topic within the period.</p>}</Card>
        <Card className="p-5 lg:col-span-2"><h2 className="mb-3 font-display text-base font-semibold">Topic completion by subject</h2><BarsChart data={d.completion} xKey="name" bars={[{ key: "Completed", color: "#34d399" }, { key: "Remaining", color: "#334155" }]} stacked height={220} /></Card>
        <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Learning consistency</h2><Heatmap days={d.daily.slice(-84)} /></Card>
      </div>
    </>
  );
}
