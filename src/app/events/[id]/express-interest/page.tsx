"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EventExpressInterestPage() {
  const params = useParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "volunteer",
          eventId: params.id,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push(`/events/${params.id}?submitted=1`);
      router.refresh();
    } catch {
      alert("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Express Interest</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4} />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
