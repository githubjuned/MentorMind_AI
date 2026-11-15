"use client";
import Link from "next/link";
import { useState } from "react";
import { Bell, BellRing, BookOpen, CalendarClock, CheckCheck, ClipboardList, Eye, EyeOff, ListChecks, Repeat, Sparkles, Target, Trash2, type LucideIcon } from "lucide-react";
import { Button, Card, EmptyState, PageHeader, Toggle, cn, useToast } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";
import type { Notif, Settings } from "@/types";
import { timeAgo } from "@/utils";

const KIND: Record<Notif["kind"], { l: string; icon: LucideIcon; c: string; pref: keyof Settings["notifPrefs"] }> = {
  reminder: { l: "Study reminders", icon: CalendarClock, c: "#22d3ee", pref: "reminders" }, revision: { l: "Revision", icon: Repeat, c: "#fb923c", pref: "revision" },
  task: { l: "Pending tasks", icon: ClipboardList, c: "#fbbf24", pref: "tasks" }, recommendation: { l: "Recommendations", icon: Sparkles, c: "#a3e635", pref: "recommendations" },
  quiz: { l: "Quiz results", icon: ListChecks, c: "#fb7185", pref: "quiz" }, goal: { l: "Goal achievements", icon: Target, c: "#8b7bff", pref: "goals" },
};

export default function Notifications() {
  const { state, update, notify } = useApp();
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "unread" | Notif["kind"]>("all");
  const list = state.notifications.filter((n) => filter === "all" || (filter === "unread" ? !n.read : n.kind === filter));
  const unread = state.notifications.filter((n) => !n.read).length;
  const set = (id: string, read: boolean) => update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read } : n)) }));

  return (
    <>
      <PageHeader title="Notifications & reminders" subtitle={`${unread} unread · reminders, revision, tasks, recommendations, quiz results and goal achievements.`} icon={Bell} color="#8b7bff" eyebrow="Account"
        actions={<><Button variant="secondary" icon={BellRing} onClick={() => { notify("reminder", "Test reminder", "This is a sample reminder created from your notification settings.", "/routine"); toast("Test reminder added", "info"); }}>Send test reminder</Button><Button icon={CheckCheck} disabled={!unread} onClick={() => { update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })); toast("All notifications marked as read"); }}>Mark all as read</Button></>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{([["all", "All"], ["unread", `Unread (${unread})`], ...Object.entries(KIND).map(([k, v]) => [k, v.l])] as [string, string][]).map(([k, l]) => <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k as typeof filter)} className={cn("chip", filter === k && "chip-on")}>{l}</button>)}</div>
          {list.length ? (
            <ul className="space-y-3">
              {list.map((n) => { const k = KIND[n.kind]; return (
                <li key={n.id}><Card className={cn("flex items-start gap-4 p-4", !n.read && "border-brand/50 bg-brand/5")}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${k.c}22`, color: k.c }}><k.icon className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-sm font-semibold">{n.title}</p>{!n.read && <span className="h-2 w-2 rounded-full bg-brand" aria-label="Unread" />}</div><p className="mt-0.5 text-sm text-muted">{n.body}</p><div className="mt-2 flex items-center gap-3 text-xs text-muted"><span>{timeAgo(n.time)}</span><span>· {k.l}</span>{n.href && <Link href={n.href} onClick={() => set(n.id, true)} className="font-semibold text-brand hover:underline">Open</Link>}</div></div>
                  <div className="flex shrink-0"><button className="rounded-lg p-2 text-muted hover:bg-surface2 hover:text-ink" aria-label={n.read ? "Mark as unread" : "Mark as read"} title={n.read ? "Mark as unread" : "Mark as read"} onClick={() => set(n.id, !n.read)}>{n.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button className="rounded-lg p-2 text-muted hover:bg-surface2 hover:text-bad" aria-label="Delete notification" onClick={() => update((s) => ({ ...s, notifications: s.notifications.filter((x) => x.id !== n.id) }))}><Trash2 className="h-4 w-4" /></button></div>
                </Card></li>
              ); })}
            </ul>
          ) : <EmptyState icon={BookOpen} title={state.notifications.length ? "Nothing in this view" : "You're all caught up"} body={state.notifications.length ? "Try another filter." : "New reminders and results will show up here."} />}
        </div>
        <Card className="h-fit p-5"><h2 className="mb-1 font-display text-base font-semibold">Notification preferences</h2><p className="mb-4 text-xs text-muted">Choose which in-app notifications MentorMind creates. Demo build: nothing is sent by email or push.</p>
          <ul className="space-y-3">{(Object.keys(KIND) as Notif["kind"][]).map((key) => { const k = KIND[key]; return <li key={key} className="flex items-center gap-3"><k.icon className="h-4 w-4" style={{ color: k.c }} /><span className="flex-1 text-sm">{k.l}</span><Toggle label={k.l} checked={state.settings.notifPrefs[k.pref]} onChange={(v) => update((s) => ({ ...s, settings: { ...s.settings, notifPrefs: { ...s.settings.notifPrefs, [k.pref]: v } } }))} /></li>; })}</ul></Card>
      </div>
    </>
  );
}
