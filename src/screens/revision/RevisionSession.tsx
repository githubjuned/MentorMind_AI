"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Layers, ListChecks, Repeat, RotateCw, X } from "lucide-react";
import { Markdown } from "@/components/common/Markdown";
import { Badge, Button, Card, EmptyState, Field, PageHeader, Progress, SectionTabs, Tabs, cn, useToast } from "@/components/common/ui";
import { REVISION_TABS } from "@/components/navigation/sectionNav";
import { getKB } from "@/data/knowledge";
import { useApp, subjectName } from "@/hooks/useApp";
import { gradeAnswer } from "@/services/ai/demo";
import { fmtDate, addDays, takeHandoff, todayStr } from "@/utils";

type Sec = "summary" | "concepts" | "cards" | "practice" | "quiz" | "finish";

export default function RevisionSession() {
  const { state, completeRevision, addRevision } = useApp();
  const toast = useToast();
  const [topicId, setTopicId] = useState<string>("");
  const [sec, setSec] = useState<Sec>("summary");
  const [seen, setSeen] = useState<Set<Sec>>(new Set(["summary"]));
  const [card, setCard] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState<Record<number, boolean>>({});
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [qa, setQa] = useState<Record<string, string>>({});
  const [graded, setGraded] = useState(false);
  const [next, setNext] = useState(3);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => { const h = takeHandoff("revision"); if (h) setTopicId(h); }, []);
  const kb = topicId ? getKB(topicId) : undefined;
  const item = state.revisions.find((r) => r.topicId === topicId);
  const cards = useMemo(() => kb ? [...kb.definitions.map(([t, d]) => ({ f: t, b: d })), ...kb.questions.filter((q) => q.type !== "mcq").map((q) => ({ f: q.q, b: q.answer.split("|")[0] })), ...kb.followups.slice(0, 1).map((f) => ({ f, b: kb.direct }))] : [], [kb]);
  const quizQs = useMemo(() => (kb ? kb.questions.filter((q) => q.type !== "short").slice(0, 4) : []), [kb]);
  const quizScore = graded && quizQs.length ? Math.round((quizQs.filter((q) => gradeAnswer(q, qa[q.id] ?? "")).length / quizQs.length) * 100) : undefined;
  const go = (s: Sec) => { setSec(s); setSeen((x) => new Set(x).add(s)); };
  const order: Sec[] = ["summary", "concepts", "cards", "practice", "quiz", "finish"];
  const done = order.filter((s) => s !== "finish" && (seen.has(s) && (s !== "quiz" || graded))).length;
  const pct = Math.round((done / 5) * 100);
  useEffect(() => { if (quizScore !== undefined) setNext(quizScore >= 80 ? 7 : quizScore >= 60 ? 3 : 1); }, [quizScore]);

  if (!kb) {
    return (
      <>
        <PageHeader title="Revision session" icon={Repeat} color="#fb923c" eyebrow="Agent 6 · Revision" subtitle="Pick a topic to revise with summaries, flashcards and a quick quiz." />
        <SectionTabs items={REVISION_TABS} />
        <div className="grid gap-3 md:grid-cols-2">
          {state.revisions.map((r) => <button key={r.id} onClick={() => { setTopicId(r.topicId); startedAt.current = Date.now(); }} className="card card-hover flex items-center gap-3 p-4 text-left"><span className="flex-1"><span className="block font-semibold">{r.topic}</span><span className="text-xs text-muted">{subjectName(state, r.subjectId)} · due {fmtDate(r.dueDate)}</span></span><ChevronRight className="h-4 w-4" /></button>)}
          {!state.revisions.length && <div className="md:col-span-2"><EmptyState icon={Repeat} title="No topics in your revision queue" body="Add topics in the Revision Centre, or take a quiz to flag weak ones." action={<Button href="/revision">Open Revision Centre</Button>} /></div>}
        </div>
      </>
    );
  }
  if (finished) {
    return (
      <Card className="anim-fade-up mx-auto mt-10 max-w-lg p-8 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ok/15 text-ok"><CheckCircle2 className="h-8 w-8" /></div><h1 className="font-display text-2xl font-bold">Revision complete</h1><p className="mt-2 text-sm text-muted">{kb.title} marked as revised{quizScore !== undefined && ` (quick quiz ${quizScore}%)`}. Next revision on <b className="text-ink">{fmtDate(addDays(todayStr(), next), true)}</b>. Your history and learning memory were updated.</p><div className="mt-6 flex justify-center gap-2"><Button href="/revision">Back to centre</Button><Button variant="secondary" href="/dashboard">Dashboard</Button></div></Card>
    );
  }
  const finish = () => {
    if (!item) addRevision(kb.id, "due");
    setTimeout(() => {}, 0);
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    // ensure item exists before completing
    const id = item?.id;
    if (id) completeRevision(id, { minutes, score: quizScore, nextDays: next });
    else toast("Added to the queue — mark as revised again to log it.", "info");
    if (id) setFinished(true);
  };

  return (
    <>
      <PageHeader title={`Revising: ${kb.title}`} subtitle={`${subjectName(state, kb.subjectId)} · ${item ? `revised ${item.revisionCount}× before` : "not yet in your queue"}`} icon={Repeat} color="#fb923c" eyebrow="Agent 6 · Revision" actions={<Button variant="ghost" onClick={() => setTopicId("")}>Change topic</Button>} />
      <SectionTabs items={REVISION_TABS} />
      <Card className="mb-5 p-4"><div className="mb-2 flex justify-between text-xs font-semibold text-muted"><span>Revision completion</span><span>{pct}%</span></div><Progress value={pct} color="#fb923c" label="Revision completion" /></Card>
      <Tabs<Sec> value={sec} onChange={go} tabs={[{ id: "summary", label: "Summary" }, { id: "concepts", label: "Key concepts" }, { id: "cards", label: "Flashcards", count: cards.length }, { id: "practice", label: "Practice" }, { id: "quiz", label: "Quick quiz" }, { id: "finish", label: "Finish" }]} />
      <div className="mt-5">
        {sec === "summary" && <Card className="p-6"><Badge tone="warn">Topic summary</Badge><div className="mt-3"><Markdown text={`> ${kb.direct}\n\n${kb.concept}\n\n**Example.** ${kb.example}`} /></div>{kb.formulas && <div className="mt-3 rounded-xl bg-surface2 p-3 text-sm"><p className="label">Formulas</p>{kb.formulas.map((f) => <p key={f} className="font-mono text-xs">{f}</p>)}</div>}<Button className="mt-5" onClick={() => go("concepts")}>Next: key concepts<ChevronRight className="h-4 w-4" /></Button></Card>}
        {sec === "concepts" && <Card className="p-6"><h2 className="mb-3 font-display text-base font-semibold">Important concepts</h2><div className="grid gap-3 md:grid-cols-2">{kb.definitions.map(([t, d]) => <div key={t} className="rounded-xl bg-surface2 p-4"><p className="font-semibold text-brand">{t}</p><p className="mt-1 text-sm text-muted">{d}</p></div>)}</div><ul className="mt-4 space-y-1.5 text-sm">{kb.takeaways.map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" />{t}</li>)}</ul><Button className="mt-5" onClick={() => go("cards")}>Next: flashcards<ChevronRight className="h-4 w-4" /></Button></Card>}
        {sec === "cards" && cards.length > 0 && (
          <Card className="p-6"><div className="mx-auto max-w-xl">
            <button onClick={() => setFlip((f) => !f)} aria-label="Flip flashcard" className="group relative flex min-h-56 w-full items-center justify-center rounded-3xl border border-line bg-gradient-to-br from-surface2 to-surface p-8 text-center transition hover:border-brand"><span className="absolute left-4 top-4 text-[11px] font-bold uppercase tracking-wider text-muted">{flip ? "Answer" : "Question"} · {card + 1}/{cards.length}</span><span className="absolute right-4 top-4 text-muted"><RotateCw className="h-4 w-4" /></span><span className={cn("font-display text-lg font-semibold", flip && "text-brand2")}>{flip ? cards[card].b : cards[card].f}</span></button>
            <div className="mt-4 flex items-center justify-between gap-2"><Button variant="secondary" size="sm" icon={ChevronLeft} disabled={card === 0} onClick={() => { setCard(card - 1); setFlip(false); }}>Prev</Button><div className="flex gap-2"><Button size="sm" variant="danger" icon={X} onClick={() => { setKnown({ ...known, [card]: false }); if (card < cards.length - 1) { setCard(card + 1); setFlip(false); } }}>Review again</Button><Button size="sm" variant="soft" icon={Check} onClick={() => { setKnown({ ...known, [card]: true }); if (card < cards.length - 1) { setCard(card + 1); setFlip(false); } }}>Got it</Button></div><Button variant="secondary" size="sm" disabled={card === cards.length - 1} onClick={() => { setCard(card + 1); setFlip(false); }}>Next<ChevronRight className="h-4 w-4" /></Button></div>
            <p className="mt-3 text-center text-xs text-muted">{Object.values(known).filter(Boolean).length} known · {Object.values(known).filter((v) => !v).length} to review</p>
            <div className="mt-4 text-center"><Button onClick={() => go("practice")}>Next: practice questions</Button></div>
          </div></Card>
        )}
        {sec === "practice" && <Card className="p-6"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><Layers className="h-4 w-4 text-brand" />Practice questions (self-check)</h2><ol className="space-y-3">{kb.questions.map((q, i) => <li key={q.id} className="rounded-xl bg-surface2 p-4"><p className="text-sm font-medium">{i + 1}. {q.q}</p>{q.options && <p className="mt-1 text-xs text-muted">{q.options.join("  ·  ")}</p>}{reveal[q.id] ? <div className="mt-2 text-sm"><p className="text-ok">Answer: {q.answer.split("|")[0]}</p><p className="text-xs text-muted">{q.explanation}</p></div> : <Button size="sm" variant="secondary" className="mt-2" onClick={() => setReveal({ ...reveal, [q.id]: true })}>Reveal answer</Button>}</li>)}</ol><Button className="mt-5" onClick={() => go("quiz")}>Next: quick quiz</Button></Card>}
        {sec === "quiz" && <Card className="p-6"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><ListChecks className="h-4 w-4 text-bad" />Quick quiz</h2><ol className="space-y-4">{quizQs.map((q, i) => { const ok = graded && gradeAnswer(q, qa[q.id] ?? ""); return <li key={q.id}><p className="mb-2 text-sm font-medium">{i + 1}. {q.q}</p>{q.options ? <div className="grid gap-2 sm:grid-cols-2">{q.options.map((o) => <button key={o} disabled={graded} onClick={() => setQa({ ...qa, [q.id]: o })} aria-pressed={qa[q.id] === o} className={cn("rounded-xl border px-3 py-2 text-left text-sm", qa[q.id] === o ? "border-brand bg-brand/15" : "border-line bg-surface2", graded && o === q.answer && "border-ok bg-ok/15")}>{o}</button>)}</div> : <input className="input" disabled={graded} value={qa[q.id] ?? ""} onChange={(e) => setQa({ ...qa, [q.id]: e.target.value })} placeholder="Your answer" />}{graded && <p className={cn("mt-1.5 text-xs", ok ? "text-ok" : "text-bad")}>{ok ? "Correct." : `Correct answer: ${q.answer.split("|")[0]}.`} {q.explanation}</p>}</li>; })}</ol>
          <div className="mt-5 flex items-center gap-3">{!graded ? <Button onClick={() => setGraded(true)}>Check answers</Button> : <><Badge tone={quizScore! >= 70 ? "ok" : "warn"}>Score {quizScore}%</Badge><Button onClick={() => go("finish")}>Continue to finish</Button></>}</div></Card>}
        {sec === "finish" && <Card className="p-6"><h2 className="mb-1 font-display text-base font-semibold">Finish this revision</h2><p className="mb-4 text-sm text-muted">Completed sections: {done}/5{quizScore !== undefined && ` · quick quiz ${quizScore}%`}. Choose when to revise this topic again.</p>
          <Field label="Schedule next revision"><div className="flex flex-wrap gap-2">{[1, 3, 7, 14].map((d) => <button key={d} aria-pressed={next === d} onClick={() => setNext(d)} className={cn("chip", next === d && "chip-on")}>In {d} day{d > 1 ? "s" : ""} · {fmtDate(addDays(todayStr(), d))}</button>)}</div></Field>
          {!item && <p className="mt-3 rounded-xl bg-warn/10 p-3 text-xs text-warn">This topic isn&apos;t in your queue yet. <button className="font-semibold underline" onClick={() => addRevision(kb.id, "due")}>Add it</button> to log this revision.</p>}
          <Button className="mt-5" icon={CheckCircle2} disabled={!item} onClick={finish}>Mark as revised</Button></Card>}
      </div>
    </>
  );
}
