export type AgentId =
  | "coordinator" | "doubt" | "notes" | "quiz" | "planner" | "progress" | "revision" | "resources";
export type Difficulty = "easy" | "medium" | "hard";
export type QType = "mcq" | "tf" | "fill" | "short";
export type NoteType = "short" | "detailed" | "bullets" | "exam" | "revision" | "chapter";
export type TaskKind = "study" | "revision" | "break" | "reminder" | "quiz";

export interface Question {
  id: string;
  topicId: string;
  subjectId: string;
  type: QType;
  q: string;
  options?: string[];
  answer: string;
  keywords?: string[];
  explanation: string;
  difficulty: Difficulty;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  targetHours: number;
  description?: string;
}
export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  status: "not_started" | "learning" | "completed";
  mastery: number;
  difficulty: Difficulty;
  lastStudied?: string;
}
export interface Task {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  start: string;
  minutes: number;
  kind: TaskKind;
  done: boolean;
  priority: "low" | "medium" | "high";
  note?: string;
}
export interface Exam { id: string; subjectId: string; title: string; date: string }
export interface StudySession {
  id: string;
  date: string;
  hour: number;
  subjectId: string;
  topic: string;
  minutes: number;
  kind: "study" | "revision" | "quiz" | "notes" | "doubt";
}
export interface QuizAttempt {
  id: string;
  subjectId: string;
  topic: string;
  difficulty: Difficulty;
  date: string;
  questions: Question[];
  answers: Record<string, string>;
  results: Record<string, boolean>;
  score: number;
  total: number;
  accuracy: number;
  seconds: number;
  sample?: boolean;
}
export interface ActiveQuiz {
  id: string;
  subjectId: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  timeLimit: number | null;
  createdAt: string;
}
export interface Note {
  id: string;
  title: string;
  subjectId: string;
  type: NoteType;
  content: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  sample?: boolean;
}
export interface Bookmark { id: string; text: string }
export interface Material {
  id: string;
  name: string;
  kind: "pdf" | "docx" | "txt";
  sizeKB: number;
  subjectId: string;
  uploadedAt: string;
  lastUsedAt: string;
  content: string;
  extracted: boolean;
  bookmarks: Bookmark[];
  sample?: boolean;
}
export interface Goal {
  id: string;
  title: string;
  kind: "academic" | "daily" | "weekly" | "exam";
  target: number;
  progress: number;
  unit: string;
  due?: string;
  done: boolean;
}
export interface Notif {
  id: string;
  kind: "reminder" | "revision" | "task" | "recommendation" | "quiz" | "goal";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}
export interface RevisionItem {
  id: string;
  subjectId: string;
  topicId: string;
  topic: string;
  dueDate: string;
  reason: "weak" | "due" | "exam" | "mistake";
  intervalDays: number;
  revisionCount: number;
  lastRevised?: string;
}
export interface RevisionRecord {
  id: string; subjectId: string; topic: string; date: string; minutes: number; score?: number;
}
export interface Mistake {
  id: string;
  questionId: string;
  subjectId: string;
  topicId: string;
  question: string;
  correct: string;
  given: string;
  count: number;
  lastSeen: string;
}
export interface MemoryEvent {
  id: string;
  date: string;
  kind: "stored" | "inferred" | "edited";
  title: string;
  detail: string;
}
export interface ActivityItem {
  id: string;
  kind: "session" | "quiz" | "notes" | "topic" | "revision" | "doubt" | "plan";
  title: string;
  detail?: string;
  time: string;
  href?: string;
}

export interface DoubtAnswer {
  topicTitle: string;
  subjectId: string;
  direct: string;
  concept: string;
  steps: string[];
  example: string;
  takeaways: string[];
  related: string[];
  followups: string[];
  generic: boolean;
  format: DoubtFormat;
  topicId?: string;
}
export type DoubtFormat = "simple" | "detailed" | "steps" | "examples" | "visual";

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  topicIds: string[];
  difficulty: Difficulty;
  type: "video" | "article" | "documentation" | "tutorial" | "practice" | "reference";
  minutes: number;
  provider: string;
  url?: string;
}

export type Effect = { type: "addRevision"; topicId: string; reason: RevisionItem["reason"] };
export type Payload =
  | { kind: "answer"; answer: DoubtAnswer }
  | { kind: "notes"; title: string; markdown: string; subjectId: string; noteType: NoteType }
  | { kind: "quiz"; title: string; subjectId: string; topic: string; difficulty: Difficulty; questions: Question[] }
  | { kind: "plan"; title: string; tasks: Task[] }
  | { kind: "revision"; intro: string; answer?: DoubtAnswer; practice: Question[]; topicId?: string }
  | { kind: "progress"; summary: string; lines: { label: string; value: string; tone: "ok" | "warn" | "bad" | "muted" }[] }
  | { kind: "resources"; items: ResourceItem[] }
  | { kind: "text"; text: string };

export interface Route {
  agent: AgentId;
  intent: string;
  confidence: number;
  reasoning: string[];
  params: {
    topicId?: string; subjectId?: string; count?: number; difficulty?: Difficulty;
    topicText?: string; noteType?: NoteType; hours?: number;
  };
}
export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  time: string;
  agent?: AgentId;
  payload?: Payload;
  route?: Route;
  effects?: string[];
  feedback?: "up" | "down";
  attachment?: string;
}
export interface Conversation { id: string; title: string; messages: ChatMessage[]; updatedAt: string }

export interface Profile {
  name: string;
  email: string;
  department: string;
  year: string;
  institution: string;
  goals: string;
  phone: string;
  dailyMinutes: number;
  styles: string[];
  availability: Record<string, boolean>;
  avatarColor: string;
  avatarImage?: string;
}
export interface Settings {
  theme: "dark" | "light" | "system";
  reduceMotion: boolean;
  sidebarCollapsed: boolean;
  notifPrefs: { reminders: boolean; revision: boolean; tasks: boolean; recommendations: boolean; quiz: boolean; goals: boolean };
  privacy: { useMemory: boolean; shareAggregate: boolean; educatorView: boolean };
}

export interface AppState {
  version: number;
  session: { email: string; uid?: string; photoURL?: string } | null;
  onboarded: boolean;
  isSample: boolean;
  profile: Profile;
  settings: Settings;
  subjects: Subject[];
  topics: Topic[];
  tasks: Task[];
  exams: Exam[];
  sessions: StudySession[];
  attempts: QuizAttempt[];
  activeQuiz: ActiveQuiz | null;
  notes: Note[];
  materials: Material[];
  goals: Goal[];
  notifications: Notif[];
  revisions: RevisionItem[];
  revisionHistory: RevisionRecord[];
  mistakes: Mistake[];
  memory: MemoryEvent[];
  conversations: Conversation[];
  activity: ActivityItem[];
  savedResources: string[];
}
