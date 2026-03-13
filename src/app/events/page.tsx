"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EventsPage() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events?status=approved")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Events</h1>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Check back soon for upcoming events."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: Record<string, unknown>) => (
              <Link key={String(event._id)} href={`/events/${String(event._id)}`}>
                <Card className="hover:border-[var(--accent)] transition-colors">
                  <CardContent className="pt-4">
                    <Badge className="mb-2">Approved</Badge>
                    <h3 className="font-semibold line-clamp-1">{String(event.title)}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                      {new Date(String(event.date)).toLocaleDateString()} · {String(event.location)}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1 line-clamp-2">
                      {String(event.description)}
                    </p>
                    <p className="text-xs mt-2">{(event.ngoId as Record<string, unknown>)?.name as string}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
