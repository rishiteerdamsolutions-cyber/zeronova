"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function VolunteerMyEventsPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "volunteer" && user.role !== "innovator"))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (firebaseUser?.uid) {
      fetch(`/api/volunteer/events?firebaseUid=${firebaseUser.uid}`)
        .then((r) => r.json())
        .then((data) => setEvents(data.events || []))
        .catch(() => {});
    }
  }, [firebaseUser?.uid]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Register for events to see them here."
            actionLabel="Browse events"
            actionHref="/events"
          />
        ) : (
          <div className="space-y-4">
            {events.map((ev: Record<string, unknown>) => (
              <Card key={String(ev._id)}>
                <CardContent className="pt-4">
                  <Link href={`/events/${ev._id}`} className="block">
                    <h3 className="font-semibold">{String(ev.title)}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {new Date(String(ev.date)).toLocaleDateString()} · {String(ev.location)}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">
                      {(ev.ngoId as Record<string, unknown>)?.name as string}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
