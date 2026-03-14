"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

export type UserRole = "admin" | "ngo" | "volunteer" | "innovator";

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  profileRef?: string;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AppUser | null>;
  signUp: (email: string, password: string, role: UserRole, extra?: Record<string, unknown>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFromDb = async (uid: string): Promise<AppUser | null> => {
    try {
      const res = await fetch(`/api/auth/user?uid=${uid}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  };

  const refreshUser = async () => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) {
      setUser(null);
      setFirebaseUser(null);
      return;
    }
    const appUser = await fetchUserFromDb(auth.currentUser.uid);
    setUser(appUser);
    setFirebaseUser(auth.currentUser);
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setUser(null);
      setFirebaseUser(null);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const appUser = await fetchUserFromDb(fbUser.uid);
      setUser(appUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string): Promise<AppUser | null> => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Sign in is temporarily unavailable.");
    await signInWithEmailAndPassword(auth, email, password);
    const appUser = await fetchUserFromDb(auth.currentUser!.uid);
    setUser(appUser);
    setFirebaseUser(auth.currentUser);
    return appUser;
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole,
    extra?: Record<string, unknown>
  ) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Registration is temporarily unavailable.");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseUid: cred.user.uid,
        email,
        role,
        ...extra,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Registration failed");
    }
    await refreshUser();
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
