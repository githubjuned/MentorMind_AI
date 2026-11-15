"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Copy, Lightbulb, Loader2, Send, Sparkles } from "lucide-react";
import { AnswerView } from "@/components/learning/AnswerView";
import { Button, Card, Field, PageHeader, Segmented, useToast } from "@/components/common/ui";
import { KB } from "@/data/knowledge";
import { useApp } from "@/hooks/useApp";
import { answerQuestion } from "@/services/ai/demo";
import type { DoubtAnswer, DoubtFormat } from "@/types";
import { copyText, timeAgo, uid } from "@/utils";

const FORMATS: { value: DoubtFormat; label: string }[] = [
  { value: "simple", label: "Simple" }, { value: "detailed", label: "Detailed" }, { value: "steps", label: "Step-by-step" }, { value: "examples", label: "Practical examples" }, { value: "visual", label: "Visual" },
];
const EXAMPLES = ["Why does inorder traversal of a BST give sorted output?", "Explain backpropagation step by step", "What is a transitive dependency?", "Explain photosynthesis with a practical example", "When should I use a while loop instead of a for loop?"];

export default function DoubtSolver() {
  const { state, update, addActivity, addSession } = useApp();
  const toast = useToast();
  const [question, setQuestion] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [format, setFormat] = useState<DoubtFormat>(state.profile.styles.includes("Step-by-step explanations") ? "steps" : "detailed");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<DoubtAnswer | null>(null);
  const [history, setHistory] = useState<{ id: string; q: string; a: DoubtAnswer; at: string }[]>([]);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const topics = useMemo(() => KB.filter((k) => !subjectId || k.subjectId === subjectId), [subjectId]);
  useEffect(() => { if (answer) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [answer]);

  const submit = async (q = question) => {
    if (q.trim().length < 4 && !topicId) return setError("Type a question (at least a few words) or pick a topic.");
    setError(""); setBusy(true); setQuestion(q);
    await new Promise((r) => setTimeout(r, 700));
    const base = answerQuestion(q || topicId, { subjectId: subjectId || undefined, topicId: topicId || undefined, format });
    const a: DoubtAnswer = level === "beginner" ? { ...base, steps: base.steps.slice(0, 4), concept: base.concept.split(". ").slice(0, 2).join(". ") + "." } : base;
    setAnswer(a); setBusy(false);
    setHistory((h) => [{ id: uid(), q: q || a.topicTitle, a, at: new Date().toISOString() }, ...h].slice(0, 8));
    if (a.subjectId) addSession({ subjectId: a.subjectId, topic: a.topicTitle, minutes: 5, kind: "doubt" });
    addActivity("doubt", `Asked: ${(q || a.topicTitle).slice(0, 60)}`, "Doubt Solver", "/doubt-solver");
  };
  const saveAsNote = () => {
    if (!answer) return;
    const now = new Date().toISOString();
    const content = `# ${answer.topicTitle}\n\n> ${answer.direct}\n\n## Concept\n${answer.concept}\n\n## Steps\n${answer.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n## Example\n${answer.example}\n\n## Takeaways\n${answer.takeaways.map((t) => `- ${t}`).join("\n")}`;
    update((st) => ({ ...st, notes: [{ id: uid(), title: `${answer.topicTitle} — Doubt Solver answer`, subjectId: answer.subjectId || st.subjects[0]?.id || "", type: "short", content, source: "Doubt Solver", createdAt: now, updatedAt: now }, ...st.notes] }));
    toast("Answer saved to your notes");
  };

  return (
    <>
      <PageHeader title="AI Doubt Solver" subtitle="Ask any concept question and get a structured answer in the format that suits you." icon={Lightbulb} color="#22d3ee" eyebrow="Agent 1 · Concepts" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <Card className="h-fit p-5">
          <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="space-y-4">
            <Field label="Your question" error={error}><textarea className="input min-h-32" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Explain the difference between 2NF and 3NF with an example" /></Field>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field label="Subject"><select className="input" value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicId(""); }}><option value="">Any subject</option>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
              <Field label="Topic"><select className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}><option value="">Detect automatically</option>{topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></Field>
            </div>
            <Field label="Explanation difficulty"><Segmented value={level} onChange={setLevel} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} /></Field>
            <Field label="Answer format"><div className="flex flex-wrap gap-2">{FORMATS.map((f) => <button type="button" key={f.value} aria-pressed={format === f.value} onClick={() => setFormat(f.value)} className={`chip ${format === f.value ? "chip-on" : ""}`}>{f.label}</button>)}</div></Field>
            <Button type="submit" className="w-full" icon={busy ? Loader2 : Send} disabled={busy}>{busy ? "Thinking…" : "Get explanation"}</Button>
          </form>
          <div className="mt-6 border-t border-line pt-4">
            <p className="label">Example prompts</p>
            <div className="space-y-1.5">{EXAMPLES.map((e) => <button key={e} onClick={() => void submit(e)} className="block w-full rounded-lg bg-surface2 px-3 py-2 text-left text-xs text-muted transition hover:text-ink">{e}</button>)}</div>
          </div>
        </Card>

        <div ref={ref} className="min-w-0 scroll-mt-24">
          {busy && <Card className="space-y-3 p-6"><div className="skeleton h-6 w-1/3" /><div className="skeleton h-20" /><div className="skeleton h-28" /><div className="skeleton h-28" /></Card>}
          {!busy && answer && (
            <Card className="p-5 anim-fade-up sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <p className="flex items-center gap-2 text-xs text-muted"><Sparkles className="h-3.5 w-3.5 text-brand2" />Answered by the Doubt Solver (demo knowledge base)</p>
                <div className="flex gap-2"><Button size="sm" variant="secondary" icon={Copy} onClick={async () => toast((await copyText(`${answer.topicTitle}\n${answer.direct}\n${answer.concept}`)) ? "Copied" : "Copy failed", "info")}>Copy</Button><Button size="sm" variant="secondary" icon={Bookmark} onClick={saveAsNote}>Save as note</Button></div>
              </div>
              <AnswerView answer={answer} onFollowup={(q) => void submit(q)} />
            </Card>
          )}
          {!busy && !answer && (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-line p-8 text-center"><Lightbulb className="mb-3 h-10 w-10 text-brand2" /><h2 className="font-display text-lg font-semibold">Ask your first question</h2><p className="mt-1 max-w-sm text-sm text-muted">Answers include a direct answer, concept, steps, a practical example, takeaways, related topics and follow-ups.</p></div>
          )}
          {history.length > 1 && (
            <div className="mt-6"><p className="label">This session</p><ul className="space-y-1">{history.slice(1).map((h) => <li key={h.id}><button onClick={() => setAnswer(h.a)} className="flex w-full justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-surface2"><span className="truncate">{h.q}</span><span className="shrink-0 text-xs text-muted">{timeAgo(h.at)}</span></button></li>)}</ul></div>
          )}
        </div>
      </div>
    </>
  );
}
