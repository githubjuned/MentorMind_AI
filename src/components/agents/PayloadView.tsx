"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarPlus, CheckCircle2, ExternalLink, ListChecks, NotebookPen, Play, Repeat, Save } from "lucide-react";
import type { Payload } from "@/types";
import { AnswerView } from "@/components/learning/AnswerView";
import { Markdown } from "@/components/common/Markdown";
import { Badge, Button, useToast } from "@/components/common/ui";
import { ResourceCard } from "@/components/learning/ResourceCard";
import { useApp, subjectName } from "@/hooks/useApp";
import { useStartQuiz } from "@/hooks/useStartQuiz";
import { fmtDate, fmtTime, uid } from "@/utils";
import { noteTypeLabel } from "@/services/ai/demo";

export function PayloadView({ payload, onFollowup }: { payload: Payload; onFollowup?: (q: string) => void }) {
  const { state, update, addActivity } = useApp();
  const toast = useToast();
  const router = useRouter();
  const startQuiz = useStartQuiz();
  const [saved, setSaved] = useState(false);

  switch (payload.kind) {
    case "answer": return <AnswerView answer={payload.answer} onFollowup={onFollowup} />;
    case "text": return null;
    case "notes":
      return (
        <div className="rounded-2xl border border-line bg-surface2/60 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2"><Badge tone="warn"><NotebookPen className="h-3 w-3" />{noteTypeLabel(payload.noteType)}</Badge><Badge>{subjectName(state, payload.subjectId)}</Badge></div>
          <div className="max-h-96 overflow-y-auto pr-2"><Markdown text={payload.markdown} /></div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" icon={saved ? CheckCircle2 : Save} disabled={saved} onClick={() => {
              const now = new Date().toISOString();
              update((s) => ({ ...s, notes: [{ id: uid(), title: payload.title, subjectId: payload.subjectId, type: payload.noteType, content: payload.markdown, source: "AI Assistant", createdAt: now, updatedAt: now }, ...s.notes] }));
              addActivity("notes", `Generated notes: ${payload.title}`, "Saved from AI Assistant", "/notes");
              setSaved(true); toast("Notes saved to your library");
            }}>{saved ? "Saved" : "Save to my notes"}</Button>
            <Button size="sm" variant="secondary" href="/notes">Open Notes workspace</Button>
          </div>
        </div>
      );
    case "quiz":
      return (
        <div className="rounded-2xl border border-line bg-surface2/60 p-4">
          <div className="flex flex-wrap items-center gap-2"><Badge tone="bad"><ListChecks className="h-3 w-3" />{payload.questions.length} questions</Badge><Badge>{payload.difficulty}</Badge><Badge>{subjectName(state, payload.subjectId)}</Badge></div>
          <ol className="mt-3 space-y-1.5 text-sm">{payload.questions.slice(0, 3).map((q, i) => <li key={q.id} className="truncate text-muted">{i + 1}. {q.q}</li>)}{payload.questions.length > 3 && <li className="text-xs text-muted">+ {payload.questions.length - 3} more…</li>}</ol>
          <Button className="mt-3" size="sm" icon={Play} onClick={() => startQuiz(payload)}>Start quiz</Button>
        </div>
      );
    case "plan": {
      const days = [...new Set(payload.tasks.map((t) => t.date))];
      return (
        <div className="rounded-2xl border border-line bg-surface2/60 p-4">
          <p className="mb-2 text-sm font-semibold">{payload.tasks.filter((t) => t.kind !== "break").length} sessions over {days.length} days</p>
          <ul className="max-h-60 space-y-1 overflow-y-auto pr-1 text-sm">
            {payload.tasks.filter((t) => t.kind !== "break").slice(0, 12).map((t) => <li key={t.id} className="flex justify-between gap-3 rounded-lg px-2 py-1 hover:bg-surface"><span className="truncate">{t.title}</span><span className="shrink-0 text-xs text-muted">{fmtDate(t.date)} · {fmtTime(t.start)}</span></li>)}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button size="sm" icon={saved ? CheckCircle2 : CalendarPlus} disabled={saved || !payload.tasks.length} onClick={() => { update((s) => ({ ...s, tasks: [...s.tasks, ...payload.tasks] })); addActivity("plan", `Added ${payload.tasks.length} planned sessions`, payload.title, "/planner"); setSaved(true); toast("Plan added to your planner"); }}>{saved ? "Added to planner" : "Add to my planner"}</Button>
            <Button size="sm" variant="secondary" href="/planner">Open planner</Button>
          </div>
        </div>
      );
    }
    case "progress":
      return (
        <div className="rounded-2xl border border-line bg-surface2/60 p-4">
          <p className="mb-3 text-xs text-muted">{payload.summary}</p>
          <dl className="grid gap-2 sm:grid-cols-2">{payload.lines.map((l) => <div key={l.label} className="rounded-xl bg-surface px-3 py-2"><dt className="text-[11px] uppercase tracking-wide text-muted">{l.label}</dt><dd className={`text-sm font-semibold ${l.tone === "ok" ? "text-ok" : l.tone === "warn" ? "text-warn" : l.tone === "bad" ? "text-bad" : ""}`}>{l.value}</dd></div>)}</dl>
          <Button className="mt-3" size="sm" variant="secondary" href="/progress">Open progress dashboard</Button>
        </div>
      );
    case "resources":
      return <div className="grid gap-3 sm:grid-cols-2">{payload.items.map((r) => <ResourceCard key={r.id} r={r} compact />)}</div>;
    case "revision":
      return (
        <div className="space-y-3">
          {payload.answer && <AnswerView answer={payload.answer} onFollowup={onFollowup} />}
          {payload.practice.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface2/60 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Repeat className="h-4 w-4 text-warn" />Targeted practice ({payload.practice.length} questions)</p>
              <ol className="space-y-1 text-sm text-muted">{payload.practice.map((q, i) => <li key={q.id}>{i + 1}. {q.q}</li>)}</ol>
              <Button className="mt-3" size="sm" icon={Play} onClick={() => startQuiz({ subjectId: payload.practice[0].subjectId, topic: "Targeted practice", difficulty: "easy", questions: payload.practice })}>Practise now</Button>
            </div>
          )}
          <div className="flex gap-2"><Button size="sm" variant="secondary" icon={Repeat} onClick={() => router.push("/revision")}>Open Revision Centre</Button><Link href="/memory" className="btn btn-ghost btn-sm"><ExternalLink className="h-3.5 w-3.5" />See what was recorded</Link></div>
        </div>
      );
  }
}
