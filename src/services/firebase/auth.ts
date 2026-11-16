import {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

/**
 * Format Firebase Auth errors into user-friendly messages
 */
export function formatAuthError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "An unexpected authentication error occurred. Please try again.";
  }

  const code = (error as AuthError).code || "";
  const message = (error as AuthError).message || "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/cancelled-popup-request":
      return "Sign-in request was cancelled. Please try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Console. Go to Firebase Console -> Authentication -> Settings -> Authorized domains and add this domain.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
    case "auth/operation-not-allowed":
      return "This sign-in provider is not enabled in Firebase Console. Please enable Email/Password or Google under Authentication -> Sign-in method.";
    default:
      return message || "Authentication failed. Please try again.";
  }
}

/**
 * Sign in using Google OAuth Popup
 */
export async function signInWithGoogle(): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { ok: true, user: result.user };
  } catch (error) {
    const err = error as AuthError;
    // If popup is blocked, attempt redirect fallback
    if (err.code === "auth/popup-blocked") {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { ok: true };
      } catch (redirectErr) {
        return { ok: false, error: formatAuthError(redirectErr) };
      }
    }
    return { ok: false, error: formatAuthError(error) };
  }
}

/**
 * Log in with Email and Password
 */
export async function loginWithEmail(
  email: string,
  pass: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return { ok: true, user: cred.user };
  } catch (error) {
    return { ok: false, error: formatAuthError(error) };
  }
}

/**
 * Create new account with Email and Password
 */
export async function signUpWithEmail(
  name: string,
  email: string,
  pass: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (cred.user && name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    return { ok: true, user: cred.user };
  } catch (error) {
    return { ok: false, error: formatAuthError(error) };
  }
}

/**
 * Send password reset email
 */
export async function sendResetEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { ok: true };
  } catch (error) {
    return { ok: false, error: formatAuthError(error) };
  }
}

/**
 * Log out current Firebase user
 */
export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Firebase sign out error:", err);
  }
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function onFirebaseAuthStateChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
