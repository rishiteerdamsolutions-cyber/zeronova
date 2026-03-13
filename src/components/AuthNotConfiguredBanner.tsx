"use client";

import { isFirebaseReady } from "@/lib/firebase";

export function AuthNotConfiguredBanner() {
  if (isFirebaseReady()) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm">
      <strong>Auth not configured.</strong> Add Firebase environment variables (NEXT_PUBLIC_FIREBASE_*) to enable login and registration. Public pages (opportunities, events, impact lab) work without auth.
    </div>
  );
}
