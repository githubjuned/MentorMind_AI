"use client";
import { useState } from "react";
import { Activity, BarChart3, Bot, GraduationCap, Library, Lock, ShieldCheck, Users } from "lucide-react";
import { AreaTrend, BarsChart, LineTrend } from "@/components/charts/charts";
import { Badge, Button, Card, PageHeader, Stat, Tabs, Toggle, useToast } from "@/components/common/ui";
import { SPECIALISTS } from "@/data/agents";
import { RESOURCES } from "@/data/resources";
import { useApp } from "@/hooks/useApp";
import { AccessDeniedView } from "@/screens/public/AccessDenied";

// Entirely fictional aggregate cohort data (generated deterministically).
const seeded = (i: number, a: number, b: number) => Math.round(a + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * (b - a));
const COHORT = 42;
const SUBJECTS = [["Python", 74, 31], ["DBMS", 61, 38], ["Mathematics", 58, 40], ["Data Structures", 66, 29], ["AI", 63, 27]] as const;

type Tab = "overview" | "activity" | "subjects" | "resources" | "agents" | "usage";
export default function Educator() {
  const { state } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [enabledRes, setEnabledRes] = useState<Record<string, boolean>>(Object.fromEntries(RESOURCES.map((r) => [r.id, true])));
  const [agentCfg, setAgentCfg] = useState<Record<string, { on: boolean; strict: number }>>(Object.fromEntries(SPECIALISTS.map((a) => [a.id, { on: true, strict: 50 }])));
  if (!state.settings.privacy.educatorView) return <AccessDeniedView variant="educator" />;

  const weeks = Array.from({ length: 8 }, (_, i) => ({ label: `W${i + 1}`, hours: seeded(i, 90, 160), active: seeded(i + 9, 28, 40) }));
  const daily = Array.from({ length: 14 }, (_, i) => ({ label: `D${i + 1}`, users: seeded(i + 3, 18, 36) }));
  const usage = SPECIALISTS.map((a, i) => ({ name: a.short, Requests: seeded(i + 20, 60, 320) }));
  return (
    <>
      <PageHeader title="Educator portal" subtitle="Aggregate, anonymous learning insights for a class. Individual learning memory is never shown." icon={GraduationCap} color="#fbbf24" eyebrow="Optional · Demo"
        actions={<Badge tone="warn">Fictional cohort of {COHORT} students</Badge>} />
      <Card className="mb-6 flex gap-3 border-brand2/30 bg-brand2/5 p-4 text-sm"><Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand2" /><p className="text-muted">Everything on this page is <b className="text-ink">made-up aggregate data</b> to demonstrate the layout. No individual student&apos;s notes, chats, mistakes or memory are exposed; a real deployment would require explicit student consent and role-based authorization.{state.settings.privacy.shareAggregate ? " Your own activity is counted only inside anonymous totals." : " You've opted out of anonymous totals."}</p></Card>
      <div className="mb-6 overflow-x-auto"><Tabs value={tab} onChange={setTab} tabs={[{ id: "overview", label: "Overview", icon: BarChart3 }, { id: "activity", label: "Learning activity", icon: Activity }, { id: "subjects", label: "Subject performance", icon: Users }, { id: "resources", label: "Resources", icon: Library }, { id: "agents", label: "Agent configuration", icon: Bot }, { id: "usage", label: "System usage", icon: ShieldCheck }]} /></div>

      {tab === "overview" && <div className="space-y-6"><div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Stat label="Active students" value={`${seeded(99, 31, 38)}/${COHORT}`} sub="Last 7 days" icon={Users} color="#22d3ee" /><Stat label="Avg weekly hours" value="6.4" sub="Per active student" icon={Activity} color="#34d399" /><Stat label="Avg quiz accuracy" value="68%" sub="Across all subjects" icon={BarChart3} color="#fb7185" /><Stat label="Quizzes completed" value="412" sub="This month" icon={ShieldCheck} color="#fbbf24" /></div>
        <div className="grid gap-5 lg:grid-cols-2"><Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Total study hours per week</h2><AreaTrend data={weeks} xKey="label" yKey="hours" color="#fbbf24" unit="h" name="Hours" /></Card><Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Weekly active students</h2><LineTrend data={weeks} xKey="label" lines={[{ key: "active", color: "#22d3ee", name: "Students" }]} domain={[0, 45]} /></Card></div></div>}
      {tab === "activity" && <div className="grid gap-5 lg:grid-cols-2"><Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Daily active students (14 days)</h2><BarsChart data={daily} xKey="label" bars={[{ key: "users", color: "#22d3ee", name: "Students" }]} /></Card><Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Activity by type</h2><ul className="space-y-3 text-sm">{[["Study sessions", 46, "#22d3ee"], ["Quizzes", 22, "#fb7185"], ["Notes generated", 14, "#fbbf24"], ["Revision", 12, "#fb923c"], ["Doubt solving", 6, "#a3e635"]].map(([l, v, c]) => <li key={l as string}><div className="mb-1 flex justify-between"><span>{l}</span><span className="text-muted">{v}%</span></div><div className="h-2 overflow-hidden rounded-full bg-surface2"><div className="h-full rounded-full" style={{ width: `${v}%`, background: c as string }} /></div></li>)}</ul></Card></div>}
      {tab === "subjects" && <Card className="p-5"><h2 className="mb-1 font-display text-base font-semibold">Aggregate subject performance</h2><p className="mb-4 text-xs text-muted">Average quiz accuracy and share of students flagged as needing support (fictional).</p><BarsChart data={SUBJECTS.map(([n, a, w]) => ({ name: n, "Avg accuracy": a, "Needs support": w }))} xKey="name" bars={[{ key: "Avg accuracy", color: "#34d399" }, { key: "Needs support", color: "#fb7185" }]} unit="%" height={280} /></Card>}
      {tab === "resources" && <Card className="p-5"><h2 className="mb-1 font-display text-base font-semibold">Resource management</h2><p className="mb-4 text-xs text-muted">Enable or hide resources from the recommender (changes apply to this demo session only).</p><ul className="divide-y divide-line">{RESOURCES.slice(0, 10).map((r) => <li key={r.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.title}</p><p className="text-xs text-muted">{r.type} · {r.provider}</p></div><Toggle label={`Enable ${r.title}`} checked={enabledRes[r.id]} onChange={(v) => { setEnabledRes({ ...enabledRes, [r.id]: v }); toast(v ? "Resource enabled" : "Resource hidden", "info"); }} /></li>)}</ul></Card>}
      {tab === "agents" && <div className="grid gap-4 md:grid-cols-2">{SPECIALISTS.map((a) => <Card key={a.id} className="p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${a.color}22`, color: a.color }}><a.icon className="h-5 w-5" /></span><div className="flex-1"><p className="text-sm font-semibold">{a.name}</p><p className="text-xs text-muted">{agentCfg[a.id].on ? "Enabled for students" : "Disabled"}</p></div><Toggle label={`Enable ${a.name}`} checked={agentCfg[a.id].on} onChange={(v) => setAgentCfg({ ...agentCfg, [a.id]: { ...agentCfg[a.id], on: v } })} /></div><div className="mt-4"><div className="mb-1 flex justify-between text-xs text-muted"><span>Guidance strictness</span><span>{agentCfg[a.id].strict}%</span></div><input type="range" min={0} max={100} value={agentCfg[a.id].strict} onChange={(e) => setAgentCfg({ ...agentCfg, [a.id]: { ...agentCfg[a.id], strict: +e.target.value } })} className="w-full accent-[var(--brand)]" aria-label={`Strictness for ${a.name}`} disabled={!agentCfg[a.id].on} /></div></Card>)}<div className="md:col-span-2"><Button onClick={() => toast("Configuration saved for this demo session", "info")}>Save configuration</Button></div></div>}
      {tab === "usage" && <div className="grid gap-5 lg:grid-cols-2"><Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Requests handled per agent (30 days)</h2><BarsChart data={usage} xKey="name" bars={[{ key: "Requests", color: "#8b7bff" }]} /></Card><Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">System status</h2><ul className="space-y-3 text-sm">{[["Coordinator routing service", "Demo (rule-based)"], ["Knowledge base", "16 topics · 80 questions"], ["Storage", "Browser local storage"], ["External AI model", "Not connected"]].map(([l, v]) => <li key={l} className="flex justify-between gap-3 border-b border-line/60 pb-2"><span className="text-muted">{l}</span><span className="font-medium">{v}</span></li>)}</ul></Card></div>}
    </>
  );
}
