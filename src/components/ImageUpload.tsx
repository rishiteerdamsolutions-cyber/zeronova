"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { getFirebaseStorage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface ImageUploadProps {
  folder: string;
  onUpload: (url: string) => void;
  currentUrl?: string | null;
  className?: string;
}

export function ImageUpload({ folder, onUpload, currentUrl, className }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const storage = getFirebaseStorage();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!storage) {
      setError("Upload not available. Configure Firebase to enable.");
      return;
    }
    setError("");
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please upload JPEG, PNG, or WebP");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    setLoading(true);
    try {
      const filename = `${folder}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const storageRef = ref(storage!, filename);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!storage) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--background-secondary)]">
          <Upload className="h-8 w-8 text-[var(--foreground-muted)] mb-1" />
          <span className="text-xs text-[var(--foreground-muted)] text-center px-2">Configure Firebase to enable uploads</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {currentUrl ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="Uploaded"
            className="w-24 h-24 object-cover rounded-lg border border-[var(--border)]"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <Upload className="h-6 w-6 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
              disabled={loading}
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors">
          <Upload className="h-8 w-8 text-[var(--foreground-muted)] mb-1" />
          <span className="text-xs text-[var(--foreground-muted)]">
            {loading ? "Uploading..." : "Upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={loading}
          />
        </label>
      )}
      {error && <p className="text-sm text-[var(--error)] mt-1">{error}</p>}
    </div>
  );
}
