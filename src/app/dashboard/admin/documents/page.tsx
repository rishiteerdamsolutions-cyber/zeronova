"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink } from "lucide-react";

export default function AdminDocumentsPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (firebaseUser?.uid) {
      const params = new URLSearchParams({ firebaseUid: firebaseUser.uid });
      if (filter) params.set("status", filter);
      fetch(`/api/admin/documents?${params}`)
        .then((r) => r.json())
        .then((data) => setDocuments(data.documents || []))
        .catch(() => {});
    }
  }, [firebaseUser?.uid, filter]);

  const handleVerify = async (id: string, action: string) => {
    if (!firebaseUser) return;
    const res = await fetch(`/api/admin/documents/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseUid: firebaseUser.uid, action }),
    });
    if (res.ok) setDocuments((prev) => prev.filter((d) => d._id !== id));
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">NGO Documents</h1>
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
        {documents.length === 0 ? (
          <p className="text-[var(--foreground-secondary)]">No documents in this category.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc: Record<string, unknown>) => (
              <Card key={String(doc._id)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-[var(--foreground-muted)]" />
                      <div>
                        <p className="font-medium">{String(doc.docType)}</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                          {(doc.ngoId as Record<string, unknown>)?.name as string}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {String(doc.verificationStatus)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={String(doc.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline flex items-center gap-1 text-sm"
                      >
                        View <ExternalLink className="h-4 w-4" />
                      </a>
                      {doc.verificationStatus === "pending" && (
                        <>
                          <Button size="sm" onClick={() => handleVerify(String(doc._id), "approve")}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleVerify(String(doc._id), "reject")}>
                            Reject
                          </Button>
                        </>
                      )}
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
