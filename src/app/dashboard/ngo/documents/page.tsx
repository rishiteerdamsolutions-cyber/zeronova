"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentUpload } from "@/components/DocumentUpload";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, ExternalLink } from "lucide-react";

export default function NgoDocumentsPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [docType, setDocType] = useState("registration_certificate");
  const [fileUrl, setFileUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "ngo")) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.profileRef) {
      fetch(`/api/ngo/documents?ngoId=${user.profileRef}`)
        .then((r) => r.json())
        .then((data) => setDocuments(data.documents || []))
        .catch(() => {});
    }
  }, [user?.profileRef]);

  const handleUploadComplete = (url: string) => {
    setFileUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !fileUrl) {
      setMessage("Please upload a document first.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/ngo/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          docType,
          fileUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments((prev) => [data.document, ...prev]);
        setFileUrl("");
        setShowForm(false);
        setMessage("Document submitted for review.");
      } else {
        setMessage(data.error || "Failed to submit.");
      }
    } catch {
      setMessage("Failed to submit document.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Documents</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Upload Document"}
          </Button>
        </div>
        {showForm && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Upload Document</h2>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Upload registration certificate, legal documents, or other verification docs. Admin will review.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.includes("submitted")
                        ? "bg-[var(--success)]/20 text-[var(--success)]"
                        : "bg-[var(--error-bg)] text-[var(--error)]"
                    }`}
                  >
                    {message}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Document Type</label>
                  <Input
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    placeholder="e.g. registration_certificate, legal_document"
                  />
                </div>
                <DocumentUpload
                  folder={`ngos/${user.profileRef}/documents`}
                  onUpload={handleUploadComplete}
                  disabled={saving}
                  label={fileUrl ? "Document ready - click Submit" : "Choose a file"}
                />
                <Button type="submit" disabled={saving || !fileUrl}>
                  {saving ? "Submitting..." : "Submit for Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {documents.length === 0 && !showForm ? (
          <EmptyState
            title="No documents yet"
            description="Upload registration certificate or legal documents for admin verification."
            actionLabel="Upload document"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="space-y-4">
            {documents.map((doc: Record<string, unknown>) => (
              <Card key={String(doc._id)}>
                <CardContent className="pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-[var(--foreground-muted)]" />
                    <div>
                      <p className="font-medium">{String(doc.docType)}</p>
                      <Badge
                        variant="secondary"
                        className={
                          doc.verificationStatus === "approved"
                            ? "bg-[var(--success)]/20 text-[var(--success)]"
                            : doc.verificationStatus === "rejected"
                            ? "bg-[var(--error)]/20 text-[var(--error)]"
                            : ""
                        }
                      >
                        {String(doc.verificationStatus)}
                      </Badge>
                    </div>
                  </div>
                  <a
                    href={String(doc.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
