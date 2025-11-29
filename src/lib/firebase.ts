import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

// This function now accepts a config object.
export function getFirebase(config: object) {
  if (typeof window !== 'undefined') {
    if (!app) {
      app = getApps().length ? getApp() : initializeApp(config);
      auth = getAuth(app);
    }
    return { app, auth };
  }
  // Return undefined on the server
  return { app: undefined, auth: undefined };
}
