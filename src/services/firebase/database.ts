import { ref, set, get, update, onValue, push, child } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import type { AppState, QuizAttempt, Note, StudySession, MemoryEvent, Task } from "@/types";

/**
 * Sanitize an email address for use as a Firebase Realtime Database path key
 */
export function sanitizeEmailKey(email: string): string {
  return email.toLowerCase().replace(/[.#$\[\]]/g, "_");
}

/**
 * Resolve effective student key for strict UID-based access
 */
export function getEffectiveKey(fallbackId?: string): string {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  if (fallbackId && !fallbackId.includes("@")) return fallbackId;
  if (fallbackId) return sanitizeEmailKey(fallbackId);
  return "demo-student";
}

/**
 * Save complete student AppState to Firebase Realtime Database
 */
export async function saveStudentStateToFirebase(state: AppState, userUid?: string): Promise<boolean> {
  const uid = userUid || auth.currentUser?.uid || state.session?.uid;
  const email = state.session?.email || state.profile.email;
  const key = uid || (email ? sanitizeEmailKey(email) : null);
  if (!key) return false;

  const payload = {
    profile: state.profile,
    settings: state.settings,
    subjects: state.subjects,
    topics: state.topics,
    tasks: state.tasks,
    exams: state.exams,
    sessions: state.sessions,
    attempts: state.attempts,
    notes: state.notes,
    materials: state.materials,
    goals: state.goals,
    notifications: state.notifications,
    revisions: state.revisions,
    revisionHistory: state.revisionHistory,
    mistakes: state.mistakes,
    memory: state.memory,
    activity: state.activity,
    savedResources: state.savedResources,
    updatedAt: new Date().toISOString(),
  };

  try {
    const studentRef = ref(rtdb, `students/${key}`);
    await set(studentRef, payload);
    return true;
  } catch (error) {
    console.error("Firebase RTDB save error:", error);
    return false;
  }
}

/**
 * Fetch student AppState from Firebase Realtime Database
 */
export async function getStudentStateFromFirebase(
  identifier?: string,
  fallbackEmail?: string
): Promise<Partial<AppState> | null> {
  const key = identifier || auth.currentUser?.uid || (fallbackEmail ? sanitizeEmailKey(fallbackEmail) : null);
  if (!key) return null;

  try {
    const directRef = ref(rtdb, `students/${key}`);
    const snap = await get(directRef);
    if (snap.exists()) return snap.val() as Partial<AppState>;

    // Fallback attempt if key is an email
    if (fallbackEmail) {
      const emailRef = ref(rtdb, `students/${sanitizeEmailKey(fallbackEmail)}`);
      const emailSnap = await get(emailRef);
      if (emailSnap.exists()) return emailSnap.val() as Partial<AppState>;
    }

    return null;
  } catch (error) {
    console.error("Firebase RTDB fetch error:", error);
    return null;
  }
}

/**
 * Subscribe to real-time updates for a student's data
 */
export function subscribeToStudentData(
  identifier: string,
  callback: (data: Partial<AppState>) => void
): () => void {
  const key = getEffectiveKey(identifier);
  const studentRef = ref(rtdb, `students/${key}`);

  const unsubscribe = onValue(studentRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });

  return unsubscribe;
}

/**
 * Push a new quiz attempt directly to Firebase
 */
export async function logQuizAttemptToFirebase(identifier: string, attempt: QuizAttempt): Promise<void> {
  const key = getEffectiveKey(identifier);
  const attemptsRef = ref(rtdb, `students/${key}/attempts`);
  try {
    const newRef = push(attemptsRef);
    await set(newRef, attempt);
  } catch (err) {
    console.error("Error logging quiz to Firebase:", err);
  }
}

/**
 * Push a new study session to Firebase
 */
export async function logStudySessionToFirebase(identifier: string, session: StudySession): Promise<void> {
  const key = getEffectiveKey(identifier);
  const sessionsRef = ref(rtdb, `students/${key}/sessions`);
  try {
    const newRef = push(sessionsRef);
    await set(newRef, session);
  } catch (err) {
    console.error("Error logging study session to Firebase:", err);
  }
}

/**
 * Save a newly generated or edited note to Firebase
 */
export async function saveNoteToFirebase(identifier: string, note: Note): Promise<void> {
  const key = getEffectiveKey(identifier);
  const noteRef = ref(rtdb, `students/${key}/notes/${note.id}`);
  try {
    await set(noteRef, note);
  } catch (err) {
    console.error("Error saving note to Firebase:", err);
  }
}

