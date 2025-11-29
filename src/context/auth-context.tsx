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
    const { auth: firebaseAuth } = getFirebase();
    setAuth(firebaseAuth);

    if (firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
        setLoading(false);
      });

      getRedirectResult(firebaseAuth)
        .then((result) => {
          if (result) {
            // User just signed in.
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
    } else {
      setLoading(false);
    }
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
    provider.addScope('profile');
    provider.addScope('email');
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
