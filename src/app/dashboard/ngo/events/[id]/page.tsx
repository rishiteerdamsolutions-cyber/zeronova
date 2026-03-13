"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NgoEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, firebaseUser, loading } = useAuth();
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [registrations, setRegistrations] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ngo")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then((r) => r.json())
      .then((data) => setEvent(data.event))
      .catch(() => {});
  }, [params.id]);

  useEffect(() => {
    if (firebaseUser?.uid && user?.profileRef) {
      fetch(`/api/events/${params.id}/registrations?firebaseUid=${firebaseUser.uid}`)
        .then((r) => r.json())
        .then((data) => setRegistrations(data.registrations || []))
        .catch(() => {});
    }
  }, [firebaseUser?.uid, params.id, user?.profileRef]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/ngo/events">← Back to events</Link>
        </Button>
        {event && (
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold">{String(event.title)}</h1>
              <p className="text-[var(--foreground-secondary)] mt-2">
                {new Date(String(event.date)).toLocaleDateString()} · {String(event.location)}
              </p>
              <p className="mt-2">{String(event.description)}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-4">Registered Volunteers ({registrations.length})</h2>
            {registrations.length === 0 ? (
              <p className="text-sm text-[var(--foreground-secondary)]">No volunteers registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {registrations.map((r: Record<string, unknown>, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{(r.email as string) || "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
