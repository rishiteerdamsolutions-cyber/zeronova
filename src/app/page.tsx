import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center text-center py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          Discover. Volunteer. Impact.
        </h1>
        <p className="text-[var(--foreground-secondary)] max-w-xl mb-8">
          Connect with NGOs and social initiatives. Find volunteer opportunities, join events, and make a difference.
        </p>
        <Button asChild size="lg">
          <Link href="/opportunities">Browse Opportunities</Link>
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]">
            <h3 className="font-semibold mb-2">1. Discover</h3>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Browse volunteer opportunities and events from verified NGOs.
            </p>
          </div>
          <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]">
            <h3 className="font-semibold mb-2">2. Join</h3>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Express interest or register for events. Connect with causes you care about.
            </p>
          </div>
          <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]">
            <h3 className="font-semibold mb-2">3. Impact</h3>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Contribute to social good. Share ideas in the Impact Lab.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
