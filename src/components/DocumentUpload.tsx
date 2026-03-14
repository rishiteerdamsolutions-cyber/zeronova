"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { getFirebaseStorage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface DocumentUploadProps {
  folder: string;
  onUpload: (url: string) => void;
  disabled?: boolean;
  label?: string;
}

export function DocumentUpload({ folder, onUpload, disabled, label = "Upload document" }: DocumentUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const storage = getFirebaseStorage();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!storage) {
      setError("Upload is temporarily unavailable.");
      return;
    }
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload PDF, JPEG, or PNG (max 5MB)");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File must be under 5MB");
      return;
    }
    setLoading(true);
    try {
      const filename = `${folder}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const storageRef = ref(storage!, filename);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!storage) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--background-secondary)] p-4">
          <FileText className="h-10 w-10 text-[var(--foreground-muted)] mb-2" />
          <span className="text-sm text-[var(--foreground-muted)] text-center">Upload unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors p-4">
        <FileText className="h-10 w-10 text-[var(--foreground-muted)] mb-2" />
        <span className="text-sm text-[var(--foreground-muted)] text-center">
          {loading ? "Uploading..." : label}
        </span>
        <span className="text-xs text-[var(--foreground-muted)] mt-1">PDF, JPEG, PNG (max 5MB)</span>
        <input
          type="file"
          accept=".pdf,image/jpeg,image/png"
          className="hidden"
          onChange={handleChange}
          disabled={loading || disabled}
        />
      </label>
      {error && <p className="text-sm text-[var(--error)] mt-2">{error}</p>}
    </div>
  );
}
