"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw, Check } from "lucide-react";

type BannerState = "hidden" | "update-available" | "updating" | "updated";

export function UpdateBanner() {
  const [state, setState] = useState<BannerState>("hidden");

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const checkForUpdate = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) setState("update-available");
    };

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      checkForUpdate(reg);
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setState("update-available");
          }
        });
      });
    });

    const onControllerChange = () => {
      setState("updated");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  const handleUpdate = () => {
    setState("updating");
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.waiting?.postMessage("skipWaiting");
    });
  };

  if (state === "hidden") return null;

  if (state === "updated") {
    return (
      <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-[var(--success-bg)] border border-[var(--success)]/30 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-[var(--success)]">
        <Check className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">Updated! Refreshing…</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-[var(--card)] border border-[var(--border)] px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3">
      <span className="text-sm text-[var(--foreground)]">Update available</span>
      <Button size="sm" onClick={handleUpdate} disabled={state === "updating"}>
        <RefreshCw className={`h-4 w-4 mr-1 ${state === "updating" ? "animate-spin" : ""}`} />
        {state === "updating" ? "Updating…" : "Update"}
      </Button>
    </div>
  );
}
