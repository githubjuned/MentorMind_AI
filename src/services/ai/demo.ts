import type {
  AgentId, AppState, DoubtAnswer, DoubtFormat, Difficulty, Effect, NoteType, Payload, Question, ResourceItem, Route, Task,
} from "@/types";
import { KB, findTopic, getKB, type KBTopic } from "@/data/knowledge";
import { RESOURCES } from "@/data/resources";
import { addDays, addMinutes, daysBetween, minsLabel, parseDate, todayStr, uid } from "@/utils";
import { overallProgress, quizAvg, streak, totalMinutes, weeklyMinutes } from "@/utils/metrics";

export const DEMO_NOTICE =
  "Demo routing service: rule-based agents with a small built-in knowledge base. No live AI model is connected, and no independent agents are running.";

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
export const cleanTopic = (text: string) =>
  text.replace(/^(please\s+)?(explain|what is|what are|why|how does|how do|define|tell me about|describe|make|create|generate|give me)\s+/i, "").replace(/[?.!]+$/, "").trim() || "this topic";
export const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------------------------------------------------------------- Doubt solver */
export function answerQuestion(text: string, opts: { subjectId?: string; topicId?: string; format?: DoubtFormat } = {}): DoubtAnswer {
  const format = opts.format ?? "detailed";
  const kb = opts.topicId ? getKB(opts.topicId) : findTopic(text, opts.subjectId);
  if (kb) {
    return {
      topicTitle: kb.title, subjectId: kb.subjectId, direct: kb.direct, concept: kb.concept, steps: kb.steps, example: kb.example,
      takeaways: kb.takeaways, related: kb.related, followups: kb.followups, generic: false, format, topicId: kb.id,
    };
  }
  const t = titleCase(cleanTopic(text));
  return {
    topicTitle: t, subjectId: opts.subjectId ?? "", format, generic: true,
    direct: `“${t}” is outside the demo knowledge base, so this is a generic study scaffold rather than a factual answer. Connect a real AI backend to get a full explanation.`,
    concept: `To understand ${t}, start from its definition, learn the vocabulary it relies on, and then connect it to something you already know.`,
    steps: [`Write a one-line definition of ${t} in your own words.`, "List the 3–5 key terms or components involved.", "Find one worked example and trace it step by step.", "Try a similar problem without looking at the solution.", "Explain it aloud as if teaching a friend."],
    example: `Pick a small, concrete case of ${t} from your textbook or lecture and walk through it end to end.`,
    takeaways: ["Define before you memorise.", "Use examples to test understanding.", "Teach it back to confirm you know it."],
    related: KB.slice(0, 3).map((k) => k.title),
    followups: [`Can you give an example of ${t}?`, `What are common mistakes in ${t}?`, `How is ${t} tested in exams?`],
  };
}

/* ---------------------------------------------------------------- Notes */
export function summarizeText(text: string) {
  const sentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 25);
  const ranked = sentences.map((s, i) => ({ s, i, w: s.length })).sort((a, b) => b.w - a.w).slice(0, 6).sort((a, b) => a.i - b.i);
  const freq = new Map<string, number>();
  (text.match(/\b[A-Z][a-zA-Z]{3,}\b/g) ?? []).forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
  const terms = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map((e) => e[0]);
  return { summary: sentences.slice(0, 2).join(" ") || text.slice(0, 200), points: ranked.map((r) => r.s), terms };
}
const bullets = (a: string[]) => a.map((x) => `- ${x}`).join("\n");

function notesFromKB(kb: KBTopic, type: NoteType) {
  const defs = kb.definitions.map(([t, d]) => `- **${t}**: ${d}`).join("\n");
  const formulas = kb.formulas?.length ? `\n## Important formulas\n${bullets(kb.formulas.map((f) => `\`${f}\``))}\n` : "";
  switch (type) {
    case "short":
      return `# ${kb.title} — Short notes\n\n> ${kb.direct}\n\n## Key points\n${bullets(kb.takeaways)}\n\n## Definitions\n${defs}\n${formulas}\n## Summary\n${kb.concept.split(". ")[0]}.`;
    case "bullets":
      return `# ${kb.title} — Bullet notes\n\n## Essentials\n${bullets([kb.direct, ...kb.takeaways])}\n\n## Process\n${bullets(kb.steps)}\n\n## Terms\n${defs}\n${formulas}`;
    case "exam":
      return `# ${kb.title} — Exam preparation\n\n## Must-know definition\n> ${kb.direct}\n\n## Definitions to memorise\n${defs}\n${formulas}\n## Likely exam questions\n${kb.questions.map((q, i) => `${i + 1}. ${q.q.replace(/\*/g, "")}`).join("\n")}\n\n## Model answers\n${bullets(kb.questions.filter((q) => q.type === "short").map((q) => q.answer))}\n\n## Common mistakes to avoid\n${bullets(kb.takeaways.slice(0, 3))}`;
    case "revision":
      return `# ${kb.title} — Revision sheet\n\n## One-minute recap\n${kb.direct}\n\n## Recall prompts\n${bullets(kb.definitions.map(([t]) => `Explain **${t}** without looking.`))}\n${bullets(kb.followups)}\n\n## Checklist\n${bullets(kb.takeaways.map((t) => `[ ] ${t}`))}\n${formulas}`;
    case "chapter":
      return `# ${kb.title} — Chapter summary\n\n${kb.direct}\n\n${kb.concept}\n\n**Worked example.** ${kb.example}\n\n**Remember:** ${kb.takeaways.join(" ")}`;
    default:
      return `# ${kb.title} — Detailed notes\n\n## Overview\n${kb.direct}\n\n## Core concept\n${kb.concept}\n\n## Important definitions\n${defs}\n\n## Step by step\n${kb.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n${formulas}\n## Worked example\n${kb.example}\n\n## Key points\n${bullets(kb.takeaways)}\n\n## Related topics\n${bullets(kb.related)}\n\n## Summary\n${kb.takeaways[0]} ${kb.takeaways[1] ?? ""}`;
  }
}

export function buildNotes(o: { topicId?: string; topicText?: string; subjectId: string; type: NoteType; sourceText?: string; sourceName?: string }) {
  if (o.sourceText && o.sourceText.trim().length > 60) {
    const s = summarizeText(o.sourceText);
    const title = o.sourceName ? o.sourceName.replace(/\.[a-z0-9]+$/i, "") : "Pasted text";
    const md = o.type === "short" || o.type === "chapter"
      ? `# ${title} — ${o.type === "short" ? "Short notes" : "Chapter summary"}\n\n> ${s.summary}\n\n## Key points\n${bullets(s.points.slice(0, 4))}\n\n## Key terms\n${bullets(s.terms)}`
      : `# ${title} — ${o.type === "exam" ? "Exam preparation notes" : o.type === "revision" ? "Revision notes" : o.type === "bullets" ? "Bullet notes" : "Detailed notes"}\n\n## Summary\n${s.summary}\n\n## Key points\n${bullets(s.points)}\n\n## Important concepts\n${bullets(s.terms)}\n\n## Review questions\n${s.points.slice(0, 3).map((p, i) => `${i + 1}. Explain: “${p.slice(0, 70)}…”`).join("\n")}\n\n_Generated heuristically from your text by the demo notes agent (sentence ranking, not a language model)._`;
    return { title: `${title} notes`, markdown: md, subjectId: o.subjectId };
  }
  const kb = o.topicId ? getKB(o.topicId) : o.topicText ? findTopic(o.topicText, o.subjectId) : undefined;
  if (kb) return { title: `${kb.title} — ${noteTypeLabel(o.type)}`, markdown: notesFromKB(kb, o.type), subjectId: kb.subjectId };
  const t = titleCase(cleanTopic(o.topicText || "Untitled topic"));
  return {
    title: `${t} — ${noteTypeLabel(o.type)}`, subjectId: o.subjectId,
    markdown: `# ${t} — ${noteTypeLabel(o.type)}\n\n> This topic is not in the demo knowledge base, so this is an editable outline to fill in. A connected AI backend would write the content.\n\n## Definition\n- Write a one-line definition of ${t}.\n\n## Key concepts\n- Concept 1\n- Concept 2\n- Concept 3\n\n## Example\n- Add a worked example.\n\n## Summary\n- Summarise in two sentences.`,
  };
}
export const NOTE_TYPES: { value: NoteType; label: string; hint: string }[] = [
  { value: "short", label: "Short notes", hint: "Definition, key points and a summary" },
  { value: "detailed", label: "Detailed notes", hint: "Full explanation with steps and examples" },
  { value: "bullets", label: "Bullet-point notes", hint: "Scannable bullets only" },
  { value: "exam", label: "Exam preparation", hint: "Likely questions and model answers" },
  { value: "revision", label: "Revision notes", hint: "Recall prompts and a checklist" },
  { value: "chapter", label: "Chapter summary", hint: "Narrative summary of the chapter" },
];
export const noteTypeLabel = (t: NoteType) => NOTE_TYPES.find((n) => n.value === t)?.label ?? t;

/* ---------------------------------------------------------------- Quiz */
export type QuizFormat = "mcq" | "tf" | "fill" | "short" | "mixed";
export function buildQuiz(o: { subjectId?: string; topicId?: string; topicText?: string; difficulty: Difficulty; count: number; format: QuizFormat }) {
  const kb = o.topicId ? getKB(o.topicId) : o.topicText ? findTopic(o.topicText, o.subjectId) : undefined;
  const subjectId = kb?.subjectId ?? o.subjectId;
  const fmt = (q: Question) => o.format === "mixed" || q.type === o.format;
  const rank = (qs: Question[]) => shuffle(qs).sort((a, b) => Number(b.difficulty === o.difficulty) - Number(a.difficulty === o.difficulty));
  const all = KB.flatMap((t) => t.questions).filter(fmt);
  const tier1 = kb ? rank(all.filter((q) => q.topicId === kb.id)) : [];
  const tier2 = rank(all.filter((q) => q.subjectId === subjectId && !tier1.includes(q)));
  const tier3 = shuffle(all.filter((q) => !tier1.includes(q) && !tier2.includes(q)));
  const picked = [...tier1, ...tier2, ...(kb || subjectId ? [] : tier3)];
  const final = (picked.length >= o.count ? picked : [...picked, ...tier3]).slice(0, o.count);
  const matched = kb ? tier1.length : tier1.length + tier2.length;
  return {
    questions: final.map((q) => ({ ...q, options: q.options && q.type === "mcq" ? shuffle(q.options) : q.options })),
    topicTitle: kb?.title ?? (o.topicText?.trim() ? titleCase(o.topicText.trim()) : "Mixed review"),
    subjectId: subjectId ?? final[0]?.subjectId ?? "",
    matched,
    note: !kb && o.topicText?.trim() ? "That topic isn't in the demo question bank, so questions come from the selected subject." : matched < o.count ? `The demo bank has ${matched} matching question${matched === 1 ? "" : "s"}; the rest were filled from related topics.` : "",
  };
}
export function gradeAnswer(q: Question, given: string): boolean {
  const g = given.trim().toLowerCase();
  if (!g) return false;
  if (q.type === "mcq" || q.type === "tf") return g === q.answer.toLowerCase();
  if (q.type === "fill") return q.answer.toLowerCase().split("|").some((a) => a.trim() === g || g.replace(/[.()]/g, "") === a.trim().replace(/[.()]/g, ""));
  const hits = (q.keywords ?? []).filter((k) => g.includes(k.toLowerCase())).length;
  return g.length > 15 && hits >= Math.min(2, q.keywords?.length ?? 1);
}
export function wrongAnswerFor(q: Question) {
  if (q.type === "mcq" || q.type === "tf") return (q.options ?? []).find((o) => o !== q.answer) ?? "";
  return q.type === "fill" ? "not sure" : "I don't remember";
}

/* ---------------------------------------------------------------- Planner */
export interface PlanEntry { subjectId: string; topics: string[]; difficulty: Difficulty }
export function buildPlan(o: { entries: PlanEntry[]; examDate: string; hoursPerDay: number; start: string; availability: Record<string, boolean>; maxDays?: number }): Task[] {
  const horizon = Math.max(1, Math.min(o.maxDays ?? 14, daysBetween(o.start, o.examDate)));
  const units: { subjectId: string; topic: string }[] = [];
  const weight = { easy: 1, medium: 2, hard: 3 };
  o.entries.forEach((e) => e.topics.forEach((t) => { for (let i = 0; i < weight[e.difficulty]; i++) units.push({ subjectId: e.subjectId, topic: t }); }));
  if (!units.length) return [];
  const tasks: Task[] = [];
  const slots = ["09:00", "11:00", "14:30", "17:00", "19:30"];
  const wk = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let cursor = 0;
  const sessions = Math.max(1, Math.round(o.hoursPerDay));
  for (let d = 0; d < horizon; d++) {
    const date = addDays(o.start, d);
    if (o.availability[wk[parseDate(date).getDay()]] === false) continue;
    const revisionPhase = d >= horizon - 2 && horizon > 3;
    for (let s = 0; s < Math.min(sessions, slots.length); s++) {
      const u = units[cursor % units.length];
      cursor++;
      tasks.push({ id: uid(), title: revisionPhase ? `Revise: ${u.topic}` : u.topic, subjectId: u.subjectId, date, start: slots[s], minutes: 50, kind: revisionPhase ? "revision" : "study", done: false, priority: revisionPhase ? "high" : "medium" });
      tasks.push({ id: uid(), title: "Short break", subjectId: u.subjectId, date, start: addMinutes(slots[s], 50), minutes: 10, kind: "break", done: false, priority: "low" });
    }
    if (d % 3 === 2) {
      const u = units[cursor % units.length];
      tasks.push({ id: uid(), title: `Practice quiz: ${u.topic}`, subjectId: u.subjectId, date, start: "20:30", minutes: 20, kind: "quiz", done: false, priority: "medium" });
    }
  }
  return tasks;
}

/* ---------------------------------------------------------------- Resources */
export function recommendResources(state: AppState, o: { subjectId?: string; topicId?: string; limit?: number } = {}): ResourceItem[] {
  const weak = new Set(state.topics.filter((t) => t.mastery < 60).map((t) => t.id));
  return RESOURCES.map((r) => {
    let s = 0;
    if (o.topicId && r.topicIds.includes(o.topicId)) s += 6;
    if (o.subjectId && r.subjectId === o.subjectId) s += 3;
    if (r.topicIds.some((t) => weak.has(t))) s += 2;
    if (state.subjects.some((x) => x.id === r.subjectId)) s += 1;
    if (r.url) s += 0.5;
    return { r, s };
  }).sort((a, b) => b.s - a.s).slice(0, o.limit ?? 4).map((x) => x.r);
}

/* ---------------------------------------------------------------- Coordinator */
export function routeRequest(text: string, state?: AppState): Route {
  const t = text.toLowerCase();
  const kb = findTopic(text);
  const params: Route["params"] = { topicId: kb?.id, subjectId: kb?.subjectId, topicText: kb?.title };
  if (!params.subjectId) {
    const subjectHints: [RegExp, string][] = [[/\b(dbms|database|sql)\b/, "dbms"], [/\bpython\b/, "python"], [/\b(math|maths|mathematics|calculus|algebra)\b/, "math"], [/\b(data structures?|dsa)\b/, "ds"], [/\b(ai|artificial intelligence|machine learning)\b/, "ai"]];
    params.subjectId = subjectHints.find(([r]) => r.test(t))?.[1];
  }
  const count = t.match(/(\d{1,2})[\s-]*(?:question|mcq|q\b|item)/);
  if (count) params.count = Math.min(20, Math.max(1, Number(count[1])));
  const diff = t.match(/\b(easy|medium|hard)\b/);
  if (diff) params.difficulty = diff[1] as Difficulty;
  const hours = t.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/);
  if (hours) params.hours = Number(hours[1]);
  if (/\bbullet/.test(t)) params.noteType = "bullets";
  else if (/\bexam\b/.test(t)) params.noteType = "exam";
  else if (/\brevision\b/.test(t)) params.noteType = "revision";
  else if (/\bchapter\b|\bsummar/.test(t)) params.noteType = "chapter";
  else if (/\bdetail/.test(t)) params.noteType = "detailed";
  else if (/\bshort\b/.test(t)) params.noteType = "short";

  let agent: AgentId = "doubt";
  let intent = "Concept explanation";
  let confidence = kb ? 0.86 : 0.64;
  const reasoning: string[] = [];
  if (/(keep (getting|forgetting|failing|making|messing)|always (get|forget)|struggl|i(?:'m| am) confused|can'?t (understand|remember)|cannot (understand|remember)|wrong again|getting .* wrong|mistakes? in)/.test(t)) {
    agent = "revision"; intent = "Repeated learning difficulty"; confidence = kb ? 0.92 : 0.7;
    reasoning.push("Language suggests a recurring difficulty, not a first-time question.");
  } else if (/\b(quiz|test me|mcq|multiple choice|practice questions?|questions on|assess me|quiz me)\b/.test(t)) {
    agent = "quiz"; intent = "Quiz generation";
  } else if (/\b(revise|revision|flashcards?|review (my|the))\b|what should i revise/.test(t)) {
    agent = "revision"; intent = "Revision request";
  } else if (/\b(notes?|summari[sz]e|summary|cheat ?sheet|outline)\b/.test(t)) {
    agent = "notes"; intent = "Notes generation";
  } else if (/\b(plan|schedule|timetable|reschedule|study plan)\b/.test(t)) {
    agent = "planner"; intent = "Study planning";
  } else if (/\b(resources?|videos?|tutorials?|recommend|articles?|books?|where can i learn|documentation|courses?)\b/.test(t)) {
    agent = "resources"; intent = "Resource discovery";
  } else if (/\b(progress|how am i doing|performance|streak|strengths?|analytics|study time|my stats|how many hours|weakest)\b/.test(t)) {
    agent = "progress"; intent = "Progress summary";
  }
  if (agent !== "doubt" && kb) confidence = 0.9;
  reasoning.unshift(`Detected intent: ${intent.toLowerCase()}.`);
  if (kb) reasoning.push(`Matched topic “${kb.title}”.`);
  else reasoning.push("No specific topic matched in the demo knowledge base.");
  if (params.count) reasoning.push(`Passing ${params.count} questions to the agent.`);
  if (params.difficulty) reasoning.push(`Difficulty set to ${params.difficulty}.`);
  if (state && agent === "revision" && kb) {
    const m = state.mistakes.filter((x) => x.topicId === kb.id);
    reasoning.push(m.length ? `Learning context: ${m.length} recorded mistake(s) on this topic.` : "Learning context: no recorded mistakes yet — using your own description.");
  }
  return { agent, intent, confidence: Math.min(0.97, confidence), reasoning, params };
}

export interface AgentResult { agent: AgentId; text: string; payload: Payload; route: Route; effects: Effect[]; effectLabels: string[] }

export async function runCoordinator(text: string, state: AppState, attachment?: string): Promise<AgentResult> {
  const route = routeRequest(text, state);
  const p = route.params;
  const kb = p.topicId ? getKB(p.topicId) : undefined;
  const subjectId = p.subjectId ?? state.subjects[0]?.id ?? "";
  const base = { route, effects: [] as Effect[], effectLabels: [] as string[] };
  switch (route.agent) {
    case "quiz": {
      const q = buildQuiz({ subjectId, topicId: p.topicId, topicText: p.topicId ? undefined : cleanTopic(text), difficulty: p.difficulty ?? "medium", count: p.count ?? 5, format: "mixed" });
      return { ...base, agent: "quiz", text: `I prepared a ${q.questions.length}-question ${p.difficulty ?? "medium"} quiz on ${q.topicTitle}.${q.note ? " " + q.note : ""}`, payload: { kind: "quiz", title: `${q.topicTitle} quiz`, subjectId: q.subjectId, topic: q.topicTitle, difficulty: p.difficulty ?? "medium", questions: q.questions } };
    }
    case "notes": {
      const noteType = p.noteType ?? "short";
      const n = buildNotes({ topicId: p.topicId, topicText: cleanTopic(text), subjectId, type: noteType });
      const note = attachment ? ` I can't read “${attachment}” in the demo (file text extraction needs a backend), so these notes come from the topic in your message.` : "";
      return { ...base, agent: "notes", text: `Here are your ${noteTypeLabel(noteType).toLowerCase()}.${note}`, payload: { kind: "notes", title: n.title, markdown: n.markdown, subjectId: n.subjectId, noteType } };
    }
    case "planner": {
      const upcoming = state.exams.filter((e) => e.date >= todayStr()).sort((a, b) => a.date.localeCompare(b.date));
      const exam = upcoming.find((e) => e.subjectId === p.subjectId) ?? upcoming[0];
      const sid = exam?.subjectId ?? subjectId;
      const topics = state.topics.filter((t) => t.subjectId === sid).map((t) => t.name);
      const subj = state.subjects.find((s) => s.id === sid);
      const tasks = buildPlan({ entries: [{ subjectId: sid, topics: topics.length ? topics : ["Core concepts"], difficulty: "medium" }], examDate: exam?.date ?? addDays(todayStr(), 10), hoursPerDay: p.hours ?? 2, start: addDays(todayStr(), 1), availability: state.profile.availability, maxDays: 7 });
      return { ...base, agent: "planner", text: `I drafted a ${p.hours ?? 2}-hour-a-day plan for ${subj?.name ?? "your subject"}${exam ? ` ahead of the exam on ${exam.date}` : ""}. Nothing is added to your planner until you confirm.`, payload: { kind: "plan", title: `${subj?.name ?? "Study"} plan`, tasks } };
    }
    case "progress": {
      const week = weeklyMinutes(state.sessions).reduce((a, b) => a + b.minutes, 0);
      const weakest = [...state.topics].filter((t) => t.status !== "not_started").sort((a, b) => a.mastery - b.mastery)[0];
      const strongest = [...state.topics].sort((a, b) => b.mastery - a.mastery)[0];
      return { ...base, agent: "progress", text: "Here is your progress summary, calculated from your recorded sessions and quizzes.", payload: { kind: "progress", summary: state.sessions.length ? "Based on your logged activity." : "No activity recorded yet, so there is little to report.", lines: [
        { label: "Study time this week", value: minsLabel(week), tone: week > 300 ? "ok" : "warn" },
        { label: "Current streak", value: `${streak(state.sessions)} days`, tone: "ok" },
        { label: "Quiz accuracy (last 5)", value: state.attempts.length ? `${quizAvg(state.attempts)}%` : "No quizzes yet", tone: quizAvg(state.attempts) >= 70 ? "ok" : "warn" },
        { label: "Overall mastery", value: `${overallProgress(state.topics)}%`, tone: "muted" },
        ...(weakest ? [{ label: "Needs attention", value: `${weakest.name} (${weakest.mastery}%)`, tone: "bad" as const }] : []),
        ...(strongest ? [{ label: "Strongest topic", value: `${strongest.name} (${strongest.mastery}%)`, tone: "ok" as const }] : []),
      ] } };
    }
    case "resources": {
      const items = recommendResources(state, { topicId: p.topicId, subjectId: p.subjectId, limit: 4 });
      return { ...base, agent: "resources", text: `I picked ${items.length} resources${kb ? ` for ${kb.title}` : " based on your weak topics and goals"}. Items marked sample have no external link.`, payload: { kind: "resources", items } };
    }
    case "revision": {
      if (!kb) {
        const due = state.revisions.filter((r) => r.dueDate <= todayStr()).slice(0, 4);
        return { ...base, agent: "revision", text: due.length ? `You have ${due.length} topic(s) due for revision: ${due.map((d) => d.topic).join(", ")}.` : "Nothing is due for revision right now. Tell me which topic is giving you trouble and I'll build a targeted session.", payload: { kind: "revision", intro: due.length ? "Open the Revision Centre to start." : "Try: “I keep getting database normalization questions wrong”.", practice: [] } };
      }
      const m = state.mistakes.filter((x) => x.topicId === kb.id);
      const mistakeCount = m.reduce((a, b) => a + b.count, 0);
      const ans = answerQuestion(text, { topicId: kb.id, format: "simple" });
      const practice = buildQuiz({ topicId: kb.id, difficulty: "easy", count: 3, format: "mixed" }).questions;
      const intro = mistakeCount
        ? `Your records show ${mistakeCount} mistake${mistakeCount > 1 ? "s" : ""} on ${kb.title}. Here's a simpler explanation and targeted practice.`
        : `I have no quiz mistakes recorded for ${kb.title}, so I'm going by what you told me. Here's a simpler explanation and targeted practice.`;
      return { ...base, agent: "revision", text: intro, payload: { kind: "revision", intro, answer: ans, practice, topicId: kb.id }, effects: [{ type: "addRevision", topicId: kb.id, reason: "weak" }], effectLabels: [`Added “${kb.title}” to your revision queue (due today)`, "Recorded in Learning Memory as a self-reported difficulty"] };
    }
    default: {
      const ans = answerQuestion(text, { subjectId: p.subjectId });
      return { ...base, agent: "doubt", text: ans.generic ? `I couldn't match that to a topic in the demo knowledge base, so here is a generic scaffold.` : `Here's an explanation of ${ans.topicTitle}.`, payload: { kind: "answer", answer: ans } };
    }
  }
}

export interface LearningAIProvider {
  route(text: string, state?: AppState): Route;
  run(text: string, state: AppState, attachment?: string): Promise<AgentResult>;
}
/** Swap this object for an HTTP-backed provider to integrate a real orchestration service. */
export const demoProvider: LearningAIProvider = { route: routeRequest, run: runCoordinator };
