"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = ["Teaching", "Environment", "Health", "Awareness", "Other"];

export default function NewOpportunityPage() {
  const { firebaseUser, user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Teaching" });

  if (!loading && (!user || user.role !== "ngo")) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/dashboard/ngo/opportunities");
      router.refresh();
    } catch {
      alert("Failed to create opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Create Opportunity</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              placeholder="e.g. Teaching volunteers needed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Describe the opportunity..."
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
