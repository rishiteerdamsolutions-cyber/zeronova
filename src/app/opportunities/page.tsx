"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { OpportunityCard } from "@/components/ui/OpportunityCard";
import { FilterStrip } from "@/components/ui/FilterStrip";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "teaching", label: "Teaching" },
  { id: "environment", label: "Environment" },
  { id: "health", label: "Health" },
  { id: "awareness", label: "Awareness" },
  { id: "other", label: "Other" },
];

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const ngoParam = searchParams.get("ngo");
  const [opportunities, setOpportunities] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (ngoParam) params.set("ngo", ngoParam);
    params.set("page", "1");
    fetch(`/api/opportunities?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOpportunities(data.opportunities || []);
        setHasMore((data.opportunities?.length || 0) >= (data.limit || 20));
        setPage(1);
      })
      .finally(() => setLoading(false));
  }, [category, ngoParam]);

  const loadMore = () => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (ngoParam) params.set("ngo", ngoParam);
    params.set("page", String(page + 1));
    fetch(`/api/opportunities?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOpportunities((prev) => [...prev, ...(data.opportunities || [])]);
        setHasMore((data.opportunities?.length || 0) >= (data.limit || 20));
        setPage((p) => p + 1);
      });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Volunteer Opportunities</h1>
        <FilterStrip options={CATEGORIES} activeId={category} onSelect={setCategory} />
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState
            title="No opportunities yet"
            description="Check back soon or register your NGO to post opportunities."
            actionLabel="Register NGO"
            actionHref="/register"
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp: Record<string, unknown>) => (
                <OpportunityCard
                  key={String(opp._id)}
                  id={String(opp._id)}
                  title={String(opp.title)}
                  description={String(opp.description)}
                  category={String(opp.category)}
                  ngoName={(opp.ngoId as Record<string, unknown>)?.name as string}
                  ngoLogo={(opp.ngoId as Record<string, unknown>)?.logoUrl as string}
                  verified={(opp.ngoId as Record<string, unknown>)?.verificationStatus === "approved"}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  className="text-[var(--accent)] font-medium hover:underline"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Volunteer Opportunities</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </AppLayout>
    }>
      <OpportunitiesContent />
    </Suspense>
  );
}
