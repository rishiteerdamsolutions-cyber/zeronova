"use client";

import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState | null>(null);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    setState({ message, type });
  }, []);

  useEffect(() => {
    if (!state) return;
    const t = setTimeout(() => setState(null), 4000);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {state && (
        <div
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2"
          role="alert"
        >
          <span
            className={
              state.type === "success"
                ? "text-[var(--success)]"
                : state.type === "error"
                ? "text-[var(--error)]"
                : ""
            }
          >
            {state.message}
          </span>
        </div>
      )}
    </ToastContext.Provider>
  );
}
