import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  department: text("department").notNull(),
  year: text("year").notNull(),
  institution: text("institution").notNull(),
  goals: text("goals").default("").notNull(),
  phone: text("phone").default("").notNull(),
  dailyMinutes: integer("daily_minutes").default(90).notNull(),
  styles: jsonb("styles").$type<string[]>().default([]).notNull(),
  availability: jsonb("availability").$type<Record<string, boolean>>().default({}).notNull(),
  avatarColor: text("avatar_color").default("#8b7bff").notNull(),
  avatarImage: text("avatar_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  hour: integer("hour").notNull(),
  subjectId: text("subject_id").notNull(),
  topic: text("topic").notNull(),
  minutes: integer("minutes").notNull(),
  kind: text("kind").notNull(), // study, revision, quiz, notes, doubt
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studyTasks = pgTable("study_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subjectId: text("subject_id").notNull(),
  date: text("date").notNull(),
  start: text("start").notNull(),
  minutes: integer("minutes").notNull(),
  kind: text("kind").notNull(), // study, revision, break, reminder, quiz
  done: boolean("done").default(false).notNull(),
  priority: text("priority").default("medium").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedNotes = pgTable("saved_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subjectId: text("subject_id").notNull(),
  type: text("type").notNull(), // short, detailed, bullets, exam, revision, chapter
  content: text("content").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  date: text("date").notNull(),
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers").notNull(),
  results: jsonb("results").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  accuracy: integer("accuracy").notNull(),
  seconds: integer("seconds").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studyMaterials = pgTable("study_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  kind: text("kind").notNull(), // pdf, docx, txt
  sizeKB: integer("size_kb").notNull(),
  subjectId: text("subject_id").notNull(),
  content: text("content").notNull(),
  extracted: boolean("extracted").default(true).notNull(),
  bookmarks: jsonb("bookmarks").default([]).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
});

export const learningMemoryEvents = pgTable("learning_memory_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  kind: text("kind").notNull(), // stored, inferred, edited
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentMistakes = pgTable("student_mistakes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  subjectId: text("subject_id").notNull(),
  topicId: text("topic_id").notNull(),
  question: text("question").notNull(),
  correct: text("correct").notNull(),
  given: text("given").notNull(),
  count: integer("count").default(1).notNull(),
  lastSeen: text("last_seen").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revisionQueue = pgTable("revision_queue", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull(),
  topicId: text("topic_id").notNull(),
  topic: text("topic").notNull(),
  dueDate: text("due_date").notNull(),
  reason: text("reason").notNull(), // weak, due, exam, mistake
  intervalDays: integer("interval_days").default(2).notNull(),
  revisionCount: integer("revision_count").default(0).notNull(),
  lastRevised: text("last_revised"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  time: text("time").notNull(),
  read: boolean("read").default(false).notNull(),
  href: text("href"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
