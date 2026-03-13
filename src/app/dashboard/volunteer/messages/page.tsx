"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";

interface Conversation {
  userId: string;
  email: string;
  name?: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

function MessagesContent() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const withUserId = searchParams.get("with");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    if (!loading && (!user || (user.role !== "volunteer" && user.role !== "innovator"))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (firebaseUser?.uid) {
      fetch(`/api/messages/conversations?firebaseUid=${firebaseUser.uid}`)
        .then((r) => r.json())
        .then((data) => setConversations(data.conversations || []))
        .catch(() => {});
    }
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (firebaseUser?.uid && withUserId) {
      fetch(`/api/messages?firebaseUid=${firebaseUser.uid}&with=${withUserId}`)
        .then((r) => r.json())
        .then((data) => {
          setMessages(data.messages || []);
          const conv = conversations.find((c) => c.userId === withUserId);
          if (conv) setSelectedName(conv.name || conv.email);
        })
        .catch(() => {});
      fetch("/api/messages/read-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: firebaseUser.uid, withUserId }),
      }).catch(() => {});
    } else {
      setMessages([]);
      setSelectedName("");
    }
  }, [firebaseUser?.uid, withUserId, conversations]);

  const sendMessage = async () => {
    if (!firebaseUser || !withUserId || !content.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          receiverUserId: withUserId,
          content: content.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setContent("");
      }
    } catch {
      //
    } finally {
      setSending(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="grid md:grid-cols-[280px_1fr] gap-4 min-h-[400px]">
          <Card>
            <CardContent className="pt-4 p-0">
              {conversations.length === 0 ? (
                <p className="p-4 text-sm text-[var(--foreground-secondary)]">No conversations yet.</p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {conversations.map((c) => (
                    <button
                      key={c.userId}
                      type="button"
                      onClick={() => router.push(`/dashboard/volunteer/messages?with=${c.userId}`)}
                      className={`w-full text-left p-4 hover:bg-[var(--background-secondary)] ${
                        withUserId === c.userId ? "bg-[var(--accent)]/10" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{c.name || c.email}</p>
                        {c.unread > 0 && (
                          <span className="shrink-0 bg-[var(--accent)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] truncate mt-0.5">{c.lastMessage}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex flex-col h-full min-h-[360px]">
              {withUserId ? (
                <>
                  <p className="font-medium mb-4">{selectedName || "Conversation"}</p>
                  <div className="flex-1 space-y-3 overflow-y-auto min-h-[200px]">
                    {messages.map((m: Record<string, unknown>) => {
                      const isMe = (m.senderId as { _id?: { toString: () => string } })?._id?.toString() === user?.id;
                      return (
                        <div
                          key={String(m._id)}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              isMe ? "bg-[var(--accent)] text-white" : "bg-[var(--background-secondary)]"
                            }`}
                          >
                            {String(m.content)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Input
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={sending || !content.trim()}>
                      Send
                    </Button>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="Select a conversation"
                  description="Choose a conversation from the list or use Message NGO on an opportunity or event."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default function VolunteerMessagesPage() {
  return (
    <Suspense fallback={<AppLayout><div className="animate-pulse h-64" /></AppLayout>}>
      <MessagesContent />
    </Suspense>
  );
}
