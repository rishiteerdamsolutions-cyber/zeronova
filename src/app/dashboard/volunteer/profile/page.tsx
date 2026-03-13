"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FormData {
  displayName: string;
  skills: string;
  interests: string;
  experience: string;
}

export default function VolunteerProfileEditPage() {
  const { user, firebaseUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (user && user.role !== "volunteer" && user.role !== "innovator") router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/volunteer/profile?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.profile;
        if (p) {
          reset({
            displayName: String(p.displayName || ""),
            skills: Array.isArray(p.skills) ? p.skills.join(", ") : "",
            interests: Array.isArray(p.interests) ? p.interests.join(", ") : "",
            experience: String(p.experience || ""),
          });
        }
      })
      .catch(() => {});
  }, [user?.id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!firebaseUser) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/volunteer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          displayName: data.displayName.trim() || undefined,
          skills: data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          interests: data.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          experience: data.experience.trim() || "",
        }),
      });
      if (res.ok) {
        setMessage("Profile updated successfully.");
        toast("Profile updated.", "success");
      } else {
        const d = await res.json();
        setMessage(d.error || "Failed to update.");
      }
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Skills, Interests & Experience</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Help NGOs find the right volunteers for their opportunities.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.includes("success")
                      ? "bg-[var(--success)]/20 text-[var(--success)]"
                      : "bg-[var(--error-bg)] text-[var(--error)]"
                  }`}
                >
                  {message}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <Input {...register("displayName")} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
                <Input {...register("skills")} placeholder="e.g. Teaching, Communication, Event planning" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interests (comma-separated)</label>
                <Input {...register("interests")} placeholder="e.g. Education, Environment, Health" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <Textarea {...register("experience")} placeholder="Brief description of your volunteer experience..." rows={4} />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
