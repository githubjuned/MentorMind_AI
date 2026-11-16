import type { ActivityItem, AppState, Goal, Material, MemoryEvent, Mistake, Notif, Profile, QuizAttempt, RevisionItem, RevisionRecord, StudySession, Task, Topic } from "@/types";
import { KB } from "@/data/knowledge";
import { addDays, todayStr, uid } from "@/utils";

export const DEMO_EMAIL = "";
export const DEMO_PASSWORD = "";
export const STORAGE_KEY = "mentormind-production-v2";

export const LEARNING_STYLES = [
  "Conceptual explanations",
  "Practical examples",
  "Visual learning",
  "Step-by-step explanations",
  "Practice-based learning",
  "Short notes",
  "Detailed notes",
];
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const SUBJECT_COLORS = ["#22d3ee", "#fb923c", "#a78bfa", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a3e635"];

export const defaultProfile = (initialName = "Student", initialEmail = ""): Profile => ({
  name: initialName,
  email: initialEmail,
  department: "",
  year: "",
  institution: "",
  goals: "",
  phone: "",
  dailyMinutes: 60,
  styles: ["Practical examples", "Step-by-step explanations"],
  availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
  avatarColor: "#8b7bff",
});

export function createSeed(customName = "Student", customEmail = ""): AppState {
  const today = todayStr();

  const subjects = [
    { id: "python", name: "Python Programming", color: "#22d3ee", targetHours: 5 },
    { id: "dbms", name: "Database Management Systems", color: "#fb923c", targetHours: 5 },
    { id: "math", name: "Mathematics", color: "#a78bfa", targetHours: 4 },
    { id: "ds", name: "Data Structures", color: "#34d399", targetHours: 5 },
    { id: "ai", name: "Artificial Intelligence", color: "#f472b6", targetHours: 4 },
  ];

  // Topics start completely clean: 0% mastery, not_started
  const topics: Topic[] = KB.map((k) => ({
    id: k.id,
    subjectId: k.subjectId,
    name: k.title,
    status: "not_started" as const,
    mastery: 0,
    difficulty: "medium" as const,
    lastStudied: undefined,
  }));

  return {
    version: 1,
    session: null,
    onboarded: true,
    isSample: false,
    tourCompleted: false,
    profile: defaultProfile(customName, customEmail),
    settings: {
      theme: "dark",
      reduceMotion: false,
      sidebarCollapsed: false,
      notifPrefs: { reminders: true, revision: true, tasks: true, recommendations: true, quiz: true, goals: true },
      privacy: { useMemory: true, shareAggregate: true, educatorView: false },
    },
    subjects,
    topics,
    tasks: [],
    exams: [],
    sessions: [],
    attempts: [],
    activeQuiz: null,
    notes: [],
    materials: [],
    goals: [],
    notifications: [],
    revisions: [],
    revisionHistory: [],
    mistakes: [],
    memory: [],
    activity: [],
    savedResources: [],
    conversations: [
      {
        id: uid(),
        title: "Coordinator Welcome",
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: uid(),
            role: "agent",
            agent: "coordinator",
            time: new Date().toISOString(),
            text: "Hello! I am your MentorMind AI Coordinator. I coordinate with our specialized AI agents: Doubt Solver, Smart Notes, Quiz Generator, Study Planner, Progress Tracker, and Revision Assistant. Ask me anything to get started!",
            payload: { kind: "text", text: "" },
          },
        ],
      },
    ],
  };
}

export function clearedLearning(s: AppState): AppState {
  const today = todayStr();
  return {
    ...s,
    isSample: false,
    topics: s.topics.map((t) => ({ ...t, status: "not_started", mastery: 0, lastStudied: undefined })),
    sessions: [],
    attempts: [],
    mistakes: [],
    revisions: [],
    revisionHistory: [],
    activity: [],
    activeQuiz: null,
    tasks: [],
    exams: [],
    goals: s.goals.map((g) => ({ ...g, progress: 0, done: false })),
    notifications: [],
    memory: [
      {
        id: uid(),
        date: today,
        kind: "stored",
        title: "Learning telemetry reset",
        detail: "All recorded learning sessions, quizzes and mistakes were reset. Your preferences and saved notes were preserved.",
      },
    ],
  };
}
