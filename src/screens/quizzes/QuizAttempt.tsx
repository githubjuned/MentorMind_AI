"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Flag, ListChecks, RotateCcw, Send, X } from "lucide-react";
import { Badge, Button, Card, Confirm, EmptyState, PageHeader, Progress, Ring, SectionTabs } from "@/components/common/ui";
import { QUIZ_TABS } from "@/components/navigation/sectionNav";
import { getKB } from "@/data/knowledge";
import { useApp, subjectName } from "@/hooks/useApp";
import { gradeAnswer } from "@/services/ai/demo";
import type { QuizAttempt as Attempt, Question } from "@/types";
import { cn, uid } from "@/utils";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function QuizReview({ attempt }: { attempt: Attempt }) {
  return (
    <ol className="space-y-3">
      {attempt.questions.map((q, i) => {
        const ok = attempt.results[q.id];
        const given = attempt.answers[q.id];
        return (
          <li key={q.id} className={cn("rounded-2xl border p-4", ok ? "border-ok/30 bg-ok/5" : "border-bad/30 bg-bad/5")}>
            <div className="flex items-start gap-3">
              <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white", ok ? "bg-ok" : "bg-bad")}>{ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}</span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{i + 1}. {q.q}</p>
                <p className="mt-2"><span className="text-muted">Your answer: </span><span className={ok ? "text-ok" : "text-bad"}>{given || "No answer"}</span></p>
                {!ok && <p><span className="text-muted">Correct answer: </span><b>{q.answer.split("|")[0]}</b></p>}
                <p className="mt-2 rounded-lg bg-surface2 px-3 py-2 text-xs text-muted"><b className="text-ink">Why: </b>{q.explanation}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function QuizAttempt() {
  const { state, update, finishQuiz } = useApp();
  const quiz = state.activeQuiz;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [exit, setExit] = useState(false);
  const [result, setResult] = useState<Attempt | null>(null);
  const [left, setLeft] = useState<number | null>(quiz?.timeLimit ?? null);
  const startRef = useRef(Date.now());
  const quizId = quiz?.id;

  const submit = useCallback(() => {
    if (!quiz) return;
    const results: Record<string, boolean> = {};
    quiz.questions.forEach((q) => { results[q.id] = gradeAnswer(q, answers[q.id] ?? ""); });
    const score = Object.values(results).filter(Boolean).length;
    const a: Attempt = { id: uid(), subjectId: quiz.subjectId, topic: quiz.topic, difficulty: quiz.difficulty, date: new Date().toISOString(), questions: quiz.questions, answers, results, score, total: quiz.questions.length, accuracy: Math.round((score / quiz.questions.length) * 100), seconds: Math.max(1, Math.round((Date.now() - startRef.current) / 1000)) };
    finishQuiz(a);
    setResult(a);
  }, [quiz, answers, finishQuiz]);

  useEffect(() => {
    if (!quizId || result) return;
    startRef.current = Date.now();
    if (quiz?.timeLimit) setLeft(quiz.timeLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);
  useEffect(() => {
    if (left === null || result || !quiz) return;
    if (left <= 0) { submit(); return; }
    const t = setTimeout(() => setLeft((l) => (l === null ? l : l - 1)), 1000);
    return () => clearTimeout(t);
  }, [left, result, quiz, submit]);

  const retry = () => {
    if (!result) return;
    update((s) => ({ ...s, activeQuiz: { id: uid(), subjectId: result.subjectId, topic: result.topic, difficulty: result.difficulty, questions: result.questions, timeLimit: null, createdAt: new Date().toISOString() } }));
    setResult(null); setAnswers({}); setIdx(0); setMarked([]); setLeft(null); startRef.current = Date.now();
  };

  if (result) return <Results a={result} onRetry={retry} />;
  if (!quiz) return (<><PageHeader title="Take a quiz" icon={ListChecks} color="#fb7185" /><SectionTabs items={QUIZ_TABS} /><EmptyState icon={ListChecks} title="No quiz in progress" body="Generate a quiz to start practising. Quizzes from the assistant and revision sessions also land here." action={<Button href="/quizzes">Create a quiz</Button>} /></>);

  const q: Question = quiz.questions[idx];
  const answered = quiz.questions.filter((x) => (answers[x.id] ?? "").trim()).length;
  const set = (v: string) => setAnswers((a) => ({ ...a, [q.id]: v }));
  const isMarked = marked.includes(q.id);

  return (
    <>
      <SectionTabs items={QUIZ_TABS} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><h1 className="truncate font-display text-xl font-bold">{quiz.topic}</h1><p className="text-xs text-muted">{subjectName(state, quiz.subjectId)} · {quiz.difficulty} · {answered}/{quiz.questions.length} answered</p></div>
        {left !== null && <Badge tone={left < 60 ? "bad" : "info"} className="px-3 py-1.5 text-sm"><Clock className="h-4 w-4" />{mmss(left)}</Badge>}
        <Button variant="ghost" size="sm" onClick={() => setExit(true)}>Exit quiz</Button>
      </div>
      <Progress value={((idx + 1) / quiz.questions.length) * 100} color="#fb7185" label="Quiz progress" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_16rem]">
        <Card className="anim-fade-up p-6 sm:p-8" key={q.id}>
          <div className="mb-4 flex flex-wrap items-center gap-2"><Badge tone="bad">Question {idx + 1} of {quiz.questions.length}</Badge><Badge>{{ mcq: "Multiple choice", tf: "True or false", fill: "Fill in the blank", short: "Short answer" }[q.type]}</Badge>{isMarked && <Badge tone="warn"><Flag className="h-3 w-3" />Marked</Badge>}</div>
          <h2 className="font-display text-xl font-semibold leading-snug">{q.q}</h2>
          <div className="mt-6 space-y-3">
            {(q.type === "mcq" || q.type === "tf") && q.options?.map((o, i) => {
              const on = answers[q.id] === o;
              return (
                <button key={o} onClick={() => set(o)} aria-pressed={on} className={cn("flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition", on ? "border-brand bg-brand/15" : "border-line bg-surface2 hover:border-brand/50")}>
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold", on ? "bg-brand text-white" : "bg-surface text-muted")}>{String.fromCharCode(65 + i)}</span>{o}
                </button>
              );
            })}
            {q.type === "fill" && <input className="input" value={answers[q.id] ?? ""} onChange={(e) => set(e.target.value)} placeholder="Type your answer" aria-label="Your answer" autoFocus />}
            {q.type === "short" && <textarea className="input min-h-32" value={answers[q.id] ?? ""} onChange={(e) => set(e.target.value)} placeholder="Write 1–2 sentences. Key terms are checked automatically in the demo." aria-label="Your answer" />}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button variant="secondary" icon={ArrowLeft} disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</Button>
            <Button variant={isMarked ? "soft" : "ghost"} icon={Flag} onClick={() => setMarked((m) => (isMarked ? m.filter((x) => x !== q.id) : [...m, q.id]))}>{isMarked ? "Unmark" : "Mark for review"}</Button>
            {idx < quiz.questions.length - 1 ? <Button onClick={() => setIdx(idx + 1)}>Next<ArrowRight className="h-4 w-4" /></Button> : <Button icon={Send} onClick={() => setConfirm(true)}>Submit quiz</Button>}
          </div>
        </Card>
        <Card className="h-fit p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Question navigator</p>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((x, i) => {
              const a = (answers[x.id] ?? "").trim();
              return <button key={x.id} onClick={() => setIdx(i)} aria-label={`Go to question ${i + 1}${marked.includes(x.id) ? ", marked" : ""}${a ? ", answered" : ""}`} aria-current={i === idx} className={cn("relative h-10 rounded-lg border text-sm font-semibold transition", i === idx ? "border-brand bg-brand text-white" : a ? "border-ok/50 bg-ok/15" : "border-line bg-surface2 hover:border-brand/50")}>{i + 1}{marked.includes(x.id) && <Flag className="absolute -right-1 -top-1 h-3.5 w-3.5 fill-warn text-warn" />}</button>;
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-[11px] text-muted"><p className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-ok/30" />Answered</p><p className="flex items-center gap-2"><Flag className="h-3 w-3 fill-warn text-warn" />Marked for review</p></div>
          <Button className="mt-4 w-full" size="sm" icon={Send} onClick={() => setConfirm(true)}>Submit quiz</Button>
        </Card>
      </div>
      <Confirm open={confirm} onClose={() => setConfirm(false)} title="Submit your quiz?" confirmLabel="Submit" onConfirm={submit}
        body={<>You answered <b>{answered}</b> of {quiz.questions.length} questions{marked.length > 0 && <> and marked <b>{marked.length}</b> for review</>}. {answered < quiz.questions.length && "Unanswered questions count as incorrect."}</>} />
      <Confirm open={exit} onClose={() => setExit(false)} danger title="Exit this quiz?" confirmLabel="Exit quiz" body="Your answers will be discarded and nothing will be recorded." onConfirm={() => update((s) => ({ ...s, activeQuiz: null }))} />
    </>
  );
}

function Results({ a, onRetry }: { a: Attempt; onRetry: () => void }) {
  const { state } = useApp();
  const byTopic = [...new Set(a.questions.map((q) => q.topicId))].map((tid) => {
    const qs = a.questions.filter((q) => q.topicId === tid);
    const right = qs.filter((q) => a.results[q.id]).length;
    return { tid, name: getKB(tid)?.title ?? tid, acc: Math.round((right / qs.length) * 100), n: qs.length, right };
  });
  const weak = byTopic.filter((t) => t.acc < 60);
  const next = weak.length ? weak.flatMap((w) => getKB(w.tid)?.related ?? []).filter((r, i, arr) => arr.indexOf(r) === i).slice(0, 4) : state.topics.filter((t) => t.mastery < 70).slice(0, 3).map((t) => t.name);
  const verdict = a.accuracy >= 80 ? ["Excellent work!", "#34d399"] : a.accuracy >= 60 ? ["Good progress", "#38d6ff"] : ["Keep practising", "#fb923c"];
  return (
    <>
      <SectionTabs items={QUIZ_TABS} />
      <Card className="anim-fade-up mb-6 overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <Ring value={a.accuracy} size={150} stroke={14} color={verdict[1]}><div><p className="font-display text-4xl font-bold">{a.score}<span className="text-xl text-muted">/{a.total}</span></p><p className="text-xs text-muted">score</p></div></Ring>
          <div className="flex-1"><p className="eyebrow" style={{ color: verdict[1] }}>Quiz complete</p><h1 className="mt-1 font-display text-3xl font-bold">{verdict[0]}</h1><p className="mt-1 text-sm text-muted">{a.topic} · {a.difficulty}. Your progress, mistakes and revision queue have been updated.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Correct", a.score, "text-ok"], ["Incorrect", a.total - a.score, "text-bad"], ["Accuracy", `${a.accuracy}%`, ""], ["Time taken", mmss(a.seconds), ""]].map(([l, v, c]) => <div key={l as string} className="rounded-xl bg-surface2 px-4 py-3"><p className="text-[11px] uppercase tracking-wide text-muted">{l}</p><p className={cn("font-display text-xl font-bold", c as string)}>{v}</p></div>)}</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2"><Button icon={RotateCcw} onClick={onRetry}>Retry this quiz</Button><Button variant="secondary" href="/quizzes">New quiz</Button><Button variant="secondary" href="/quizzes/history">History</Button><Button variant="ghost" href="/revision">Go to revision</Button></div>
      </Card>
      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Areas needing improvement</h2>{weak.length ? <ul className="space-y-3">{weak.map((w) => <li key={w.tid}><div className="mb-1 flex justify-between text-sm"><span>{w.name}</span><span className="text-bad">{w.right}/{w.n} correct</span></div><Progress value={w.acc} color="#fb7185" height={6} /></li>)}</ul> : <p className="text-sm text-muted">No topic scored below 60% in this quiz.</p>}{weak.length > 0 && <p className="mt-3 text-xs text-muted">These topics were added to your revision queue.</p>}</Card>
        <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Suggested next topics</h2><div className="flex flex-wrap gap-2">{next.map((n) => <Badge key={n} tone="info">{n}</Badge>)}</div><p className="mt-3 text-xs text-muted">Based on related topics and your current mastery scores.</p></Card>
      </div>
      <h2 className="mb-3 font-display text-lg font-semibold">Question-wise explanations</h2>
      <QuizReview attempt={a} />
    </>
  );
}
