"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

export function UpdateBanner() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const regPromise = navigator.serviceWorker.getRegistration();
    regPromise.then((reg) => {
      if (!reg) return;
      if (reg.waiting) {
        setShowUpdate(true);
      }
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setShowUpdate(true);
          }
        });
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      setShowUpdate(false);
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.waiting?.postMessage("skipWaiting");
    });
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-[var(--card)] border border-[var(--border)] px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3">
      <span className="text-sm text-[var(--foreground)]">Update available</span>
      <Button size="sm" onClick={handleUpdate}>
        <RefreshCw className="h-4 w-4 mr-1" />
        Update
      </Button>
    </div>
  );
}
