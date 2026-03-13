"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ImpactLabSubmitPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/impact-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          title: form.title,
          description: form.description,
          category: form.category,
          submitterRole: user?.role || "volunteer",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/impact-lab");
      router.refresh();
    } catch {
      alert("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Submit an Idea</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={6} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category (optional)</label>
            <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
