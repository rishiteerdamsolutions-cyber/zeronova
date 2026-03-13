"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function CollaborationPage() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collaboration?limit=50")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Collaboration Hub</h1>
        <p className="text-[var(--foreground-secondary)]">
          Partnership announcements and shared initiatives from NGOs.
        </p>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="NGOs can post partnership announcements here."
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post: Record<string, unknown>) => (
              <Card key={String(post._id)}>
                <CardContent className="pt-4">
                  <Link href={`/collaboration/${post._id}`} className="block">
                    <Badge variant="secondary" className="mb-2">
                      {String(post.type || "partnership")}
                    </Badge>
                    <h3 className="font-semibold">{String(post.title)}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)] mt-1 line-clamp-2">
                      {String(post.content)}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-2">
                      {(post.ngoId as Record<string, unknown>)?.name as string}
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
