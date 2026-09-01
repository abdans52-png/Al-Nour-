// Firebase configuration reading from environment variables or fallback
const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};

export const fallbackFirebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForPreviewAndLocalBuild12345",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "al-noureen-couture.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "al-noureen-couture",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "al-noureen-couture.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_DATABASE_ID || "(default)"
};


