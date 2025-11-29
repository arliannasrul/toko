'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, Auth } from 'firebase/auth';
import { getFirebase } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    // DIAGNOSTIC LOG: This will print the config to your browser's developer console.
    console.error("FIREBASE CONFIG BEING USED:", firebaseConfig);

    if (!firebaseConfig.apiKey) {
      console.error("Firebase API key is missing. Please check your .env file and restart the server.");
      toast({
        title: 'Configuration Error',
        description: 'Firebase API Key is missing. The app will not work correctly.',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    const { auth: firebaseAuth } = getFirebase(firebaseConfig);
    setAuth(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });

    getRedirectResult(firebaseAuth)
      .then((result) => {
        if (result) {
          toast({
            title: 'Signed In',
            description: `Welcome, ${result.user.displayName}!`,
          });
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result: ", error);
        toast({
          title: 'Login Failed',
          description: 'There was an error completing the sign-in process. Please try again.',
          variant: 'destructive',
        });
      });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    if (!auth) {
      toast({
        title: 'Authentication not ready',
        description: 'Firebase is not initialized yet. Please wait a moment and try again.',
        variant: 'destructive'
      });
      console.error("Firebase auth is not initialized.");
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        title: 'Login Failed',
        description: error.message || 'There was an error trying to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const logout = async () => {
    if (!auth) {
      console.error("Firebase auth is not initialized.");
      return;
    }
    try {
      await signOut(auth);
      router.push('/');
    } catch (error: any) {
      console.error("Error signing out: ", error);
       toast({
        title: 'Logout Failed',
        description: error.message || 'There was an error trying to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const value = { user, loading, signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
