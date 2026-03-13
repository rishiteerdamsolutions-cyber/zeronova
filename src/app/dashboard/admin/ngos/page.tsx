"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminNgosPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [ngos, setNgos] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    fetch(`/api/admin/ngos?firebaseUid=${firebaseUser.uid}&status=pending`)
      .then((r) => r.json())
      .then((data) => setNgos(data.ngos || []))
      .catch(() => {});
  }, [firebaseUser?.uid]);

  const handleVerify = async (id: string, action: string) => {
    if (!firebaseUser) return;
    const res = await fetch(`/api/admin/ngos/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseUid: firebaseUser.uid, action }),
    });
    if (res.ok) setNgos((prev) => prev.filter((n) => n._id !== id));
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Verify NGOs</h1>
        {ngos.length === 0 ? (
          <p className="text-[var(--foreground-secondary)]">No pending NGOs.</p>
        ) : (
          <div className="space-y-4">
            {ngos.map((ngo: Record<string, unknown>) => (
              <Card key={String(ngo._id)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{String(ngo.name)}</h3>
                      <p className="text-sm text-[var(--foreground-secondary)]">{String(ngo.description)}</p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-1">{(ngo.userId as Record<string, unknown>)?.email as string}</p>
                      <Badge variant="secondary" className="mt-2">{String(ngo.verificationStatus)}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleVerify(String(ngo._id), "approve")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleVerify(String(ngo._id), "reject")}>
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
