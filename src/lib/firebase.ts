'use client';

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

async function getFirebaseConfig(): Promise<FirebaseOptions | null> {
    try {
        const response = await fetch('/api/init');
        if (!response.ok) {
            throw new Error('Failed to fetch Firebase config');
        }
        const firebaseConfig = await response.json();

        if (!firebaseConfig.apiKey) {
            console.error("Firebase config is missing from API.");
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
    return { app, auth, firestore };
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
  firestore = getFirestore(app);

  return { app, auth, firestore };
}


export function getFirebase() {
  if (!app || !auth || !firestore) {
    // This should not happen on the client if initialization is done correctly.
     throw new Error("Firebase app could not be initialized.");
  }

  return { app, auth, firestore };
}
