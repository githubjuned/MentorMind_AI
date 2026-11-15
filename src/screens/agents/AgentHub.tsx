"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Network, Search } from "lucide-react";
import { AgentIcon } from "@/components/agents/AgentBadge";
import { Badge, Button, Card, Modal, PageHeader } from "@/components/common/ui";
import { AGENTS, SPECIALISTS, type AgentDef } from "@/data/agents";
import { useApp } from "@/hooks/useApp";
import { DEMO_NOTICE } from "@/services/ai/demo";
import { setHandoff, timeAgo } from "@/utils";

export default function AgentHub() {
  const { state } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<AgentDef | null>(null);

  const recent = useMemo(() => {
    const day = (k: string) => state.activity.filter((a) => a.kind === k)[0];
    return {
      coordinator: state.conversations.filter((c) => c.messages.length > 1).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.title,
      doubt: day("doubt")?.title, notes: day("notes")?.title, quiz: day("quiz")?.title, planner: day("plan")?.title ?? (state.tasks.length ? `${state.tasks.filter((t) => !t.done).length} pending tasks` : undefined),
      progress: state.sessions.length ? `${state.sessions.length} sessions tracked` : undefined, revision: day("revision")?.title, resources: state.savedResources.length ? `${state.savedResources.length} saved resources` : undefined,
    } as Record<string, string | undefined>;
  }, [state]);
  const list = AGENTS.filter((a) => !q || (a.name + a.description + a.examples.join(" ")).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="AI Agent Hub" subtitle="Seven specialist agents, coordinated by one assistant. Pick a specialist directly or let the coordinator route for you." icon={Network} eyebrow="Multi-agent system"
        actions={<Button href="/assistant" icon={Network}>Ask the coordinator</Button>} />
      <Card className="mb-6 flex flex-wrap items-center gap-3 border-warn/30 bg-warn/5 p-4 text-sm"><Badge tone="warn">Demo</Badge><span className="min-w-0 flex-1 text-muted">{DEMO_NOTICE}</span></Card>

      {/* Coordination diagram */}
      <Card className="mb-6 overflow-hidden p-6">
        <p className="eyebrow mb-4">How a request flows</p>
        <div className="flex flex-col items-center gap-3 text-sm md:flex-row md:justify-between">
          {["You ask", "Coordinator detects intent", "Specialist agent runs", "Result + learning memory update"].map((s, i, a) => (
            <div key={s} className="flex flex-col items-center gap-3 md:flex-row"><div className="rounded-xl border border-line bg-surface2 px-4 py-2.5 font-medium">{s}</div>{i < a.length - 1 && <ArrowRight className="h-4 w-4 rotate-90 text-brand md:rotate-0" aria-hidden />}</div>
          ))}
        </div>
      </Card>

      <div className="relative mb-5 max-w-md"><Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" placeholder="Search agents or example tasks…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search agents" /></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => (
          <article key={a.id} className="card card-hover relative flex flex-col overflow-hidden p-5" style={{ ["--ac" as string]: a.color }}>
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: a.color }} />
            <div className="flex items-start gap-3">
              <AgentIcon id={a.id} size={48} />
              <div className="min-w-0 flex-1"><h2 className="font-display text-base font-bold leading-tight">{a.name}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-ok"><span className="h-1.5 w-1.5 rounded-full bg-ok" />Available · demo mode</p></div>
            </div>
            <p className="mt-3 text-sm text-muted">{a.description}</p>
            <p className="mt-3 text-xs"><span className="font-semibold" style={{ color: a.color }}>Purpose:</span> {a.purpose}</p>
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Try asking</p>
              {a.examples.slice(0, 2).map((e) => <button key={e} onClick={() => { setHandoff("assistant", e); router.push("/assistant"); }} className="block w-full rounded-lg bg-surface2 px-3 py-1.5 text-left text-xs text-muted transition hover:text-ink">“{e}”</button>)}
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-line px-3 py-2 text-xs text-muted"><span className="font-semibold text-ink">Recent:</span> {recent[a.id] ?? "No activity yet"}</div>
            <div className="mt-auto flex gap-2 pt-4">
              <Link href={a.href} className="btn btn-primary btn-sm flex-1" style={{ background: a.color, boxShadow: "none", color: "#0a0c16" }}>{a.launch}<ArrowRight className="h-3.5 w-3.5" /></Link>
              <Button size="sm" variant="secondary" onClick={() => setDetail(a)}>Details</Button>
            </div>
          </article>
        ))}
        {!list.length && <p className="col-span-full py-10 text-center text-sm text-muted">No agents match “{q}”.</p>}
      </div>
      <p className="mt-6 text-center text-xs text-muted">{SPECIALISTS.length} specialist agents + 1 coordinator · last assistant activity {state.conversations[0] ? timeAgo(state.conversations[0].updatedAt) : "n/a"}</p>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ""} footer={detail && <><Button variant="ghost" onClick={() => setDetail(null)}>Close</Button><Button href={detail.href}>{detail.launch}</Button></>}>
        {detail && (<div className="space-y-4 text-sm">
          <p>{detail.description}</p>
          <div><p className="label">Purpose</p><p className="text-muted">{detail.purpose}</p></div>
          <div><p className="label">Example tasks</p><ul className="list-disc space-y-1 pl-5 text-muted">{detail.examples.map((e) => <li key={e}>{e}</li>)}</ul></div>
          <p className="rounded-xl bg-warn/10 p-3 text-xs text-warn">Implementation note: in this build the agent is a rule-based module behind a provider interface (<code>services/ai/demo.ts</code>). Swap it for an HTTP provider to connect a real model.</p>
        </div>)}
      </Modal>
    </>
  );
}
