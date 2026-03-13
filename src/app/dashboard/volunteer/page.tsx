"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, Calendar } from "lucide-react";

export default function VolunteerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && user.role !== "volunteer" && user.role !== "innovator") {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Link href="/opportunities" className="flex items-center gap-2 text-[var(--accent)]">
                <Heart className="h-5 w-5" />
                Browse Opportunities
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Find volunteer opportunities from verified NGOs.
              </p>
              <Button asChild className="mt-2">
                <Link href="/opportunities">View all</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Link href="/events" className="flex items-center gap-2 text-[var(--accent)]">
                <Calendar className="h-5 w-5" />
                Browse Events
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Join events and campaigns in your area.
              </p>
              <Button asChild className="mt-2">
                <Link href="/events">View all</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">My Events</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--foreground-secondary)]">Events you&apos;ve registered for.</p>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/dashboard/volunteer/events">View my events</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">My Profile</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--foreground-secondary)]">Manage your skills, interests, and experience.</p>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/dashboard/volunteer/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
