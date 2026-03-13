"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MessageCircle, Handshake, FileText } from "lucide-react";

export default function NgoDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && user.role !== "ngo") {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">NGO Dashboard</h1>
        <Card className="border-[var(--accent)]/30">
          <CardContent className="pt-4">
            <p className="text-sm text-[var(--foreground-secondary)]">
              Your NGO is under verification. You can create opportunities and events; they will be visible after admin approval.
            </p>
            <Badge variant="secondary" className="mt-2">Pending verification</Badge>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Link href="/dashboard/ngo/opportunities" className="flex items-center gap-2 text-[var(--accent)]">
                <Heart className="h-5 w-5" />
                My Opportunities
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">Create and manage volunteer opportunities.</p>
              <Button asChild className="mt-2">
                <Link href="/dashboard/ngo/opportunities/new">Create opportunity</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Link href="/dashboard/ngo/events" className="flex items-center gap-2 text-[var(--accent)]">
                <Calendar className="h-5 w-5" />
                My Events
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">Create and manage events.</p>
              <Button asChild className="mt-2">
                <Link href="/dashboard/ngo/events/new">Create event</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Link href="/dashboard/ngo/collaboration" className="flex items-center gap-2 text-[var(--accent)]">
                <Handshake className="h-5 w-5" />
                Collaboration Hub
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">Post partnership opportunities.</p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/dashboard/ngo/collaboration">Manage posts</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Link href="/dashboard/ngo/documents" className="flex items-center gap-2 text-[var(--accent)]">
                <FileText className="h-5 w-5" />
                Documents
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">Upload & track verification documents.</p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/dashboard/ngo/documents">Manage documents</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Link href="/dashboard/ngo/inbox" className="flex items-center gap-2 text-[var(--accent)]">
                <MessageCircle className="h-5 w-5" />
                Inbox
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-secondary)]">Messages from volunteers and inquiries.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
