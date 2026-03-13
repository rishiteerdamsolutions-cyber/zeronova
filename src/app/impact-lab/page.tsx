"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ImpactLabPage() {
  const [ideas, setIdeas] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/impact-lab?status=approved")
      .then((r) => r.json())
      .then((data) => setIdeas(data.ideas || []))
      .catch(() => {});
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Impact Lab</h1>
        <p className="text-[var(--foreground-secondary)]">
          Social innovation ideas from our community.
        </p>
        {ideas.length === 0 ? (
          <EmptyState
            title="No ideas yet"
            description="Be the first to submit an idea. Login to submit."
            actionLabel="Submit idea"
            actionHref="/impact-lab/submit"
          />
        ) : (
          <div className="space-y-4">
            {ideas.map((idea: Record<string, unknown>) => (
              <Card key={String(idea._id)}>
                <CardContent className="pt-4">
                  <h3 className="font-semibold">{String(idea.title)}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)] mt-1 line-clamp-2">{String(idea.description)}</p>
                  {idea.category ? <span className="text-xs text-[var(--foreground-muted)]">{String(idea.category)}</span> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Button asChild variant="outline">
          <Link href="/impact-lab/submit">Submit your idea</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
