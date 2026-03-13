"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, MessageCircle, Lightbulb, FileText } from "lucide-react";

interface Summary {
  pendingNgos: number;
  pendingEvents: number;
  totalInquiries: number;
  pendingDocuments: number;
}

export default function AdminDashboardPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (firebaseUser?.uid) {
      fetch(`/api/admin/summary?firebaseUid=${firebaseUser.uid}`)
        .then((r) => r.json())
        .then((data) => setSummary(data))
        .catch(() => {});
    }
  }, [firebaseUser?.uid]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium">Pending NGOs</span>
              <User className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary?.pendingNgos ?? "—"}</p>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/dashboard/admin/ngos">Manage NGOs</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium">Pending Events</span>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary?.pendingEvents ?? "—"}</p>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/dashboard/admin/events">Manage Events</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium">Total Inquiries</span>
              <MessageCircle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary?.totalInquiries ?? "—"}</p>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/dashboard/admin/inquiries">View Inquiries</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium">Pending Documents</span>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary?.pendingDocuments ?? "—"}</p>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/dashboard/admin/documents">Manage Documents</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium">Impact Lab</span>
              <Lightbulb className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/admin/ideas">Review Ideas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
