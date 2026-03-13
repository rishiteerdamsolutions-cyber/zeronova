"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CollaborationPostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/collaboration/${params.id}`)
      .then((r) => r.json())
      .then((data) => setPost(data.post))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading || !post) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--border)] rounded w-3/4" />
        </div>
      </AppLayout>
    );
  }

  const ngo = post.ngoId as Record<string, unknown> | undefined;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Badge className="mb-2">{String(post.type || "partnership")}</Badge>
          {ngo?.verificationStatus === "approved" && (
            <Badge className="ml-2 bg-[var(--success)]/20 text-[var(--success)]">Verified NGO</Badge>
          )}
          <h1 className="text-2xl font-bold mt-2">{String(post.title)}</h1>
          <p className="mt-4 whitespace-pre-wrap">{String(post.content)}</p>
        </div>
        {ngo && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                {ngo.logoUrl ? (
                  <img
                    src={String(ngo.logoUrl)}
                    alt={String(ngo.name)}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
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
      </div>
    </AppLayout>
  );
}
