'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

let app: FirebaseApp | null = null;

export function getFirebase() {
  if (app) {
    return app;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key is missing. Check your .env file.');
  }

  if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
  
  if (!app) {
    // This should not happen on the client
    throw new Error("Firebase app could not be initialized.");
  }

  return app;
}
