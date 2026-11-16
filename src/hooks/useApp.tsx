"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { ActivityItem, AppState, MemoryEvent, Notif, Profile, QuizAttempt, StudySession } from "@/types";
import { DEMO_EMAIL, DEMO_PASSWORD, STORAGE_KEY, clearedLearning, createSeed } from "@/data/seed";
import { addDays, sha256, todayStr, uid } from "@/utils";
import { saveStudentStateToFirebase, getStudentStateFromFirebase } from "@/services/firebase/database";
import {
  signInWithGoogle,
  loginWithEmail,
  signUpWithEmail,
  sendResetEmail,
  logoutFirebase,
  onFirebaseAuthStateChanged,
} from "@/services/firebase/auth";

interface Account { email: string; hash: string; profile: Profile }
export interface SignupInput {
  name: string;
  email: string;
  password: string;
  department: string;
  year: string;
  institution: string;
  goals: string;
  termsAccepted?: boolean;
  ageConfirmed?: boolean;
  marketing?: boolean;
}
type Result = { ok: boolean; error?: string };

interface Ctx {
  state: AppState;
  ready: boolean;
  update: (fn: (s: AppState) => AppState) => void;
  addActivity: (kind: ActivityItem["kind"], title: string, detail?: string, href?: string) => void;
  addSession: (s: Omit<StudySession, "id" | "date" | "hour"> & { date?: string; id?: string }) => void;
  addMemory: (kind: MemoryEvent["kind"], title: string, detail: string) => void;
  notify: (kind: Notif["kind"], title: string, body: string, href?: string) => void;
  login: (email: string, password: string, remember: boolean) => Promise<Result>;
  loginGoogle: () => Promise<Result>;
  signup: (d: SignupInput) => Promise<Result>;
  resetPassword: (email: string, password?: string) => Promise<Result>;
  logout: () => void;
  clearProfile: () => void;
  toggleTask: (id: string) => void;
  finishQuiz: (a: QuizAttempt) => void;
  addRevision: (topicId: string, reason: "weak" | "due" | "exam" | "mistake") => void;
  completeRevision: (id: string, o: { minutes: number; score?: number; nextDays: number }) => void;
}
const AppCtx = createContext<Ctx | null>(null);

const readAccounts = (): Account[] => {
  try { return JSON.parse(localStorage.getItem("mm-accounts") || "[]"); } catch { return []; }
};
const writeAccounts = (a: Account[]) => localStorage.setItem("mm-accounts", JSON.stringify(a));
const hasPref = (s: AppState, k: keyof AppState["settings"]["notifPrefs"]) => s.settings.notifPrefs[k];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createSeed());
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        const seed = createSeed();
        const merged: AppState = { ...seed, ...parsed, settings: { ...seed.settings, ...parsed.settings, notifPrefs: { ...seed.settings.notifPrefs, ...parsed.settings?.notifPrefs }, privacy: { ...seed.settings.privacy, ...parsed.settings?.privacy } } };
        if (localStorage.getItem("mm-remember") === "0" && !sessionStorage.getItem("mm-alive")) merged.session = null;
        setState(merged);
      }
    } catch { /* corrupted storage: fall back to seed */ }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota exceeded */ }
    if (state.session?.email || state.session?.uid) {
      saveStudentStateToFirebase(state, state.session?.uid).catch((e) => {
        console.warn("Failed to sync to Firebase:", e);
      });
    }
  }, [state, ready]);

  // Synchronize with Firebase Auth session
  useEffect(() => {
    const unsub = onFirebaseAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const email = (fbUser.email || "").toLowerCase();
        const uid = fbUser.uid;
        const photoURL = fbUser.photoURL || undefined;
        const displayName = fbUser.displayName || "";

        // Hydrate from Firebase RTDB if available
        const remote = await getStudentStateFromFirebase(uid, email);
        setState((current) => {
          const base = remote ? { ...current, ...remote } : current;
          return {
            ...base,
            session: { email, uid, photoURL },
            profile: {
              ...base.profile,
              email: email || base.profile.email,
              name: displayName || base.profile.name,
              avatarImage: photoURL || base.profile.avatarImage,
            },
          };
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const apply = () => {
      const t = state.settings.theme;
      const dark = t === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : t === "dark";
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.dataset.motion = state.settings.reduceMotion ? "reduce" : "full";
    };
    apply();
    if (state.settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [state.settings.theme, state.settings.reduceMotion]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  const addActivity: Ctx["addActivity"] = useCallback((kind, title, detail, href) =>
    update((s) => ({ ...s, activity: [{ id: uid(), kind, title, detail, href, time: new Date().toISOString() }, ...s.activity].slice(0, 60) })), [update]);
  const addSession: Ctx["addSession"] = useCallback((x) =>
    update((s) => ({ ...s, sessions: [...s.sessions, { ...x, id: x.id ?? uid(), date: x.date ?? todayStr(), hour: new Date().getHours() }] })), [update]);
  const addMemory: Ctx["addMemory"] = useCallback((kind, title, detail) =>
    update((s) => ({ ...s, memory: [{ id: uid(), date: todayStr(), kind, title, detail }, ...s.memory].slice(0, 80) })), [update]);
  const notify: Ctx["notify"] = useCallback((kind, title, body, href) =>
    update((s) => ({ ...s, notifications: [{ id: uid(), kind, title, body, href, read: false, time: new Date().toISOString() }, ...s.notifications].slice(0, 50) })), [update]);

  const startSession = (remember: boolean) => {
    localStorage.setItem("mm-remember", remember ? "1" : "0");
    sessionStorage.setItem("mm-alive", "1");
  };

  const login: Ctx["login"] = useCallback(async (email, password, remember) => {
    const e = email.trim().toLowerCase();
    startSession(remember);

    // 1. Try Firebase Email/Password Sign-In
    const fbRes = await loginWithEmail(e, password);
    if (fbRes.ok && fbRes.user) {
      const u = fbRes.user;
      const remote = await getStudentStateFromFirebase(u.uid, e);
      setState((s) => {
        const seed = createSeed(u.displayName || s.profile.name || "Student", e);
        const base = remote ? { ...seed, ...remote } : seed;
        return {
          ...base,
          onboarded: true,
          session: { email: e, uid: u.uid, photoURL: u.photoURL || undefined },
          profile: { ...base.profile, email: e, name: u.displayName || base.profile.name },
        };
      });
      return { ok: true };
    }

    // 2. Fallback to local accounts (for offline mode or local accounts)
    const acc = readAccounts().find((a) => a.email === e);
    if (acc && acc.hash === (await sha256(password))) {
      setState((s) => {
        if (s.profile.email.toLowerCase() === e) return { ...s, session: { email: e } };
        const seed = createSeed(acc.profile.name, e);
        return { ...seed, profile: acc.profile, onboarded: true, session: { email: e } };
      });
      return { ok: true };
    }

    return { ok: false, error: fbRes.error || "Incorrect email or password." };
  }, []);

  const loginGoogle: Ctx["loginGoogle"] = useCallback(async () => {
    startSession(true);
    const fbRes = await signInWithGoogle();
    if (!fbRes.ok || !fbRes.user) {
      return { ok: false, error: fbRes.error || "Google sign-in could not be completed." };
    }

    const u = fbRes.user;
    const e = (u.email || "").toLowerCase();
    const remote = await getStudentStateFromFirebase(u.uid, e);

    setState((s) => {
      const seed = createSeed(u.displayName || "Student", e);
      const base = remote ? { ...seed, ...remote } : seed;
      const profile: Profile = {
        ...base.profile,
        name: u.displayName || base.profile.name || "Student",
        email: e,
        avatarImage: u.photoURL || undefined,
      };

      const newState: AppState = {
        ...base,
        profile,
        onboarded: true,
        session: { email: e, uid: u.uid, photoURL: u.photoURL || undefined },
      };

      // Persist to Firebase Realtime Database
      saveStudentStateToFirebase(newState, u.uid);
      return newState;
    });

    return { ok: true };
  }, []);

  const signup: Ctx["signup"] = useCallback(async (d) => {
    const e = d.email.trim().toLowerCase();
    startSession(true);

    // 1. Create account with Firebase Auth
    const fbRes = await signUpWithEmail(d.name, e, d.password);
    if (!fbRes.ok) {
      return { ok: false, error: fbRes.error || "Could not create account." };
    }

    const uidStr = fbRes.user?.uid;
    const seed = createSeed(d.name.trim(), e);
    const profile: Profile = {
      ...seed.profile,
      name: d.name.trim(),
      email: e,
      department: d.department,
      year: d.year,
      institution: d.institution,
      goals: d.goals,
    };

    const newState: AppState = {
      ...seed,
      profile,
      onboarded: true,
      tourCompleted: false,
      session: { email: e, uid: uidStr },
      consent: {
        terms: true,
        privacy: true,
        ageConfirmed: d.ageConfirmed ?? true,
        marketing: !!d.marketing,
        timestamp: new Date().toISOString(),
        version: "v1.0",
      },
      memory: [
        {
          id: uid(),
          date: todayStr(),
          kind: "stored",
          title: "Profile initialized",
          detail: "Account created and synchronized to Firebase.",
        },
      ],
    };

    // Save to Firebase RTDB
    await saveStudentStateToFirebase(newState, uidStr);

    // Also cache locally
    const accounts = readAccounts();
    writeAccounts([...accounts.filter((a) => a.email !== e), { email: e, hash: await sha256(d.password), profile }]);

    setState(newState);
    return { ok: true };
  }, []);

  const resetPassword: Ctx["resetPassword"] = useCallback(async (email, password) => {
    const e = email.trim().toLowerCase();
    const fbRes = await sendResetEmail(e);
    if (fbRes.ok) {
      return { ok: true };
    }
    // Fallback to local accounts if email doesn't exist in Firebase
    const accounts = readAccounts();
    const acc = accounts.find((a) => a.email === e);
    if (acc && password) {
      acc.hash = await sha256(password);
      writeAccounts(accounts);
      return { ok: true };
    }
    return { ok: false, error: fbRes.error || "Could not send password reset email." };
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.removeItem("mm-alive");
    await logoutFirebase();
    setState((s) => ({ ...s, session: null }));
  }, []);

  const clearProfile = useCallback(() => setState((s) => clearedLearning(s)), []);

  const toggleTask: Ctx["toggleTask"] = useCallback((id) => update((s) => {
    const task = s.tasks.find((t) => t.id === id);
    if (!task) return s;
    const done = !task.done;
    const sid = `task-${id}`;
    let sessions = s.sessions.filter((x) => x.id !== sid);
    let goals = s.goals;
    let activity = s.activity;
    const counts = task.kind === "study" || task.kind === "revision" || task.kind === "quiz";
    if (done && counts) {
      sessions = [...sessions, { id: sid, date: todayStr(), hour: new Date().getHours(), subjectId: task.subjectId, topic: task.title, minutes: task.minutes, kind: task.kind === "revision" ? "revision" : task.kind === "quiz" ? "quiz" : "study" }];
      goals = goals.map((g) => (g.kind === "daily" && g.unit === "min" ? { ...g, progress: Math.min(g.target, g.progress + task.minutes), done: g.progress + task.minutes >= g.target } : g));
      activity = [{ id: uid(), kind: "session" as const, title: `Completed: ${task.title}`, detail: `${task.minutes} min`, time: new Date().toISOString(), href: "/routine" }, ...activity].slice(0, 60);
    }
    if (!done && counts) goals = goals.map((g) => (g.kind === "daily" && g.unit === "min" ? { ...g, progress: Math.max(0, g.progress - task.minutes), done: false } : g));
    return { ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done } : t)), sessions, goals, activity };
  }), [update]);

  const addRevision: Ctx["addRevision"] = useCallback((topicId, reason) => update((s) => {
    const t = s.topics.find((x) => x.id === topicId);
    if (!t || s.revisions.some((r) => r.topicId === topicId)) return s;
    return { ...s, revisions: [{ id: uid(), subjectId: t.subjectId, topicId, topic: t.name, dueDate: todayStr(), reason, intervalDays: 2, revisionCount: 0 }, ...s.revisions] };
  }), [update]);

  const completeRevision: Ctx["completeRevision"] = useCallback((id, o) => update((s) => {
    const r = s.revisions.find((x) => x.id === id);
    if (!r) return s;
    const today = todayStr();
    return {
      ...s,
      revisions: s.revisions.map((x) => (x.id === id ? { ...x, lastRevised: today, revisionCount: x.revisionCount + 1, dueDate: addDays(today, o.nextDays), intervalDays: o.nextDays } : x)),
      revisionHistory: [{ id: uid(), subjectId: r.subjectId, topic: r.topic, date: today, minutes: o.minutes, score: o.score }, ...s.revisionHistory],
      sessions: [...s.sessions, { id: uid(), date: today, hour: new Date().getHours(), subjectId: r.subjectId, topic: r.topic, minutes: o.minutes, kind: "revision" }],
      topics: s.topics.map((t) => (t.id === r.topicId ? { ...t, mastery: Math.min(100, t.mastery + 4), lastStudied: today, status: t.status === "not_started" ? "learning" : t.status } : t)),
      goals: s.goals.map((g) => (g.unit === "topics" && !g.done ? { ...g, progress: g.progress + 1, done: g.progress + 1 >= g.target } : g)),
      activity: [{ id: uid(), kind: "revision" as const, title: `Revised ${r.topic}`, detail: `${o.minutes} min${o.score != null ? ` · quick quiz ${o.score}%` : ""}`, time: new Date().toISOString(), href: "/revision" }, ...s.activity].slice(0, 60),
      memory: [{ id: uid(), date: today, kind: "stored" as const, title: `Revision completed: ${r.topic}`, detail: `Next revision scheduled in ${o.nextDays} day${o.nextDays > 1 ? "s" : ""}.` }, ...s.memory],
    };
  }), [update]);

  const finishQuiz: Ctx["finishQuiz"] = useCallback((a) => update((s) => {
    const today = todayStr();
    const accByTopic = new Map<string, number>();
    const topicIds = [...new Set(a.questions.map((q) => q.topicId))];
    topicIds.forEach((tid) => {
      const qs = a.questions.filter((q) => q.topicId === tid);
      accByTopic.set(tid, (qs.filter((q) => a.results[q.id]).length / qs.length) * 100);
    });
    const topics = s.topics.map((t) => {
      const acc = accByTopic.get(t.id);
      if (acc === undefined) return t;
      const mastery = Math.round(t.mastery > 0 ? t.mastery * 0.6 + acc * 0.4 : acc * 0.8);
      return { ...t, mastery, status: (mastery >= 80 ? "completed" : "learning") as "completed" | "learning", lastStudied: today };
    });
    let mistakes = [...s.mistakes];
    a.questions.forEach((q) => {
      const idx = mistakes.findIndex((m) => m.questionId === q.id);
      if (!a.results[q.id]) {
        if (idx >= 0) mistakes[idx] = { ...mistakes[idx], count: mistakes[idx].count + 1, given: a.answers[q.id] ?? "", lastSeen: today };
        else mistakes.push({ id: uid(), questionId: q.id, subjectId: q.subjectId, topicId: q.topicId, question: q.q, correct: q.answer, given: a.answers[q.id] ?? "", count: 1, lastSeen: today });
      } else if (idx >= 0) {
        mistakes[idx] = { ...mistakes[idx], count: mistakes[idx].count - 1 };
      }
    });
    mistakes = mistakes.filter((m) => m.count > 0);
    const revisions = [...s.revisions];
    accByTopic.forEach((acc, tid) => {
      if (acc < 60 && !revisions.some((r) => r.topicId === tid)) {
        const t = s.topics.find((x) => x.id === tid);
        if (t) revisions.unshift({ id: uid(), subjectId: t.subjectId, topicId: tid, topic: t.name, dueDate: today, reason: "mistake", intervalDays: 2, revisionCount: 0 });
      }
    });
    const memory = [...s.memory];
    if (a.accuracy < 50) memory.unshift({ id: uid(), date: today, kind: "inferred", title: `Difficulty noticed: ${a.topic}`, detail: `${a.accuracy}% accuracy on a ${a.difficulty} quiz.` });
    else if (a.accuracy >= 90) memory.unshift({ id: uid(), date: today, kind: "inferred", title: `Strength noticed: ${a.topic}`, detail: `${a.accuracy}% accuracy on a ${a.difficulty} quiz.` });
    const notifications = hasPref(s, "quiz") ? [{ id: uid(), kind: "quiz" as const, title: `Quiz result: ${a.topic} ${a.accuracy}%`, body: `${a.score} of ${a.total} correct.`, time: new Date().toISOString(), read: false, href: "/quizzes/history" }, ...s.notifications] : s.notifications;
    const goals = s.goals.map((g) => (g.unit === "quizzes" && !g.done ? { ...g, progress: g.progress + 1, done: g.progress + 1 >= g.target } : g));
    return {
      ...s, topics, mistakes, revisions, memory, notifications, goals, activeQuiz: null,
      attempts: [a, ...s.attempts],
      sessions: [...s.sessions, { id: uid(), date: today, hour: new Date().getHours(), subjectId: a.subjectId, topic: a.topic, minutes: Math.max(1, Math.ceil(a.seconds / 60)), kind: "quiz" }],
      activity: [{ id: uid(), kind: "quiz" as const, title: `${a.topic} quiz`, detail: `${a.accuracy}% · ${a.score} of ${a.total} correct`, time: new Date().toISOString(), href: "/quizzes/history" }, ...s.activity].slice(0, 60),
    };
  }), [update]);

  return (
    <AppCtx.Provider value={{ state, ready, update, addActivity, addSession, addMemory, notify, login, loginGoogle, signup, resetPassword, logout, clearProfile, toggleTask, finishQuiz, addRevision, completeRevision }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}
export const subjectName = (s: AppState, id: string) => s.subjects.find((x) => x.id === id)?.name ?? "General";
export const subjectColor = (s: AppState, id: string) => s.subjects.find((x) => x.id === id)?.color ?? "#8b7bff";
