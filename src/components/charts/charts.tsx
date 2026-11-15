"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { addDays, fmtDate, parseDate } from "@/utils";

const tick = { fill: "var(--muted)", fontSize: 11 };
const tip = {
  contentStyle: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12, color: "var(--ink)" },
  labelStyle: { color: "var(--muted)" },
  cursor: { stroke: "var(--line)", fill: "color-mix(in srgb, var(--brand) 8%, transparent)" },
};
type Row = Record<string, string | number>;

export function AreaTrend({ data, xKey, yKey, color = "#8b7bff", height = 240, unit = "", name }: { data: Row[]; xKey: string; yKey: string; color?: string; height?: number; unit?: string; name?: string }) {
  const id = `g-${yKey}-${color.replace("#", "")}`;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.45} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={tick} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={tick} tickLine={false} axisLine={false} />
          <Tooltip {...tip} formatter={(v) => `${v}${unit}`} />
          <Area type="monotone" dataKey={yKey} name={name ?? yKey} stroke={color} strokeWidth={2.5} fill={`url(#${id})`} animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function BarsChart({ data, xKey, bars, height = 240, stacked, unit = "" }: { data: Row[]; xKey: string; bars: { key: string; color: string; name?: string }[]; height?: number; stacked?: boolean; unit?: string }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={tick} tickLine={false} axisLine={false} interval={0} />
          <YAxis tick={tick} tickLine={false} axisLine={false} />
          <Tooltip {...tip} formatter={(v) => `${v}${unit}`} />
          {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted)" }} />}
          {bars.map((b) => <Bar key={b.key} dataKey={b.key} name={b.name ?? b.key} fill={b.color} stackId={stacked ? "a" : undefined} radius={stacked ? 0 : [6, 6, 0, 0]} animationDuration={800} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function LineTrend({ data, xKey, lines, height = 240, domain, unit = "" }: { data: Row[]; xKey: string; lines: { key: string; color: string; name?: string }[]; height?: number; domain?: [number, number]; unit?: string }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={tick} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={tick} tickLine={false} axisLine={false} domain={domain} />
          <Tooltip {...tip} formatter={(v) => `${v}${unit}`} />
          {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted)" }} />}
          {lines.map((l) => <Line key={l.key} type="monotone" dataKey={l.key} name={l.name ?? l.key} stroke={l.color} strokeWidth={2.5} dot={{ r: 3, fill: l.color }} activeDot={{ r: 5 }} connectNulls animationDuration={900} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function DonutChart({ data, height = 220, unit = "" }: { data: { name: string; value: number; color: string }[]; height?: number; unit?: string }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="88%" paddingAngle={3} stroke="none" animationDuration={900}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip {...tip} formatter={(v) => `${v}${unit}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export function RadarSkills({ data, height = 280, color = "#8b7bff" }: { data: { subject: string; value: number }[]; height?: number; color?: string }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--line)" />
          <PolarAngleAxis dataKey="subject" tick={tick} />
          <Tooltip {...tip} formatter={(v) => `${v}%`} />
          <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.3} animationDuration={900} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
/** GitHub-style consistency heatmap. */
export function Heatmap({ days }: { days: { date: string; minutes: number }[] }) {
  if (!days.length) return null;
  const first = parseDate(days[0].date).getDay();
  const pad = (first + 6) % 7;
  const cells: ({ date: string; minutes: number } | null)[] = [...Array(pad).fill(null), ...days];
  const level = (m: number) => (m === 0 ? 0 : m < 40 ? 1 : m < 80 ? 2 : m < 120 ? 3 : 4);
  const alpha = [0.07, 0.3, 0.5, 0.75, 1];
  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1" style={{ gridAutoColumns: "minmax(14px, 1fr)" }} role="img" aria-label="Study consistency heatmap">
        {cells.map((c, i) => (
          <div key={i} title={c ? `${fmtDate(c.date)}: ${c.minutes} min` : ""} className="aspect-square min-h-3.5 rounded-[4px]"
            style={{ background: c ? `color-mix(in srgb, var(--brand) ${alpha[level(c.minutes)] * 100}%, var(--surface2))` : "transparent" }} />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-muted">Less{alpha.map((a, i) => <span key={i} className="h-3 w-3 rounded-[3px]" style={{ background: `color-mix(in srgb, var(--brand) ${a * 100}%, var(--surface2))` }} />)}More</div>
    </div>
  );
}
export const lastNDays = (n: number, end: string) => Array.from({ length: n }, (_, i) => addDays(end, i - n + 1));
