"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NgoOpportunitiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!user?.profileRef) return;
    fetch(`/api/ngo/opportunities?ngoId=${user.profileRef}`)
      .then((r) => r.json())
      .then((data) => setOpportunities(data.opportunities || []))
      .catch(() => {});
  }, [user?.profileRef]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ngo")) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Opportunities</h1>
          <Button asChild>
            <Link href="/dashboard/ngo/opportunities/new">Create</Link>
          </Button>
        </div>
        {opportunities.length === 0 ? (
          <EmptyState
            title="No opportunities yet"
            description="Create your first volunteer opportunity."
            actionLabel="Create opportunity"
            actionHref="/dashboard/ngo/opportunities/new"
          />
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp: Record<string, unknown>) => (
              <Card key={String(opp._id)}>
                <CardContent className="pt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{String(opp.title)}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">{String(opp.category)}</p>
                  </div>
                  <Link href={`/opportunities/${String(opp._id)}`} className="text-[var(--accent)] text-sm">
                    View
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
