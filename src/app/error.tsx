"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-[var(--foreground-secondary)] mt-2 max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </AppLayout>
  );
}
