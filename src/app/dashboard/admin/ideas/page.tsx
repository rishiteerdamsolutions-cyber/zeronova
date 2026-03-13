"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminIdeasPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    fetch(`/api/admin/ideas?firebaseUid=${firebaseUser.uid}`)
      .then((r) => r.json())
      .then((data) => setIdeas(data.ideas || []))
      .catch(() => {});
  }, [firebaseUser?.uid]);

  const handleReview = async (id: string, action: string) => {
    if (!firebaseUser) return;
    const res = await fetch(`/api/admin/ideas/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseUid: firebaseUser.uid, action }),
    });
    if (res.ok) setIdeas((prev) => prev.filter((i) => i._id !== id));
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Impact Lab Ideas</h1>
        {ideas.length === 0 ? (
          <p className="text-[var(--foreground-secondary)]">No pending ideas.</p>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea: Record<string, unknown>) => (
              <Card key={String(idea._id)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{String(idea.title)}</h3>
                      <p className="text-sm text-[var(--foreground-secondary)] mt-1">{String(idea.description)}</p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-2">{String(idea.submitterRole)} · {(idea.submitterId as Record<string, unknown>)?.email as string}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReview(String(idea._id), "approve")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReview(String(idea._id), "reject")}>
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
