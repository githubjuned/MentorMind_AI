import type { ActivityItem, AppState, Goal, Material, MemoryEvent, Mistake, Notif, Profile, QuizAttempt, RevisionItem, RevisionRecord, StudySession, Task, Topic } from "@/types";
import { KB, getKB } from "@/data/knowledge";
import { buildNotes, wrongAnswerFor } from "@/services/ai/demo";
import { addDays, isoDaysAgo, todayStr, uid } from "@/utils";

export const DEMO_EMAIL = "demo@mentormind.app";
export const DEMO_PASSWORD = "demo1234";
export const STORAGE_KEY = "mentormind-state-v1";

export const LEARNING_STYLES = ["Conceptual explanations", "Practical examples", "Visual learning", "Step-by-step explanations", "Practice-based learning", "Short notes", "Detailed notes"];
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const SUBJECT_COLORS = ["#22d3ee", "#fb923c", "#a78bfa", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a3e635"];

export const defaultProfile = (): Profile => ({
  name: "Alex Morgan", email: DEMO_EMAIL, department: "AI & DS", year: "Second Year", institution: "Northfield University (sample)",
  goals: "Build a strong foundation in data science, score above 80% in DBMS and Mathematics, and prepare for ML internships.",
  phone: "", dailyMinutes: 120, styles: ["Practical examples", "Step-by-step explanations", "Short notes"],
  availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false }, avatarColor: "#8b7bff",
});

const sample = (name: string, kind: Material["kind"], sizeKB: number, subjectId: string, daysAgo: number, used: number, paragraphs: string[]): Material => ({
  id: uid(), name, kind, sizeKB, subjectId, uploadedAt: isoDaysAgo(daysAgo), lastUsedAt: isoDaysAgo(used), content: paragraphs.join("\n\n"), extracted: false, bookmarks: [], sample: true,
});

export function createSeed(): AppState {
  let seedv = 42;
  const rnd = () => (seedv = (seedv * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const today = todayStr();

  const subjects = [
    { id: "python", name: "Python Programming", color: "#22d3ee", targetHours: 6 },
    { id: "dbms", name: "Database Management Systems", color: "#fb923c", targetHours: 7 },
    { id: "math", name: "Mathematics", color: "#a78bfa", targetHours: 5 },
    { id: "ds", name: "Data Structures", color: "#34d399", targetHours: 6 },
    { id: "ai", name: "Artificial Intelligence", color: "#f472b6", targetHours: 5 },
    { id: "sci", name: "General Science (Elective)", color: "#fbbf24", targetHours: 2 },
  ];
  const init: Record<string, [Topic["status"], number]> = {
    "py-loops": ["completed", 86], "py-functions": ["completed", 78], "py-collections": ["learning", 64],
    "dbms-normalization": ["learning", 46], "dbms-joins": ["learning", 71], "dbms-transactions": ["not_started", 0],
    "math-derivatives": ["learning", 56], "math-matrices": ["learning", 66], "math-probability": ["learning", 48],
    "ds-stacks-queues": ["completed", 84], "ds-trees": ["learning", 52], "ds-sorting": ["learning", 73],
    "ai-ml-basics": ["learning", 68], "ai-neural-networks": ["learning", 30], "ai-search": ["not_started", 0],
    "sci-photosynthesis": ["completed", 90],
  };
  const topics: Topic[] = KB.map((k) => ({
    id: k.id, subjectId: k.subjectId, name: k.title, status: init[k.id][0], mastery: init[k.id][1],
    difficulty: init[k.id][1] < 50 ? "hard" : init[k.id][1] < 75 ? "medium" : "easy", lastStudied: init[k.id][0] === "not_started" ? undefined : addDays(today, -Math.floor(rnd() * 10)),
  }));

  // Study sessions for the last 46 days
  const sessions: StudySession[] = [];
  const weights = ["python", "dbms", "dbms", "math", "ds", "ai", "python", "ds"];
  for (let i = 45; i >= 0; i--) {
    const active = i <= 5 ? true : i === 6 ? false : rnd() > 0.28;
    if (!active) continue;
    const n = i === 0 ? 1 : rnd() > 0.6 ? 2 : 1;
    for (let k = 0; k < n; k++) {
      const sid = weights[Math.floor(rnd() * weights.length)];
      const opts = KB.filter((t) => t.subjectId === sid);
      sessions.push({
        id: uid(), date: addDays(today, -i), hour: i === 0 ? 8 : [8, 10, 15, 19, 21][Math.floor(rnd() * 5)], subjectId: sid,
        topic: opts[Math.floor(rnd() * opts.length)].title, minutes: i === 0 ? 50 : 30 + Math.floor(rnd() * 7) * 10, kind: rnd() > 0.82 ? "revision" : "study",
      });
    }
  }

  // Quiz attempts built from the question bank so every review screen has real questions
  const specs: [string, number, "easy" | "medium" | "hard", number][] = [
    ["py-loops", 21, "easy", 4], ["py-functions", 17, "medium", 4], ["dbms-normalization", 14, "medium", 2], ["ds-stacks-queues", 11, "easy", 4],
    ["dbms-normalization", 7, "medium", 3], ["math-derivatives", 5, "medium", 3], ["ds-trees", 3, "hard", 2], ["dbms-joins", 2, "medium", 4], ["py-collections", 1, "easy", 3],
  ];
  const attempts: QuizAttempt[] = specs.map(([tid, ago, difficulty, correct]) => {
    const kb = getKB(tid)!;
    const answers: Record<string, string> = {};
    const results: Record<string, boolean> = {};
    kb.questions.forEach((q, i) => {
      const ok = i < correct;
      results[q.id] = ok;
      answers[q.id] = ok ? q.answer : wrongAnswerFor(q);
    });
    return {
      id: uid(), subjectId: kb.subjectId, topic: kb.title, difficulty, date: isoDaysAgo(ago, 17), questions: kb.questions, answers, results,
      score: correct, total: 5, accuracy: correct * 20, seconds: 150 + Math.floor(rnd() * 200), sample: true,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  const mmap = new Map<string, Mistake>();
  [...attempts].reverse().forEach((a) => a.questions.forEach((q) => {
    if (a.results[q.id]) return;
    const m = mmap.get(q.id);
    if (m) { m.count += 1; m.lastSeen = a.date.slice(0, 10); m.given = a.answers[q.id]; }
    else mmap.set(q.id, { id: uid(), questionId: q.id, subjectId: q.subjectId, topicId: q.topicId, question: q.q, correct: q.answer, given: a.answers[q.id], count: 1, lastSeen: a.date.slice(0, 10) });
  }));

  const t = (title: string, subjectId: string, date: string, start: string, minutes: number, kind: Task["kind"], done: boolean, priority: Task["priority"] = "medium"): Task => ({ id: uid(), title, subjectId, date, start, minutes, kind, done, priority });
  const tasks: Task[] = [
    t("Normalization: 2NF and 3NF", "dbms", today, "09:00", 50, "study", true, "high"),
    t("Short break", "dbms", today, "09:50", 10, "break", true, "low"),
    t("Revise: Binary tree traversals", "ds", today, "11:00", 40, "revision", false, "high"),
    t("Derivatives: chain rule practice", "math", today, "14:30", 60, "study", false),
    t("Python collections quick quiz", "python", today, "17:00", 20, "quiz", false),
    t("Neural networks: intro reading", "ai", today, "19:30", 45, "study", false, "low"),
    t("Submit DBMS assignment", "dbms", addDays(today, 3), "18:00", 15, "reminder", false, "high"),
    t("SQL joins practice set", "dbms", addDays(today, 1), "09:00", 50, "study", false, "high"),
    t("Probability: conditional probability", "math", addDays(today, 1), "15:00", 50, "study", false),
    t("Revise: Normalization", "dbms", addDays(today, 2), "10:00", 40, "revision", false, "high"),
    t("Sorting algorithms: merge sort", "ds", addDays(today, 2), "16:00", 50, "study", false),
    t("Transactions and ACID", "dbms", addDays(today, 3), "10:00", 50, "study", false),
    t("Matrices: determinant practice", "math", addDays(today, 4), "11:00", 50, "study", false),
    t("Python functions mini-project", "python", addDays(today, 5), "15:00", 60, "study", false),
    t("Weekly review quiz", "ai", addDays(today, 6), "17:00", 30, "quiz", false),
    t("Python loops practice", "python", addDays(today, -1), "10:00", 50, "study", true),
    t("Stacks and queues revision", "ds", addDays(today, -1), "16:00", 40, "revision", true),
    t("Matrices: multiplication", "math", addDays(today, -2), "09:00", 50, "study", true),
    t("Neural networks: reading", "ai", addDays(today, -2), "15:00", 45, "study", false, "low"),
    t("SQL joins lab", "dbms", addDays(today, -3), "11:00", 60, "study", true),
  ];

  const exams = [
    { id: uid(), subjectId: "dbms", title: "DBMS Mid-term", date: addDays(today, 12) },
    { id: uid(), subjectId: "math", title: "Mathematics Unit Test", date: addDays(today, 19) },
    { id: uid(), subjectId: "ds", title: "Data Structures Mid-term", date: addDays(today, 26) },
  ];

  const notes = [
    { ...buildNotes({ topicId: "dbms-joins", subjectId: "dbms", type: "short" }), type: "short" as const, source: "Topic: SQL Joins", ago: 4 },
    { ...buildNotes({ topicId: "ds-stacks-queues", subjectId: "ds", type: "bullets" }), type: "bullets" as const, source: "Topic: Stacks and Queues", ago: 9 },
    { ...buildNotes({ topicId: "sci-photosynthesis", subjectId: "sci", type: "detailed" }), type: "detailed" as const, source: "Topic: Photosynthesis", ago: 16 },
  ].map((n) => ({ id: uid(), title: n.title, subjectId: n.subjectId, type: n.type, content: n.markdown, source: n.source, createdAt: isoDaysAgo(n.ago), updatedAt: isoDaysAgo(n.ago), sample: true }));

  const materials: Material[] = [
    sample("DBMS_Unit2_Normalization.pdf", "pdf", 842, "dbms", 12, 1, [
      "Unit 2: Normalization and Functional Dependencies", "A functional dependency X → Y states that two rows agreeing on X must agree on Y. Functional dependencies are the formal basis for deciding how to split a relation into well-structured tables.",
      "First Normal Form (1NF) requires atomic attribute values. Second Normal Form (2NF) removes partial dependencies on a composite key. Third Normal Form (3NF) removes transitive dependencies between non-key attributes.",
      "Anomalies. Insertion anomalies prevent recording a fact without unrelated data. Deletion anomalies lose facts when a row is removed. Update anomalies require changing many rows to modify one fact.",
      "Worked example. Consider Orders(OrderID, ProductID, ProductName, Qty). ProductName depends on ProductID only, so the relation violates 2NF and should be decomposed into Orders and Products.",
      "Exercise. Decompose Enrollment(StudentID, CourseID, StudentName, CourseTitle, Grade) into 3NF and list the functional dependencies you used.",
    ]),
    sample("Python_Loops_Lab_Manual.docx", "docx", 214, "python", 20, 5, [
      "Lab 4: Loops in Python", "A for loop iterates over a sequence. A while loop repeats while a condition holds. The range function generates sequences of integers and is commonly used with for loops.",
      "Task 1. Print the multiplication table of a number entered by the user. Task 2. Sum the digits of an integer using a while loop. Task 3. Print all prime numbers below 50 using nested loops.",
      "Hint. Use break to leave a loop early when a divisor is found, and use the else clause of the loop to detect that no divisor was found.",
    ]),
    { ...sample("Trees_Lecture_Notes.txt", "txt", 18, "ds", 8, 2, [
      "Binary Trees: lecture summary", "A binary tree has nodes with at most two children. A binary search tree keeps smaller keys on the left and larger keys on the right, so inorder traversal visits keys in sorted order.",
      "Search, insertion and deletion take time proportional to the height of the tree. A balanced tree has height proportional to log n, but a skewed tree can degrade to a linked list with height n.",
      "Traversals. Inorder visits left, root, right. Preorder visits root, left, right. Postorder visits left, right, root. Level-order uses a queue.",
    ]), extracted: true },
    sample("AI_Intro_Slides.pdf", "pdf", 1530, "ai", 25, 10, [
      "Introduction to Artificial Intelligence", "Machine learning systems learn patterns from data. Supervised learning uses labelled examples, while unsupervised learning looks for structure in unlabelled data.",
      "Neural networks consist of layers of neurons. Each neuron computes a weighted sum, adds a bias and applies an activation function such as ReLU. Training adjusts weights using gradient descent and backpropagation.",
    ]),
  ];

  const goals: Goal[] = [
    { id: uid(), title: "Study 2 hours today", kind: "daily", target: 120, progress: 50, unit: "min", done: false },
    { id: uid(), title: "Complete 5 quizzes this week", kind: "weekly", target: 5, progress: 3, unit: "quizzes", due: addDays(today, 4), done: false },
    { id: uid(), title: "Revise 4 weak topics this week", kind: "weekly", target: 4, progress: 1, unit: "topics", due: addDays(today, 4), done: false },
    { id: uid(), title: "Reach 80% average quiz accuracy", kind: "academic", target: 80, progress: 62, unit: "%", due: addDays(today, 60), done: false },
    { id: uid(), title: "Score 85% in the DBMS mid-term", kind: "exam", target: 85, progress: 46, unit: "% mastery", due: addDays(today, 12), done: false },
    { id: uid(), title: "Finish the Python loops module", kind: "academic", target: 1, progress: 1, unit: "module", done: true },
  ];

  const nt = (kind: Notif["kind"], title: string, body: string, ago: number, read: boolean, href?: string): Notif => ({ id: uid(), kind, title, body, time: isoDaysAgo(ago, 8 + ago), read, href });
  const notifications: Notif[] = [
    nt("reminder", "Study session at 2:30 PM", "Derivatives: chain rule practice is scheduled for today.", 0, false, "/routine"),
    nt("revision", "Normalization is due for revision", "Spaced revision is due today. Mastery is currently 46%.", 0, false, "/revision"),
    nt("task", "2 tasks pending from earlier days", "Neural networks reading and one more are not completed.", 1, false, "/planner"),
    nt("recommendation", "New resource for Binary Trees", "BST traversal practice questions match your recent mistakes.", 1, true, "/resources"),
    nt("quiz", "Quiz result: SQL Joins 80%", "4 of 5 correct. Review the explanation for the missed question.", 2, true, "/quizzes/history"),
    nt("goal", "Goal achieved: Python loops module", "You marked this academic goal as complete.", 6, true, "/goals"),
  ];

  const revisions: RevisionItem[] = [
    { id: uid(), subjectId: "dbms", topicId: "dbms-normalization", topic: "Database Normalization", dueDate: today, reason: "weak", intervalDays: 2, revisionCount: 1, lastRevised: addDays(today, -2) },
    { id: uid(), subjectId: "ds", topicId: "ds-trees", topic: "Binary Trees", dueDate: today, reason: "mistake", intervalDays: 3, revisionCount: 0 },
    { id: uid(), subjectId: "python", topicId: "py-collections", topic: "Lists and Dictionaries", dueDate: addDays(today, -1), reason: "due", intervalDays: 7, revisionCount: 2, lastRevised: addDays(today, -8) },
    { id: uid(), subjectId: "math", topicId: "math-derivatives", topic: "Derivatives", dueDate: addDays(today, 1), reason: "exam", intervalDays: 3, revisionCount: 1, lastRevised: addDays(today, -3) },
    { id: uid(), subjectId: "dbms", topicId: "dbms-joins", topic: "SQL Joins", dueDate: addDays(today, 2), reason: "exam", intervalDays: 5, revisionCount: 1, lastRevised: addDays(today, -3) },
    { id: uid(), subjectId: "math", topicId: "math-probability", topic: "Probability Basics", dueDate: addDays(today, 3), reason: "weak", intervalDays: 3, revisionCount: 0 },
  ];
  const rh = (topic: string, subjectId: string, ago: number, minutes: number, score?: number): RevisionRecord => ({ id: uid(), topic, subjectId, date: addDays(today, -ago), minutes, score });
  const revisionHistory = [rh("Database Normalization", "dbms", 2, 25, 60), rh("Stacks and Queues", "ds", 1, 20, 80), rh("Derivatives", "math", 3, 30, 60), rh("SQL Joins", "dbms", 3, 20, 75), rh("Lists and Dictionaries", "python", 8, 20, 70)];

  const me = (kind: MemoryEvent["kind"], ago: number, title: string, detail: string): MemoryEvent => ({ id: uid(), kind, date: addDays(today, -ago), title, detail });
  const memory: MemoryEvent[] = [
    me("stored", 58, "Profile created", "Name, department and academic year saved from sign-up (sample data)."),
    me("stored", 58, "Learning goals set", "You wrote your learning goals during onboarding."),
    me("edited", 57, "Preference selected: Practical examples", "You chose practical examples and step-by-step explanations as preferred styles."),
    me("inferred", 21, "Strength noticed: Python loops", "Quiz accuracy of 80% and a completed module support this."),
    me("inferred", 14, "Difficulty noticed: Normalization", "Quiz accuracy of 40% on the first attempt."),
    me("inferred", 7, "Improvement noticed: Normalization", "Accuracy rose from 40% to 60% across two attempts."),
    me("edited", 5, "Study availability updated", "Sunday marked as a rest day."),
    me("inferred", 3, "Difficulty noticed: Binary Trees", "40% accuracy on a hard quiz; 3 mistakes recorded."),
  ].reverse();

  const act = (kind: ActivityItem["kind"], title: string, detail: string, ago: number, href?: string): ActivityItem => ({ id: uid(), kind, title, detail, time: isoDaysAgo(ago, 12 - Math.min(ago, 4)), href });
  const activity: ActivityItem[] = [
    act("session", "Studied Normalization: 2NF and 3NF", "50 min · Database Management Systems", 0, "/routine"),
    act("quiz", "Python collections quiz", "60% · 3 of 5 correct", 1, "/quizzes/history"),
    act("quiz", "SQL Joins quiz", "80% · 4 of 5 correct", 2, "/quizzes/history"),
    act("topic", "Completed topic: Stacks and Queues", "Mastery 84%", 4, "/progress"),
    act("notes", "Generated notes: SQL Joins", "Short notes saved", 4, "/notes"),
    act("revision", "Revised Database Normalization", "25 min · score 60%", 2, "/revision"),
    act("doubt", "Asked: Explain photosynthesis with a practical example", "Doubt Solver", 6, "/doubt-solver"),
  ];

  return {
    version: 1, session: null, onboarded: true, isSample: true, profile: defaultProfile(),
    settings: { theme: "dark", reduceMotion: false, sidebarCollapsed: false, notifPrefs: { reminders: true, revision: true, tasks: true, recommendations: true, quiz: true, goals: true }, privacy: { useMemory: true, shareAggregate: true, educatorView: false } },
    subjects, topics, tasks, exams, sessions, attempts, activeQuiz: null, notes, materials, goals, notifications, revisions, revisionHistory,
    mistakes: [...mmap.values()], memory, activity, savedResources: ["r6", "r12"],
    conversations: [{
      id: uid(), title: "Welcome to MentorMind", updatedAt: new Date().toISOString(),
      messages: [{ id: uid(), role: "agent", agent: "coordinator", time: new Date().toISOString(), text: "Hi! I'm the MentorMind Coordinator. Ask me anything and I'll route it to the right specialist agent — Doubt Solver, Notes, Quiz, Planner, Progress, Revision or Resources. This is a demo routing service, not a live AI model.", payload: { kind: "text", text: "" } }],
    }],
  };
}

export function clearedLearning(s: AppState): AppState {
  return {
    ...s, isSample: false,
    topics: s.topics.map((t) => ({ ...t, status: "not_started", mastery: 0, lastStudied: undefined })),
    sessions: [], attempts: [], mistakes: [], revisions: [], revisionHistory: [], activity: [], activeQuiz: null,
    tasks: [], exams: [], goals: s.goals.map((g) => ({ ...g, progress: 0, done: false })), notifications: [],
    memory: [{ id: uid(), date: todayStr(), kind: "stored", title: "Learning profile cleared", detail: "Sample learning history, mistakes and inferred insights were removed. Your preferences and goals were kept." }],
  };
}
