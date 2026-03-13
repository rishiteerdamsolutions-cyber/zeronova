"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VolunteerProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/volunteer/profile?id=${params.id}`)
      .then((r) => r.json())
      .then((data) => setProfile(data.profile))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--border)] rounded w-3/4" />
        </div>
      </AppLayout>
    );
  }

  const skills = (profile.skills as string[]) || [];
  const interests = (profile.interests as string[]) || [];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold">
              {String(profile.displayName || (profile.userId as Record<string, unknown>)?.email || "Volunteer")}
            </h1>
            {skills.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-medium text-[var(--foreground-secondary)] mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {interests.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-medium text-[var(--foreground-secondary)] mb-2">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((i: string) => (
                    <Badge key={i} variant="outline">{i}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.experience ? (
              <div className="mt-4">
                <h2 className="text-sm font-medium text-[var(--foreground-secondary)] mb-2">Experience</h2>
                <p className="text-sm">{String(profile.experience)}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
