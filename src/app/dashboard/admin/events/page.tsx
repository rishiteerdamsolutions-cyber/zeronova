"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminEventsPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/events?status=pending&limit=100")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => {});
  }, []);

  const handleApprove = async (id: string, action: string) => {
    if (!firebaseUser) return;
    const res = await fetch(`/api/events/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseUid: firebaseUser.uid, action }),
    });
    if (res.ok) setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Approve Events</h1>
        {events.length === 0 ? (
          <p className="text-[var(--foreground-secondary)]">No pending events.</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev: Record<string, unknown>) => (
              <Card key={String(ev._id)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{String(ev.title)}</h3>
                      <p className="text-sm text-[var(--foreground-secondary)]">
                        {new Date(String(ev.date)).toLocaleDateString()} · {String(ev.location)}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">{(ev.ngoId as Record<string, unknown>)?.name as string}</p>
                      <Badge variant="secondary" className="mt-2">{String(ev.status)}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(String(ev._id), "approve")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleApprove(String(ev._id), "reject")}>
                        Reject
                      </Button>
                    </div>
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
