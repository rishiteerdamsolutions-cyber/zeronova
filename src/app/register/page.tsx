"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthNotConfiguredBanner } from "@/components/AuthNotConfiguredBanner";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AppLayout showAuth={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <AuthNotConfiguredBanner />
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-[var(--foreground-secondary)] mb-8">Choose how you want to join</p>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Card
            className="cursor-pointer hover:border-[var(--accent)] transition-colors"
            onClick={() => router.push("/register/volunteer")}
          >
            <CardHeader>
              <User className="h-12 w-12 text-[var(--accent)] mb-2" />
              <CardTitle>Volunteer</CardTitle>
              <CardDescription>
                Find opportunities, join events, and contribute to social causes.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer hover:border-[var(--accent)] transition-colors"
            onClick={() => router.push("/register/ngo")}
          >
            <CardHeader>
              <Building2 className="h-12 w-12 text-[var(--accent)] mb-2" />
              <CardTitle>NGO Organization</CardTitle>
              <CardDescription>
                Register your NGO to post opportunities, create events, and connect with volunteers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <p className="mt-8 text-sm text-[var(--foreground-secondary)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AppLayout>
  );
}
