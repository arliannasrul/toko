'use client';

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

async function getFirebaseConfig(): Promise<FirebaseOptions | null> {
    try {
        // In a real app, you'd fetch this from a secure API endpoint.
        // For this example, we'll use environment variables directly,
        // but ensure they are prefixed with NEXT_PUBLIC_.
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        if (!firebaseConfig.apiKey) {
            console.error("Firebase config is missing. Check your .env.local file.");
            return null;
        }
        return firebaseConfig;

    } catch (error) {
        console.error("Failed to load Firebase config:", error);
        return null;
    }
}


export async function initializeFirebaseClient() {
  if (app) {
    return { app, auth };
  }

  const firebaseConfig = await getFirebaseConfig();

  if (!firebaseConfig) {
      throw new Error("Firebase config not found");
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);

  return { app, auth };
}


export function getFirebase() {
  if (!app || !auth) {
    // This should not happen on the client if initialization is done correctly.
     throw new Error("Firebase app could not be initialized.");
  }

  return { app, auth };
}
