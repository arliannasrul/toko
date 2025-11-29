'use client';

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

// This function can be called multiple times, it will only initialize once.
export function getFirebase(config: FirebaseOptions) {
  if (app) {
    return { app, auth: auth!, firestore: firestore! };
  }

  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(config);
  }
  
  auth = getAuth(app);
  firestore = getFirestore(app);

  return { app, auth, firestore };
}

// This function should only be called on the client after initialization
export function getFirebaseClient() {
  if (!app || !auth || !firestore) {
    throw new Error('Firebase has not been initialized. Please call getFirebase with config first.');
  }
  return { app, auth, firestore };
}
