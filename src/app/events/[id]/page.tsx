"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDetailPage() {
  const params = useParams();
  const { user, firebaseUser } = useAuth();
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then((r) => r.json())
      .then((data) => setEvent(data.event))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (firebaseUser?.uid && event && event.status === "approved") {
      fetch(`/api/events/${params.id}/register?firebaseUid=${firebaseUser.uid}`)
        .then((r) => r.json())
        .then((data) => setRegistered(data.registered === true))
        .catch(() => {});
    }
  }, [firebaseUser?.uid, params.id, event]);

  const handleRegister = async () => {
    if (!firebaseUser) return;
    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${params.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: firebaseUser.uid }),
      });
      const data = await res.json();
      if (res.ok) setRegistered(true);
      else if (res.status === 409) setRegistered(true);
      else alert(data.error || "Failed to register");
    } catch {
      alert("Failed to register");
    } finally {
      setRegistering(false);
    }
  };

  if (loading || !event) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--border)] rounded w-3/4" />
        </div>
      </AppLayout>
    );
  }

  const ngo = event.ngoId as Record<string, unknown> | undefined;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Badge className="mb-2">{String(event.status)}</Badge>
          {ngo?.verificationStatus === "approved" && (
            <Badge className="ml-2 bg-[var(--success)]/20 text-[var(--success)]">Verified NGO</Badge>
          )}
          <h1 className="text-2xl font-bold mt-2">{String(event.title)}</h1>
          <p className="text-[var(--foreground-secondary)] mt-2">
            {new Date(String(event.date)).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-[var(--foreground-secondary)]">{String(event.location)}</p>
          <p className="mt-4">{String(event.description)}</p>
        </div>
        {ngo && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                {ngo.logoUrl ? (
                  <img src={String(ngo.logoUrl)} alt={String(ngo.name)} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center">
                    🌱
                  </div>
                )}
                <div>
                  <p className="font-medium">{String(ngo.name)}</p>
                  <Link href={`/ngo/${String(ngo._id)}`} className="text-sm text-[var(--accent)] hover:underline">
                    View profile
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-wrap gap-3">
          {event.status === "approved" &&
            user &&
            (user.role === "volunteer" || user.role === "innovator") && (
              registered ? (
                <Badge className="bg-[var(--success)]/20 text-[var(--success)]">Registered</Badge>
              ) : (
                <Button onClick={handleRegister} disabled={registering}>
                  {registering ? "Registering..." : "Register"}
                </Button>
              )
            )}
          <Button asChild variant={registered ? "outline" : "default"}>
            <Link href={`/events/${params.id}/express-interest`}>Express Interest</Link>
          </Button>
          {ngo?.userId ? (
            <Button asChild variant="outline">
              <Link href={`/dashboard/volunteer/messages?with=${String(ngo.userId)}`}>
                Message NGO
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
