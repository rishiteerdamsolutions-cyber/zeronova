import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-[var(--accent)]">404</h1>
        <h2 className="text-xl font-semibold mt-4">Page not found</h2>
        <p className="text-[var(--foreground-secondary)] mt-2 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
