"use client";

import { useRef } from "react";

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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
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
    }
    e.target.value = "";
  }

  return (
    <div>
      <label className="text-xs font-medium uppercase text-zinc-500">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
