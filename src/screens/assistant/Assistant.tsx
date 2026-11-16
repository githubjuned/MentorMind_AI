"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Copy, History, Mic, Paperclip, Plus, RefreshCw, Send, Sparkles, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
import type { AgentId, ChatMessage, Conversation, Payload, Route } from "@/types";
import { AgentBadge, AgentIcon } from "@/components/agents/AgentBadge";
import { PayloadView } from "@/components/agents/PayloadView";
import { Badge, Button, Confirm, cn, useToast } from "@/components/common/ui";
import { agentById } from "@/data/agents";
import { useApp } from "@/hooks/useApp";
import { DEMO_NOTICE, buildNotes, routeRequest, runCoordinator } from "@/services/ai/demo";
import { orchestrateAIRequest } from "@/services/ai/orchestrator";
import { copyText, takeHandoff, timeAgo, uid } from "@/utils";

const PROMPTS: { text: string; agent: AgentId }[] = [
  { text: "Explain photosynthesis with a practical example", agent: "doubt" },
  { text: "Create a 10-question quiz on Python loops", agent: "quiz" },
  { text: "Make short notes on SQL joins", agent: "notes" },
  { text: "I keep getting database normalization questions wrong", agent: "revision" },
  { text: "Plan 2 hours a day for my DBMS exam", agent: "planner" },
  { text: "Recommend resources for neural networks", agent: "resources" },
];
const STEPS = ["Understanding request", "Selecting appropriate agent", "Processing request", "Preparing response"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const plainText = (m: ChatMessage) => {
  const p = m.payload;
  if (p?.kind === "notes") return p.markdown;
  if (p?.kind === "answer") return `${p.answer.topicTitle}\n\n${p.answer.direct}\n\n${p.answer.concept}\n\nSteps:\n${p.answer.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nExample: ${p.answer.example}`;
  return m.text;
};

interface SR { start: () => void; stop: () => void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; lang: string }

export default function Assistant() {
  const { state, update, addActivity, addSession, addMemory, addRevision } = useApp();
  const toast = useToast();
  const [activeId, setActiveId] = useState(state.conversations[0]?.id ?? "");
  const [text, setText] = useState("");
  const [pending, setPending] = useState<{ step: number; route?: Route } | null>(null);
  const [attach, setAttach] = useState<{ name: string; text?: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [listening, setListening] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [voiceOk, setVoiceOk] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<SR | null>(null);
  const handoffDone = useRef(false);

  const conv = state.conversations.find((c) => c.id === activeId) ?? state.conversations[0];
  useEffect(() => { if (conv && conv.id !== activeId) setActiveId(conv.id); }, [conv, activeId]);
  useEffect(() => { setVoiceOk(typeof window !== "undefined" && !!((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition)); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [conv?.messages.length, pending?.step]);

  const patchConv = useCallback((id: string, fn: (c: Conversation) => Conversation) => update((s) => ({ ...s, conversations: s.conversations.map((c) => (c.id === id ? fn(c) : c)) })), [update]);

  const respond = useCallback(async (convId: string, question: string, att: { name: string; text?: string } | null, replaceId?: string) => {
    setPending({ step: 0 });
    await sleep(400);
    const route = routeRequest(question, state);
    setPending({ step: 1, route });
    await sleep(500);
    setPending({ step: 2, route });
    await sleep(500);

    let res: Awaited<ReturnType<typeof runCoordinator>>;
    try {
      const resp = await fetch("/api/coordinator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question, state, attachment: att?.name }),
      });
      if (resp.ok) {
        res = await resp.json();
      } else {
        res = await orchestrateAIRequest(question, state, att?.name);
      }
    } catch {
      res = await orchestrateAIRequest(question, state, att?.name);
    }

    if (att?.text && res.route.agent === "notes") {
      const n = buildNotes({ subjectId: res.route.params.subjectId ?? state.subjects[0]?.id ?? "", type: res.route.params.noteType ?? "short", sourceText: att.text, sourceName: att.name });
      res = { ...res, text: `I summarised “${att.name}” with the notes agent.`, payload: { kind: "notes", title: n.title, markdown: n.markdown, subjectId: n.subjectId, noteType: res.route.params.noteType ?? "short" } };
    }
    setPending({ step: 3, route: res.route || route });
    await sleep(350);
    const msg: ChatMessage = { id: replaceId ?? uid(), role: "agent", agent: res.agent, text: res.text, payload: res.payload as Payload, route: res.route, effects: res.effectLabels, time: new Date().toISOString() };
    patchConv(convId, (c) => ({ ...c, updatedAt: msg.time, messages: replaceId ? c.messages.map((m) => (m.id === replaceId ? msg : m)) : [...c.messages, msg] }));
    res.effects.forEach((e) => {
      addRevision(e.topicId, e.reason);
      addMemory("inferred", `Self-reported difficulty: ${state.topics.find((t) => t.id === e.topicId)?.name ?? "topic"}`, "You told the assistant you struggle with this topic. It was added to revision. This is an inference you can clear in Learning Memory.");
    });
    const sid = res.route.params.subjectId;
    if ((res.agent === "doubt" || res.agent === "revision") && sid) addSession({ subjectId: sid, topic: res.route.params.topicText ?? question.slice(0, 40), minutes: 3, kind: "doubt" });
    if (!replaceId) addActivity(res.agent === "notes" ? "notes" : res.agent === "quiz" ? "quiz" : "doubt", `Asked: ${question.slice(0, 60)}`, `Handled by ${agentById(res.agent).name}`, "/assistant");
    setPending(null);
  }, [state, patchConv, addRevision, addMemory, addSession, addActivity]);

  const send = useCallback((raw?: string) => {
    const q = (raw ?? text).trim();
    if (!q || pending || !conv) return;
    const msg: ChatMessage = { id: uid(), role: "user", text: q, time: new Date().toISOString(), attachment: attach?.name };
    patchConv(conv.id, (c) => ({ ...c, title: c.messages.some((m) => m.role === "user") ? c.title : q.slice(0, 40), updatedAt: msg.time, messages: [...c.messages, msg] }));
    setText("");
    const a = attach;
    setAttach(null);
    void respond(conv.id, q, a);
  }, [text, pending, conv, attach, patchConv, respond]);

  useEffect(() => {
    if (handoffDone.current || !conv) return;
    handoffDone.current = true;
    const h = takeHandoff("assistant");
    if (h) setTimeout(() => send(h), 150);
  }, [conv, send]);

  const newConv = () => {
    const c: Conversation = { id: uid(), title: "New conversation", messages: [], updatedAt: new Date().toISOString() };
    update((s) => ({ ...s, conversations: [c, ...s.conversations] }));
    setActiveId(c.id); setShowHistory(false);
  };
  const regenerate = (m: ChatMessage) => {
    if (!conv || pending) return;
    const idx = conv.messages.findIndex((x) => x.id === m.id);
    const q = [...conv.messages.slice(0, idx)].reverse().find((x) => x.role === "user");
    if (q) void respond(conv.id, q.text, null, m.id);
  };
  const feedback = (m: ChatMessage, f: "up" | "down") => {
    patchConv(conv.id, (c) => ({ ...c, messages: c.messages.map((x) => (x.id === m.id ? { ...x, feedback: x.feedback === f ? undefined : f } : x)) }));
    if (m.feedback !== f) toast(f === "up" ? "Thanks — marked as helpful (stored on this device only)" : "Thanks — marked as not helpful (stored on this device only)", "info");
  };
  const onFile = (f?: File) => {
    if (!f) return;
    if (!/\.(pdf|docx|txt|md)$/i.test(f.name)) return toast("Attach a PDF, DOCX or TXT file.", "error");
    if (/\.(txt|md)$/i.test(f.name)) {
      const r = new FileReader();
      r.onload = () => setAttach({ name: f.name, text: String(r.result).slice(0, 60000) });
      r.readAsText(f);
    } else setAttach({ name: f.name });
    toast(`Attached ${f.name}`, "info");
  };
  const toggleVoice = () => {
    if (listening) { recRef.current?.stop(); return; }
    const w = window as unknown as Record<string, new () => SR>;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return toast("Voice input isn't supported in this browser.", "error");
    const r = new Ctor();
    r.lang = "en-US";
    r.onresult = (e) => setText((t) => (t ? t + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListening(false);
    recRef.current = r; r.start(); setListening(true);
  };
  const sorted = useMemo(() => [...state.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [state.conversations]);
  const empty = !conv || conv.messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className="grid gap-4 lg:h-[calc(100dvh-8.5rem)] lg:grid-cols-[17rem_1fr]">
      <aside className={cn("card flex-col overflow-hidden lg:flex", showHistory ? "flex" : "hidden")}>
        <div className="flex items-center justify-between border-b border-line p-3"><p className="font-display text-sm font-semibold">Conversations</p><Button size="sm" icon={Plus} onClick={newConv}>New</Button></div>
        <ul className="flex-1 space-y-1 overflow-y-auto p-2">
          {sorted.map((c) => (
            <li key={c.id}>
              <button onClick={() => { setActiveId(c.id); setShowHistory(false); }} className={cn("w-full rounded-xl px-3 py-2.5 text-left transition", c.id === conv?.id ? "bg-brand/15" : "hover:bg-surface2")}>
                <span className="block truncate text-sm font-medium">{c.title}</span><span className="text-[11px] text-muted">{c.messages.length} messages · {timeAgo(c.updatedAt)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line p-3 text-[11px] leading-relaxed text-muted">{DEMO_NOTICE}</div>
      </aside>

      <section className="card relative flex min-h-[70dvh] flex-col overflow-hidden lg:min-h-0">
        <header className="flex items-center gap-3 border-b border-line px-4 py-3">
          <AgentIcon id="coordinator" size={38} />
          <div className="min-w-0 flex-1"><h1 className="font-display text-base font-bold">MentorMind Assistant</h1><p className="truncate text-xs text-muted">Coordinator routes your request to a specialist · <span className="text-warn">demo routing</span></p></div>
          <Button variant="ghost" size="sm" icon={History} className="lg:hidden" onClick={() => setShowHistory((s) => !s)}>History</Button>
          <Button variant="ghost" size="sm" icon={Trash2} disabled={!conv?.messages.length} onClick={() => setConfirmClear(true)}>Clear</Button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {empty && !pending && (
            <div className="mx-auto max-w-2xl py-6 text-center anim-fade-up">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand/15 text-brand anim-float"><Sparkles className="h-8 w-8" /></div>
              <h2 className="font-display text-2xl font-bold">What would you like to learn, {state.profile.name.split(" ")[0]}?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">Ask in plain language. The coordinator will pick the right specialist and show you who answered.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {PROMPTS.map((p) => (
                  <button key={p.text} onClick={() => send(p.text)} className="card card-hover flex flex-col items-start gap-2 p-3.5 text-left"><AgentBadge id={p.agent} /><span className="text-sm">{p.text}</span></button>
                ))}
              </div>
            </div>
          )}
          {conv?.messages.map((m) => m.role === "user" ? (
            <div key={m.id} className="flex justify-end anim-fade-up"><div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm text-white">{m.attachment && <p className="mb-1 flex items-center gap-1 text-xs opacity-80"><Paperclip className="h-3 w-3" />{m.attachment}</p>}{m.text}</div></div>
          ) : (
            <div key={m.id} className="anim-fade-up">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <AgentBadge id={m.agent ?? "coordinator"} size="md" />
                {m.route && <button onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))} className="flex items-center gap-1 text-[11px] text-muted hover:text-ink">Routed by Coordinator · {Math.round(m.route.confidence * 100)}% match<ChevronDown className={cn("h-3 w-3 transition", open[m.id] && "rotate-180")} /></button>}
              </div>
              {m.route && open[m.id] && (
                <ol className="mb-3 space-y-1 rounded-xl border border-line bg-surface2/60 p-3 text-xs text-muted">
                  <li><b className="text-ink">Intent:</b> {m.route.intent}</li>{m.route.reasoning.map((r) => <li key={r}>• {r}</li>)}<li>• Selected <b style={{ color: agentById(m.route.agent).color }}>{agentById(m.route.agent).name}</b></li>
                </ol>
              )}
              {m.text && <p className="mb-3 text-sm leading-relaxed">{m.text}</p>}
              {m.payload && <PayloadView payload={m.payload} onFollowup={(q) => send(q)} />}
              {m.effects && m.effects.length > 0 && (
                <div className="mt-3 rounded-xl border border-ok/30 bg-ok/10 p-3 text-xs"><p className="mb-1 font-semibold text-ok">Learning data updated</p><ul className="space-y-0.5 text-muted">{m.effects.map((e) => <li key={e} className="flex gap-1.5"><Check className="mt-0.5 h-3 w-3 shrink-0 text-ok" />{e}</li>)}</ul></div>
              )}
              {m.payload?.kind !== "text" || m.text ? (
                <div className="mt-3 flex items-center gap-1">
                  <IconBtn label="Copy response" onClick={async () => toast((await copyText(plainText(m))) ? "Copied to clipboard" : "Copy failed", "info")}><Copy className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Regenerate response" onClick={() => regenerate(m)} disabled={!!pending || m.route === undefined}><RefreshCw className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Helpful" active={m.feedback === "up"} onClick={() => feedback(m, "up")}><ThumbsUp className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Not helpful" active={m.feedback === "down"} onClick={() => feedback(m, "down")}><ThumbsDown className="h-3.5 w-3.5" /></IconBtn>
                </div>
              ) : null}
            </div>
          ))}
          {pending && <AgentActivity step={pending.step} route={pending.route} />}
          <div ref={endRef} />
        </div>

        <footer className="border-t border-line p-3 sm:p-4">
          {attach && <div className="mb-2"><Badge tone="brand"><Paperclip className="h-3 w-3" />{attach.name}<button aria-label="Remove attachment" onClick={() => setAttach(null)}><X className="h-3 w-3" /></button></Badge>{!attach.text && <span className="ml-2 text-[11px] text-muted">PDF/DOCX text can&apos;t be read in the demo; the topic in your message is used.</span>}</div>}
          <form data-tour="assistant-input" onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-2">
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
            <Button type="button" variant="secondary" icon={Paperclip} onClick={() => fileRef.current?.click()} aria-label="Attach file" />
            <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} placeholder="Ask a doubt, request notes, a quiz, a plan…" className="input max-h-32 min-h-[44px] resize-none" aria-label="Message" />
            <Button type="button" variant={listening ? "danger" : "secondary"} icon={Mic} onClick={toggleVoice} disabled={!voiceOk} title={voiceOk ? "Voice input" : "Voice input isn't supported in this browser"} aria-label="Voice input" />
            <Button type="submit" icon={Send} disabled={!text.trim() || !!pending} aria-label="Send message">Send</Button>
          </form>
        </footer>
      </section>
      <Confirm open={confirmClear} onClose={() => setConfirmClear(false)} danger title="Clear this conversation?" body="All messages in this conversation will be deleted from this device." confirmLabel="Clear"
        onConfirm={() => { patchConv(conv.id, (c) => ({ ...c, messages: [], title: "New conversation" })); toast("Conversation cleared", "info"); }} />
    </div>
  );
}

function IconBtn({ children, label, onClick, active, disabled }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} aria-label={label} title={label} aria-pressed={active} className={cn("rounded-lg p-2 text-muted transition hover:bg-surface2 hover:text-ink disabled:opacity-40", active && "bg-brand/15 text-brand")}>{children}</button>;
}

function AgentActivity({ step, route }: { step: number; route?: Route }) {
  const agent = route ? agentById(route.agent) : undefined;
  return (
    <div className="anim-fade-up rounded-2xl border border-line bg-surface2/60 p-4" role="status" aria-label="Agent activity">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted"><span className="relative flex h-2.5 w-2.5"><span className="anim-pulse-ring absolute inset-0 rounded-full bg-brand" /><span className="relative h-2.5 w-2.5 rounded-full bg-brand" /></span>Agent activity <span className="font-normal">(demo routing)</span></div>
      <ol className="grid gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition", i < step ? "text-ok" : i === step ? "bg-brand/15 font-semibold text-ink" : "text-muted/60")}>
            {i < step ? <Check className="h-3.5 w-3.5" /> : i === step ? <span className="dot-blink flex gap-0.5"><span className="h-1 w-1 rounded-full bg-brand" /><span className="h-1 w-1 rounded-full bg-brand" /><span className="h-1 w-1 rounded-full bg-brand" /></span> : <span className="h-1.5 w-1.5 rounded-full bg-line" />}
            {i === 1 && agent && step >= 1 ? <span>Selected <b style={{ color: agent.color }}>{agent.short}</b></span> : s}
          </li>
        ))}
      </ol>
    </div>
  );
}
