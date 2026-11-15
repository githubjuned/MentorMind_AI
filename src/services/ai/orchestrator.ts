import type {
  AgentId, AppState, Difficulty, DoubtAnswer, NoteType, Payload, Question, Route, Task,
} from "@/types";
import { AGENT_SYSTEM_PROMPTS, buildAgentPrompt } from "./prompts";
import {
  answerQuestion, buildNotes, buildPlan, buildQuiz, recommendResources,
  routeRequest as demoRouteRequest, runCoordinator as demoRunCoordinator,
  type AgentResult, noteTypeLabel, cleanTopic,
} from "./demo";
import { todayStr, uid, minsLabel } from "@/utils";
import { overallProgress, quizAvg, streak, weeklyMinutes } from "@/utils/metrics";
import { getKB } from "@/data/knowledge";

export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

/**
 * Returns whether live AI credentials are configured in the current environment.
 */
export function isLiveAIConfigured(): boolean {
  if (typeof process !== "undefined" && process.env) {
    return Boolean(
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.OPENAI_API_KEY
    );
  }
  return false;
}

/**
 * Call Gemini REST API directly if key is present
 */
async function callGeminiGenerate(prompt: string, systemInstruction?: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const body: Record<string, unknown> = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn("Gemini API call failed with status", res.status);
      return null;
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof candidateText === "string" ? candidateText.trim() : null;
  } catch (err) {
    console.warn("Error calling Gemini API:", err);
    return null;
  }
}

/**
 * Clean markdown JSON code fence ```json ... ```
 */
function cleanJsonFence(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

/**
 * Central AI Coordinator Orchestration
 */
export async function orchestrateAIRequest(
  text: string,
  state: AppState,
  attachment?: string,
  customApiKey?: string
): Promise<AgentResult> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // 1. Determine student context
  const weakTopics = state.topics.filter((t) => t.status !== "not_started" && t.mastery < 60).map((t) => t.name);
  const strongTopics = state.topics.filter((t) => t.mastery >= 75).map((t) => t.name);
  const recentMistakes = state.mistakes.slice(0, 3).map((m) => m.question);

  const studentContext = {
    profileName: state.profile.name,
    department: state.profile.department,
    goals: state.profile.goals,
    styles: state.profile.styles,
    weakTopics,
    strongTopics,
    recentMistakes,
  };

  // 2. Perform intent routing
  let route: Route = demoRouteRequest(text, state);

  if (apiKey) {
    try {
      const coordinatorPrompt = `${buildAgentPrompt("coordinator", studentContext)}\n\nAnalyze this student request: "${text}"\nOutput valid JSON for the route.`;
      const llmResponse = await callGeminiGenerate(coordinatorPrompt);
      if (llmResponse) {
        const parsed = JSON.parse(cleanJsonFence(llmResponse));
        if (parsed.agent && parsed.intent) {
          route = {
            agent: parsed.agent as AgentId,
            intent: parsed.intent,
            confidence: Math.min(0.99, Math.max(0.6, Number(parsed.confidence) || 0.9)),
            reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : [parsed.intent],
            params: parsed.params || route.params,
          };
        }
      }
    } catch {
      // Fallback cleanly to heuristic route if LLM JSON parsing fails
    }
  }

  const p = route.params;
  const kb = p.topicId ? getKB(p.topicId) : undefined;
  const subjectId = p.subjectId ?? state.subjects[0]?.id ?? "";
  const base = { route, effects: [] as AgentResult["effects"], effectLabels: [] as string[] };

  // 3. Delegate to the specialized agent
  switch (route.agent) {
    case "quiz": {
      const difficulty = p.difficulty ?? "medium";
      const count = p.count ?? 5;

      if (apiKey) {
        try {
          const quizPrompt = `${buildAgentPrompt("quiz", studentContext)}\n\nCreate a ${count}-question quiz at ${difficulty} difficulty on topic: "${p.topicText || text}". Subject ID: "${subjectId}". Output valid JSON matching the schema.`;
          const raw = await callGeminiGenerate(quizPrompt);
          if (raw) {
            const parsed = JSON.parse(cleanJsonFence(raw));
            if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
              const questions: Question[] = parsed.questions.map((q: Question, idx: number) => ({
                id: q.id || uid(),
                topicId: p.topicId || `topic-${idx}`,
                subjectId,
                type: q.type || "mcq",
                q: q.q,
                options: q.options,
                answer: q.answer,
                explanation: q.explanation || "",
                difficulty,
              }));
              return {
                ...base,
                agent: "quiz",
                text: `I prepared a customized ${questions.length}-question ${difficulty} quiz on ${parsed.topic || p.topicText || "your topic"}.`,
                payload: {
                  kind: "quiz",
                  title: `${parsed.topic || p.topicText || "Topic"} Quiz`,
                  subjectId,
                  topic: parsed.topic || p.topicText || "Quiz",
                  difficulty,
                  questions,
                },
              };
            }
          }
        } catch (e) {
          console.warn("Quiz LLM generation fallback:", e);
        }
      }

      // Default / fallback builder
      const q = buildQuiz({ subjectId, topicId: p.topicId, topicText: p.topicId ? undefined : cleanTopic(text), difficulty, count, format: "mixed" });
      return {
        ...base,
        agent: "quiz",
        text: `I prepared a ${q.questions.length}-question ${difficulty} quiz on ${q.topicTitle}.${q.note ? " " + q.note : ""}`,
        payload: {
          kind: "quiz",
          title: `${q.topicTitle} quiz`,
          subjectId: q.subjectId,
          topic: q.topicTitle,
          difficulty,
          questions: q.questions,
        },
      };
    }

    case "notes": {
      const noteType: NoteType = p.noteType ?? "short";
      if (apiKey && !attachment) {
        try {
          const notesPrompt = `${buildAgentPrompt("notes", studentContext)}\n\nGenerate ${noteType} notes for the topic: "${p.topicText || text}". Use subject: "${subjectId}". Format in clear markdown.`;
          const raw = await callGeminiGenerate(notesPrompt);
          if (raw && raw.length > 50) {
            return {
              ...base,
              agent: "notes",
              text: `Here are your ${noteTypeLabel(noteType).toLowerCase()} for ${p.topicText || "the topic"}.`,
              payload: {
                kind: "notes",
                title: `${p.topicText || "Study"} — ${noteTypeLabel(noteType)}`,
                markdown: raw,
                subjectId,
                noteType,
              },
            };
          }
        } catch (e) {
          console.warn("Notes LLM generation fallback:", e);
        }
      }

      const n = buildNotes({ topicId: p.topicId, topicText: cleanTopic(text), subjectId, type: noteType });
      const note = attachment ? ` Attachment "${attachment}" was processed for this note.` : "";
      return {
        ...base,
        agent: "notes",
        text: `Here are your ${noteTypeLabel(noteType).toLowerCase()}.${note}`,
        payload: { kind: "notes", title: n.title, markdown: n.markdown, subjectId: n.subjectId, noteType },
      };
    }

    case "doubt": {
      if (apiKey) {
        try {
          const doubtPrompt = `${buildAgentPrompt("doubt", studentContext)}\n\nAnswer this student question: "${text}"\nOutput valid JSON matching DoubtAnswer schema.`;
          const raw = await callGeminiGenerate(doubtPrompt);
          if (raw) {
            const parsed = JSON.parse(cleanJsonFence(raw));
            if (parsed.topicTitle && parsed.direct) {
              const ans: DoubtAnswer = {
                topicTitle: parsed.topicTitle,
                subjectId,
                direct: parsed.direct,
                concept: parsed.concept || "",
                steps: Array.isArray(parsed.steps) ? parsed.steps : [],
                example: parsed.example || "",
                takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways : [],
                related: Array.isArray(parsed.related) ? parsed.related : [],
                followups: Array.isArray(parsed.followups) ? parsed.followups : [],
                generic: false,
                format: "detailed",
                topicId: p.topicId,
              };
              return {
                ...base,
                agent: "doubt",
                text: `Here's an explanation of ${ans.topicTitle}.`,
                payload: { kind: "answer", answer: ans },
              };
            }
          }
        } catch (e) {
          console.warn("Doubt LLM generation fallback:", e);
        }
      }

      const ans = answerQuestion(text, { subjectId: p.subjectId, topicId: p.topicId });
      return {
        ...base,
        agent: "doubt",
        text: ans.generic
          ? `I couldn't match that directly to the offline knowledge base, so here is a structured scaffold.`
          : `Here's an explanation of ${ans.topicTitle}.`,
        payload: { kind: "answer", answer: ans },
      };
    }

    case "planner": {
      const upcoming = state.exams.filter((e) => e.date >= todayStr()).sort((a, b) => a.date.localeCompare(b.date));
      const exam = upcoming.find((e) => e.subjectId === p.subjectId) ?? upcoming[0];
      const sid = exam?.subjectId ?? subjectId;
      const topics = state.topics.filter((t) => t.subjectId === sid).map((t) => t.name);
      const subj = state.subjects.find((s) => s.id === sid);
      const tasks = buildPlan({
        entries: [{ subjectId: sid, topics: topics.length ? topics : ["Core concepts"], difficulty: "medium" }],
        examDate: exam?.date ?? todayStr(),
        hoursPerDay: p.hours ?? 2,
        start: todayStr(),
        availability: state.profile.availability,
        maxDays: 7,
      });

      return {
        ...base,
        agent: "planner",
        text: `I drafted a ${p.hours ?? 2}-hour-a-day study plan for ${subj?.name ?? "your subject"}${exam ? ` ahead of your exam on ${exam.date}` : ""}. Confirm to save it to your planner.`,
        payload: { kind: "plan", title: `${subj?.name ?? "Study"} plan`, tasks },
      };
    }

    case "progress": {
      const week = weeklyMinutes(state.sessions).reduce((a, b) => a + b.minutes, 0);
      const weakest = [...state.topics].filter((t) => t.status !== "not_started").sort((a, b) => a.mastery - b.mastery)[0];
      const strongest = [...state.topics].sort((a, b) => b.mastery - a.mastery)[0];

      return {
        ...base,
        agent: "progress",
        text: "Here is your progress summary, calculated from your recorded sessions and quizzes.",
        payload: {
          kind: "progress",
          summary: state.sessions.length ? "Based on your logged learning telemetry." : "No study sessions recorded yet.",
          lines: [
            { label: "Study time this week", value: minsLabel(week), tone: week > 300 ? "ok" : "warn" },
            { label: "Current streak", value: `${streak(state.sessions)} days`, tone: "ok" },
            { label: "Quiz accuracy (last 5)", value: state.attempts.length ? `${quizAvg(state.attempts)}%` : "No quizzes yet", tone: quizAvg(state.attempts) >= 70 ? "ok" : "warn" },
            { label: "Overall mastery", value: `${overallProgress(state.topics)}%`, tone: "muted" },
            ...(weakest ? [{ label: "Needs attention", value: `${weakest.name} (${weakest.mastery}%)`, tone: "bad" as const }] : []),
            ...(strongest ? [{ label: "Strongest topic", value: `${strongest.name} (${strongest.mastery}%)`, tone: "ok" as const }] : []),
          ],
        },
      };
    }

    case "resources": {
      const items = recommendResources(state, { topicId: p.topicId, subjectId: p.subjectId, limit: 4 });
      return {
        ...base,
        agent: "resources",
        text: `I selected ${items.length} verified learning resources based on your subjects, weak areas, and goals.`,
        payload: { kind: "resources", items },
      };
    }

    case "revision": {
      if (!kb) {
        const due = state.revisions.filter((r) => r.dueDate <= todayStr()).slice(0, 4);
        return {
          ...base,
          agent: "revision",
          text: due.length
            ? `You have ${due.length} topic(s) due for revision: ${due.map((d) => d.topic).join(", ")}.`
            : "Nothing is currently due for revision. Tell me which topic is giving you trouble and I'll construct a targeted remediation session.",
          payload: {
            kind: "revision",
            intro: due.length ? "Open the Revision Centre to start." : "Try: “I keep getting database normalization questions wrong”.",
            practice: [],
          },
        };
      }

      const m = state.mistakes.filter((x) => x.topicId === kb.id);
      const mistakeCount = m.reduce((a, b) => a + b.count, 0);
      const ans = answerQuestion(text, { topicId: kb.id, format: "simple" });
      const practice = buildQuiz({ topicId: kb.id, difficulty: "easy", count: 3, format: "mixed" }).questions;
      const intro = mistakeCount
        ? `Your records show ${mistakeCount} previous mistake(s) on ${kb.title}. Here's a targeted explanation and active practice.`
        : `I have no quiz mistakes recorded for ${kb.title}. Here's a concise refresher and practice questions.`;

      return {
        ...base,
        agent: "revision",
        text: intro,
        payload: { kind: "revision", intro, answer: ans, practice, topicId: kb.id },
        effects: [{ type: "addRevision", topicId: kb.id, reason: "weak" }],
        effectLabels: [
          `Added “${kb.title}” to your revision queue (due today)`,
          "Recorded in Learning Memory as a self-reported difficulty",
        ],
      };
    }

    default: {
      const ans = answerQuestion(text, { subjectId: p.subjectId });
      return {
        ...base,
        agent: "doubt",
        text: ans.generic
          ? `I couldn't match that to an offline topic, so here is a general study scaffold.`
          : `Here's an explanation of ${ans.topicTitle}.`,
        payload: { kind: "answer", answer: ans },
      };
    }
  }
}
