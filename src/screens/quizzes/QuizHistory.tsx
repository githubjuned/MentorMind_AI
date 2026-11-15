"use client";
import { useMemo, useState } from "react";
import { Eye, History, Search } from "lucide-react";
import { Badge, Button, Card, EmptyState, Modal, PageHeader, Pagination, SectionTabs, Stat } from "@/components/common/ui";
import { QUIZ_TABS } from "@/components/navigation/sectionNav";
import { QuizReview } from "@/screens/quizzes/QuizAttempt";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import type { QuizAttempt } from "@/types";
import { fmtDate } from "@/utils";
import { Gauge, ListChecks, Trophy } from "lucide-react";

const PER = 6;
export default function QuizHistory() {
  const { state } = useApp();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [diff, setDiff] = useState("all");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [review, setReview] = useState<QuizAttempt | null>(null);

  const list = useMemo(() => state.attempts
    .filter((a) => (subject === "all" || a.subjectId === subject) && (diff === "all" || a.difficulty === diff) && (!q || a.topic.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => (sort === "high" ? b.accuracy - a.accuracy : sort === "low" ? a.accuracy - b.accuracy : sort === "old" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))), [state.attempts, q, subject, diff, sort]);
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const rows = list.slice((page - 1) * PER, page * PER);
  const avg = state.attempts.length ? Math.round(state.attempts.reduce((a, b) => a + b.accuracy, 0) / state.attempts.length) : 0;
  const best = state.attempts.reduce((m, a) => Math.max(m, a.accuracy), 0);
  const reset = (fn: () => void) => { fn(); setPage(1); };

  return (
    <>
      <PageHeader title="Quiz history" subtitle="Every quiz you've taken, with scores and full answer review." icon={History} color="#fb7185" eyebrow="Agent 3 · Quizzes" actions={<Button href="/quizzes">New quiz</Button>} />
      <SectionTabs items={QUIZ_TABS} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3"><Stat label="Quizzes taken" value={state.attempts.length} icon={ListChecks} color="#fb7185" /><Stat label="Average accuracy" value={state.attempts.length ? `${avg}%` : "—"} icon={Gauge} color="#38d6ff" /><Stat label="Best score" value={state.attempts.length ? `${best}%` : "—"} icon={Trophy} color="#fbbf24" /></div>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1"><Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" placeholder="Search by topic…" value={q} onChange={(e) => reset(() => setQ(e.target.value))} aria-label="Search quizzes" /></div>
        <select className="input w-auto" value={subject} onChange={(e) => reset(() => setSubject(e.target.value))} aria-label="Subject filter"><option value="all">All subjects</option>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select className="input w-auto" value={diff} onChange={(e) => reset(() => setDiff(e.target.value))} aria-label="Difficulty filter"><option value="all">All difficulties</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
        <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="new">Newest</option><option value="old">Oldest</option><option value="high">Highest score</option><option value="low">Lowest score</option></select>
      </div>
      {rows.length ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.6fr_1.2fr_.8fr_.7fr_.8fr_.8fr_auto] gap-3 border-b border-line px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted md:grid"><span>Topic</span><span>Subject</span><span>Date</span><span>Score</span><span>Accuracy</span><span>Difficulty</span><span /></div>
          <ul className="divide-y divide-line">
            {rows.map((a) => (
              <li key={a.id} className="grid items-center gap-2 px-5 py-4 md:grid-cols-[1.6fr_1.2fr_.8fr_.7fr_.8fr_.8fr_auto] md:gap-3">
                <span className="font-semibold">{a.topic}{a.sample && <span className="ml-2 text-[10px] font-normal text-muted">sample</span>}</span>
                <span><Badge color={subjectColor(state, a.subjectId)}>{subjectName(state, a.subjectId).split(" ")[0]}</Badge></span>
                <span className="text-sm text-muted">{fmtDate(a.date.slice(0, 10), true)}</span>
                <span className="text-sm">{a.score}/{a.total}</span>
                <span className={`text-sm font-bold ${a.accuracy >= 80 ? "text-ok" : a.accuracy >= 60 ? "text-brand2" : "text-bad"}`}>{a.accuracy}%</span>
                <span><Badge tone={a.difficulty === "easy" ? "ok" : a.difficulty === "medium" ? "warn" : "bad"}>{a.difficulty}</Badge></span>
                <Button size="sm" variant="secondary" icon={Eye} onClick={() => setReview(a)}>Review answers</Button>
              </li>
            ))}
          </ul>
        </Card>
      ) : <EmptyState icon={History} title={state.attempts.length ? "No quizzes match your filters" : "No quizzes yet"} body={state.attempts.length ? "Clear the search or filters to see more." : "Take your first quiz to start building history."} action={<Button href="/quizzes">Create a quiz</Button>} />}
      <Pagination page={page} pages={pages} onChange={setPage} />
      <Modal open={!!review} onClose={() => setReview(null)} title={review ? `${review.topic} — ${review.accuracy}%` : ""} size="lg" footer={<Button onClick={() => setReview(null)}>Close</Button>}>{review && <QuizReview attempt={review} />}</Modal>
    </>
  );
}
