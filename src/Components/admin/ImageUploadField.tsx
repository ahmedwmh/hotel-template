"use client";

import { useRef, useState } from "react";

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

type ImageUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Storage folder path (e.g. carousel, rooms, facilities). Default: uploads */
  folder?: string;
  onError?: (message: string) => void;
  placeholder?: string;
};

export function ImageUploadField({
  value,
  onChange,
  label = "Image URL or upload",
  folder = "uploads",
  onError,
  placeholder = "https://... or upload",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      onError?.("Please select an image (JPEG, PNG, WebP, GIF or SVG).");
      return;
    }
    setUploading(true);
    onError?.("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        onError?.(data.error ?? "Upload failed.");
      }
    } catch {
      onError?.("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-xs font-medium uppercase text-zinc-500">{label}</label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex flex-1 gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
            disabled={uploading}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="shrink-0 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={value}
            alt=""
            className="h-16 w-24 rounded border border-zinc-600 object-cover bg-zinc-800"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="text-xs text-zinc-500">Preview</span>
        </div>
      )}
    </div>
  );
}
