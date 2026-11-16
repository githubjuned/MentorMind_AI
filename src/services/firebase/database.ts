import { ref, set, get, update, onValue, push, child } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { AppState, QuizAttempt, Note, StudySession, MemoryEvent, Task } from "@/types";

/**
 * Sanitize an email address for use as a Firebase Realtime Database path key
 */
export function sanitizeEmailKey(email: string): string {
  return email.toLowerCase().replace(/[.#$\[\]]/g, "_");
}

/**
 * Save complete student AppState to Firebase Realtime Database
 */
export async function saveStudentStateToFirebase(state: AppState, userUid?: string): Promise<boolean> {
  const email = state.session?.email || state.profile.email;
  const uid = userUid || state.session?.uid;
  if (!email && !uid) return false;

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
    if (uid) {
      await set(ref(rtdb, `students/${uid}`), payload);
    }
    if (email) {
      const emailKey = sanitizeEmailKey(email);
      if (emailKey !== uid) {
        await set(ref(rtdb, `students/${emailKey}`), payload);
      }
    }
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
  identifier: string,
  fallbackEmail?: string
): Promise<Partial<AppState> | null> {
  if (!identifier && !fallbackEmail) return null;

  try {
    if (identifier) {
      const directRef = ref(rtdb, `students/${identifier}`);
      const snap = await get(directRef);
      if (snap.exists()) return snap.val() as Partial<AppState>;

      const sanitizedKey = sanitizeEmailKey(identifier);
      if (sanitizedKey !== identifier) {
        const emailRef = ref(rtdb, `students/${sanitizedKey}`);
        const emailSnap = await get(emailRef);
        if (emailSnap.exists()) return emailSnap.val() as Partial<AppState>;
      }
    }

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
  email: string,
  callback: (data: Partial<AppState>) => void
): () => void {
  const key = sanitizeEmailKey(email);
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
export async function logQuizAttemptToFirebase(email: string, attempt: QuizAttempt): Promise<void> {
  if (!email) return;
  const key = sanitizeEmailKey(email);
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
export async function logStudySessionToFirebase(email: string, session: StudySession): Promise<void> {
  if (!email) return;
  const key = sanitizeEmailKey(email);
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
export async function saveNoteToFirebase(email: string, note: Note): Promise<void> {
  if (!email) return;
  const key = sanitizeEmailKey(email);
  const noteRef = ref(rtdb, `students/${key}/notes/${note.id}`);
  try {
    await set(noteRef, note);
  } catch (err) {
    console.error("Error saving note to Firebase:", err);
  }
}

