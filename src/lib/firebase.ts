'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { FirebaseOptions } from "firebase/app";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebase(config: FirebaseOptions) {
  if (app && auth) {
    return { app, auth };
  }

  if (getApps().length === 0) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }
  auth = getAuth(app);

  return { app, auth };
}
