"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewEventPage() {
  const { firebaseUser, user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "" });

  if (!loading && (!user || user.role !== "ngo")) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/dashboard/ngo/events");
      router.refresh();
    } catch {
      alert("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="e.g. Tree plantation drive" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} required placeholder="e.g. Hyderabad" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create"}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
