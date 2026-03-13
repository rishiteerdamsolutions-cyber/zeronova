"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";

interface FormData {
  title: string;
  content: string;
  type: string;
}

export default function NgoCollaborationPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { type: "partnership" },
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "ngo")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.profileRef) {
      fetch(`/api/ngo/collaboration?ngoId=${user.profileRef}`)
        .then((r) => r.json())
        .then((data) => setPosts(data.posts || []))
        .catch(() => {});
    }
  }, [user?.profileRef]);

  const onSubmit = async (data: FormData) => {
    if (!firebaseUser) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          title: data.title,
          content: data.content,
          type: data.type || "partnership",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setPosts((prev) => [result.post, ...prev]);
        reset();
        setShowForm(false);
        setMessage("Post created.");
      } else {
        setMessage(result.error || "Failed to create.");
      }
    } catch {
      setMessage("Failed to create post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Collaboration Hub</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Create Post"}
          </Button>
        </div>
        {showForm && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold">New Partnership Post</h2>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Share partnership opportunities or initiatives with the community.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.includes("created")
                        ? "bg-[var(--success)]/20 text-[var(--success)]"
                        : "bg-[var(--error-bg)] text-[var(--error)]"
                    }`}
                  >
                    {message}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input {...register("title", { required: true })} placeholder="Partnership opportunity..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Input {...register("type")} placeholder="e.g. partnership, initiative" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea {...register("content", { required: true })} rows={5} placeholder="Describe your partnership or initiative..." />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Creating..." : "Create Post"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {posts.length === 0 && !showForm ? (
          <EmptyState
            title="No posts yet"
            description="Create a post to share partnership opportunities."
            actionLabel="Create post"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post: Record<string, unknown>) => (
              <Card key={String(post._id)}>
                <CardContent className="pt-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{String(post.title)}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)] line-clamp-2 mt-1">
                      {String(post.content)}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-2">
                      {String(post.type || "partnership")}
                    </p>
                  </div>
                  <Link href={`/collaboration/${post._id}`} className="text-[var(--accent)] text-sm">
                    View
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
