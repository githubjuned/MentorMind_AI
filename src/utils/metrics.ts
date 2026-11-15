import type { AppState, QuizAttempt, StudySession, Subject, Topic } from "@/types";
import { addDays, fmtWeekday, todayStr } from "@/utils";

export interface SubjectStat {
  subject: Subject;
  progress: number;
  done: number;
  total: number;
  quizAcc: number | null;
  quizCount: number;
  minutes: number;
  weak: Topic[];
}

export const totalMinutes = (s: StudySession[]) => s.reduce((a, b) => a + b.minutes, 0);

export function streak(sessions: StudySession[]) {
  const days = new Set(sessions.map((s) => s.date));
  let d = todayStr();
  if (!days.has(d)) d = addDays(d, -1);
  let n = 0;
  while (days.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
export function minutesByDay(sessions: StudySession[], from: string, to: string) {
  const out: { date: string; minutes: number }[] = [];
  const map = new Map<string, number>();
  sessions.forEach((s) => map.set(s.date, (map.get(s.date) ?? 0) + s.minutes));
  for (let d = from; d <= to; d = addDays(d, 1)) out.push({ date: d, minutes: map.get(d) ?? 0 });
  return out;
}
export function weeklyMinutes(sessions: StudySession[]) {
  const t = todayStr();
  return minutesByDay(sessions, addDays(t, -6), t).map((d) => ({ ...d, label: fmtWeekday(d.date), hours: +(d.minutes / 60).toFixed(1) }));
}
export const overallProgress = (topics: Topic[]) =>
  topics.length ? Math.round(topics.reduce((a, t) => a + t.mastery, 0) / topics.length) : 0;
export const quizAvg = (attempts: QuizAttempt[], n = 5) => {
  const last = [...attempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
  return last.length ? Math.round(last.reduce((a, b) => a + b.accuracy, 0) / last.length) : 0;
};
export function subjectStats(state: Pick<AppState, "subjects" | "topics" | "attempts" | "sessions">): SubjectStat[] {
  return state.subjects.map((subject) => {
    const topics = state.topics.filter((t) => t.subjectId === subject.id);
    const att = state.attempts.filter((a) => a.subjectId === subject.id);
    return {
      subject,
      progress: overallProgress(topics),
      done: topics.filter((t) => t.status === "completed").length,
      total: topics.length,
      quizAcc: att.length ? Math.round(att.reduce((a, b) => a + b.accuracy, 0) / att.length) : null,
      quizCount: att.length,
      minutes: totalMinutes(state.sessions.filter((s) => s.subjectId === subject.id)),
      weak: topics.filter((t) => t.status !== "not_started" && t.mastery < 60),
    };
  });
}
/** Per-topic accuracy of every attempt that included that topic, oldest first. */
export function topicHistory(attempts: QuizAttempt[], topicId: string) {
  return [...attempts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((a) => {
      const qs = a.questions.filter((q) => q.topicId === topicId);
      if (!qs.length) return null;
      const right = qs.filter((q) => a.results[q.id]).length;
      return { date: a.date, accuracy: Math.round((right / qs.length) * 100), n: qs.length };
    })
    .filter((x): x is { date: string; accuracy: number; n: number } => !!x);
}
export function topicEvidence(state: AppState, t: Topic) {
  const h = topicHistory(state.attempts, t.id);
  const mistakes = state.mistakes.filter((m) => m.topicId === t.id).reduce((a, b) => a + b.count, 0);
  const parts = [`Mastery score ${t.mastery}%`];
  if (h.length) parts.push(`${h.length} quiz attempt${h.length > 1 ? "s" : ""}, latest ${h[h.length - 1].accuracy}%`);
  else parts.push("no quiz attempts yet");
  if (mistakes) parts.push(`${mistakes} recorded mistake${mistakes > 1 ? "s" : ""}`);
  return parts.join(" · ");
}
export function improvement(state: AppState, topicId: string) {
  const h = topicHistory(state.attempts, topicId);
  if (h.length < 2) return 0;
  return h[h.length - 1].accuracy - h[0].accuracy;
}
export function bestStudyHour(sessions: StudySession[]) {
  if (!sessions.length) return null;
  const buckets: Record<string, number> = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  sessions.forEach((s) => {
    const k = s.hour < 12 ? "Morning" : s.hour < 17 ? "Afternoon" : s.hour < 21 ? "Evening" : "Night";
    buckets[k] += s.minutes;
  });
  return Object.entries(buckets).sort((a, b) => b[1] - a[1])[0][0];
}
