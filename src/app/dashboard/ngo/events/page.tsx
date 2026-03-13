"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NgoEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!user?.profileRef) return;
    fetch(`/api/ngo/events?ngoId=${user.profileRef}`)
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => {});
  }, [user?.profileRef]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ngo")) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Events</h1>
          <Button asChild>
            <Link href="/dashboard/ngo/events/new">Create</Link>
          </Button>
        </div>
        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Create your first event."
            actionLabel="Create event"
            actionHref="/dashboard/ngo/events/new"
          />
        ) : (
          <div className="space-y-4">
            {events.map((ev: Record<string, unknown>) => (
              <Card key={String(ev._id)}>
                <CardContent className="pt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{String(ev.title)}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {new Date(String(ev.date)).toLocaleDateString()} · {String(ev.location)}
                    </p>
                    <Badge variant={ev.status === "approved" ? "success" : "secondary"} className="mt-1">
                      {String(ev.status)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/ngo/events/${ev._id}`} className="text-[var(--accent)] text-sm">
                      Volunteers
                    </Link>
                    <Link href={`/events/${String(ev._id)}`} className="text-[var(--accent)] text-sm">
                      View
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
