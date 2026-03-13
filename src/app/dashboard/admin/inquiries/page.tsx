"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminInquiriesPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    fetch(`/api/admin/inquiries?firebaseUid=${firebaseUser.uid}`)
      .then((r) => r.json())
      .then((data) => setInquiries(data.inquiries || []))
      .catch(() => {});
  }, [firebaseUser?.uid]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        {inquiries.length === 0 ? (
          <p className="text-[var(--foreground-secondary)]">No inquiries yet.</p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq: Record<string, unknown>) => (
              <Card key={String(inq._id)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{String(inq.name)}</h3>
                      <p className="text-sm text-[var(--foreground-secondary)]">{String(inq.email)}</p>
                      <p className="mt-2">{String(inq.message)}</p>
                      <Badge variant="secondary" className="mt-2">{String(inq.type)}</Badge>
                      {(inq.ngoId as Record<string, unknown> | null) && <p className="text-xs mt-1">NGO: {(inq.ngoId as Record<string, unknown>).name as string}</p>}
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {new Date(String(inq.createdAt)).toLocaleDateString()}
                    </p>
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
