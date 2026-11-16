"use client";
import { useState } from "react";
import { History, ListChecks, Loader2, Play, Sparkles, Timer } from "lucide-react";
import { Badge, Button, Card, Field, PageHeader, SectionTabs } from "@/components/common/ui";
import { QUIZ_TABS } from "@/components/navigation/sectionNav";
import { KB } from "@/data/knowledge";
import { useApp, subjectName } from "@/hooks/useApp";
import { useStartQuiz } from "@/hooks/useStartQuiz";
import { buildQuiz, type QuizFormat } from "@/services/ai/demo";
import type { Difficulty, Question } from "@/types";
import { cn } from "@/utils";

const FORMATS: { value: QuizFormat; label: string }[] = [
  { value: "mcq", label: "Multiple choice" }, { value: "tf", label: "True / False" }, { value: "fill", label: "Fill in the blanks" }, { value: "short", label: "Short answer" }, { value: "mixed", label: "Mixed quiz" },
];
const TYPE_LABEL: Record<string, string> = { mcq: "MCQ", tf: "T/F", fill: "Fill", short: "Short" };

export default function QuizGenerator() {
  const { state } = useApp();
  const startQuiz = useStartQuiz();
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id ?? "");
  const [topicId, setTopicId] = useState("");
  const [topicText, setTopicText] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<QuizFormat>("mixed");
  const [timer, setTimer] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState<{ questions: Question[]; topic: string; subjectId: string; note: string } | null>(null);
  const topics = KB.filter((k) => k.subjectId === subjectId);

  const generate = async () => {
    if (!subjectId) return setErr("Select a subject first.");
    setErr(""); setBusy(true); setPreview(null);
    await new Promise((r) => setTimeout(r, 800));
    const r = buildQuiz({ subjectId, topicId: topicId || undefined, topicText: topicText || undefined, difficulty, count, format });
    setBusy(false);
    if (!r.questions.length) return setErr("The demo question bank has no questions for that combination. Try Mixed format or another topic.");
    setPreview({ questions: r.questions, topic: r.topicTitle, subjectId: r.subjectId || subjectId, note: r.note });
  };
  const active = state.activeQuiz;

  return (
    <>
      <PageHeader title="AI Quiz Generator" subtitle="Create a practice quiz in any format. Scores update your progress, mistakes and revision queue." icon={ListChecks} color="#fb7185" eyebrow="Agent 3 · Quizzes" actions={<Button variant="secondary" icon={History} href="/quizzes/history">History</Button>} />
      <SectionTabs items={QUIZ_TABS} />
      {active && (
        <Card className="mb-6 flex flex-wrap items-center gap-3 border-bad/30 bg-bad/5 p-4 text-sm">
          <Play className="h-5 w-5 text-bad" /><span className="flex-1">You have a quiz in progress: <b>{active.topic}</b> ({active.questions.length} questions).</span><Button size="sm" href="/quizzes/attempt">Resume</Button>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-[28rem_1fr]">
        <Card data-tour="quiz-start" className="h-fit space-y-5 p-5">
          <Field label="Subject"><select className="input" value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicId(""); }}>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Topic"><select className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}><option value="">Whole subject / custom topic</option>{topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></Field>
          {!topicId && <Field label="Custom topic (optional)" hint="Unknown topics fall back to questions from the selected subject."><input className="input" value={topicText} onChange={(e) => setTopicText(e.target.value)} placeholder="e.g. database normalization" /></Field>}
          <Field label="Difficulty"><div className="grid grid-cols-3 gap-2">{(["easy", "medium", "hard"] as Difficulty[]).map((d) => <button key={d} onClick={() => setDifficulty(d)} aria-pressed={difficulty === d} className={cn("rounded-xl border py-2 text-sm font-semibold capitalize transition", difficulty === d ? "border-brand bg-brand/15" : "border-line bg-surface2 hover:border-brand/50")}>{d}</button>)}</div></Field>
          <Field label={`Number of questions: ${count}`}><input type="range" min={3} max={20} value={count} onChange={(e) => setCount(+e.target.value)} className="w-full accent-[var(--brand)]" aria-label="Number of questions" /></Field>
          <Field label="Question format"><div className="flex flex-wrap gap-2">{FORMATS.map((f) => <button key={f.value} aria-pressed={format === f.value} onClick={() => setFormat(f.value)} className={cn("chip", format === f.value && "chip-on")}>{f.label}</button>)}</div></Field>
          <Field label="Timer"><div className="flex flex-wrap items-center gap-2"><Timer className="h-4 w-4 text-muted" />{[0, 5, 10, 20].map((m) => <button key={m} aria-pressed={timer === m} onClick={() => setTimer(m)} className={cn("chip", timer === m && "chip-on")}>{m ? `${m} min` : "No timer"}</button>)}</div></Field>
          {err && <p role="alert" className="text-sm font-medium text-bad">{err}</p>}
          <Button className="w-full" icon={busy ? Loader2 : Sparkles} onClick={generate} disabled={busy}>{busy ? "Generating quiz…" : "Generate quiz"}</Button>
        </Card>

        <div>
          {busy && <Card className="space-y-3 p-6">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-16" />)}</Card>}
          {!busy && preview && (
            <Card className="anim-fade-up p-6">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="bad">Quiz ready</Badge><Badge>{subjectName(state, preview.subjectId)}</Badge><Badge tone="warn">{difficulty}</Badge>{timer > 0 && <Badge tone="info"><Timer className="h-3 w-3" />{timer} min</Badge>}</div>
              <h2 className="mt-3 font-display text-2xl font-bold">{preview.topic}</h2>
              <p className="mt-1 text-sm text-muted">{preview.questions.length} questions · generated by the demo Quiz agent from its built-in question bank.</p>
              {preview.note && <p className="mt-3 rounded-xl bg-warn/10 p-3 text-xs text-warn">{preview.note}</p>}
              <ol className="mt-4 divide-y divide-line rounded-xl border border-line">{preview.questions.map((q, i) => <li key={q.id} className="flex items-center gap-3 px-4 py-2.5 text-sm"><span className="w-5 text-xs text-muted">{i + 1}</span><span className="min-w-0 flex-1 truncate">{q.q}</span><Badge>{TYPE_LABEL[q.type]}</Badge></li>)}</ol>
              <div className="mt-5 flex gap-2"><Button icon={Play} onClick={() => startQuiz({ subjectId: preview.subjectId, topic: preview.topic, difficulty, questions: preview.questions, timeLimit: timer ? timer * 60 : null })}>Start quiz</Button><Button variant="secondary" onClick={generate}>Regenerate</Button></div>
            </Card>
          )}
          {!busy && !preview && (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-line p-8 text-center"><ListChecks className="mb-3 h-10 w-10 text-bad" /><h2 className="font-display text-lg font-semibold">Configure and generate a quiz</h2><p className="mt-1 max-w-sm text-sm text-muted">Answers are graded instantly with explanations for every question, and weak topics join your revision queue.</p></div>
          )}
        </div>
      </div>
    </>
  );
}
