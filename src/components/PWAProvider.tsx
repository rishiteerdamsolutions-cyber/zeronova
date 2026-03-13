"use client";

import { useEffect } from "react";
import { UpdateBanner } from "./UpdateBanner";
import { InstallPrompt } from "./InstallPrompt";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <>
      {children}
      <UpdateBanner />
      <InstallPrompt />
    </>
  );
}
