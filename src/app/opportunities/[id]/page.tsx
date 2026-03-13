"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function OpportunityDetailPage() {
  const params = useParams();
  const [opp, setOpp] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/opportunities/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOpp(data.opportunity);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading || !opp) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--border)] rounded w-3/4" />
          <div className="h-4 bg-[var(--border)] rounded w-full" />
        </div>
      </AppLayout>
    );
  }

  const ngo = opp.ngoId as Record<string, unknown> | undefined;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Badge className="mb-2">{String(opp.category)}</Badge>
          {ngo?.verificationStatus === "approved" && (
            <Badge className="ml-2 bg-[var(--success)]/20 text-[var(--success)]">Verified</Badge>
          )}
          <h1 className="text-2xl font-bold mt-2">{String(opp.title)}</h1>
          <p className="text-[var(--foreground-secondary)] mt-2">{String(opp.description)}</p>
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
                  <Link
                    href={`/ngo/${String(ngo._id)}`}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/opportunities/${params.id}/express-interest`}>Express Interest</Link>
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
