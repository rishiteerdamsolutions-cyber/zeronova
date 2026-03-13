"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
import { Button } from "./ui/button";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as unknown as BeforeInstallPromptEvent;
      setDeferredPrompt(ev);
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-4 md:right-auto md:max-w-sm z-40 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-4 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--foreground)]">Install Zeronova</p>
        <p className="text-xs text-[var(--foreground-secondary)]">
          Add to home screen for quick access
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleInstall}>
          <Download className="h-4 w-4 mr-1" />
          Install
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDismiss} className="px-2">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
