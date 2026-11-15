import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCwfjAWuWmCPUK0HBljfC6pItoIoExo2Ag",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mentormindai-137a0.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://mentormindai-137a0-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mentormindai-137a0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mentormindai-137a0.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "739010931594",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:739010931594:web:41ef3821c19ec158f43673",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BC9LT2MHG8",
};

// Initialize Firebase as a singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
export const rtdb: Database = getDatabase(app);

// Initialize Cloud Firestore
export const firestore: Firestore = getFirestore(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Firebase Analytics (Safe for SSR / client-only)
let analyticsInstance: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported or blocked
  });
}

export const getFirebaseAnalytics = () => analyticsInstance;

