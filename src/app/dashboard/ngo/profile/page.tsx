"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";

export default function NgoProfileEditPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "" as string | null,
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (user && user.role !== "ngo") router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.profileRef) return;
    fetch(`/api/ngo/profile?id=${user.profileRef}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ngo) {
          setForm({
            name: data.ngo.name || "",
            description: data.ngo.description || "",
            email: data.ngo.contactDetails?.email || "",
            phone: data.ngo.contactDetails?.phone || "",
            address: data.ngo.contactDetails?.address || "",
            logoUrl: data.ngo.logoUrl || null,
          });
        }
      })
      .catch(() => {});
  }, [user?.profileRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      const res = await fetch("/api/ngo/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          name: form.name,
          description: form.description,
          contactDetails: { email: form.email, phone: form.phone, address: form.address },
          logoUrl: form.logoUrl,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <ImageUpload
              folder="ngo-logos"
              currentUrl={form.logoUrl}
              onUpload={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
