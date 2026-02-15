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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  function handleValueChange(newUrl: string) {
    setPreviewLoading(!!newUrl);
    setPreviewError(false);
    onChange(newUrl);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      onError?.("Please select an image (JPEG, PNG, WebP, GIF or SVG).");
      return;
    }
    setUploading(true);
    onError?.("");
    setPreviewLoading(true);
    setPreviewError(false);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2500);
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
    <div className="relative">
      <label className="text-xs font-medium uppercase text-zinc-500">{label}</label>

      {/* واضح: حالة الرفع */}
      {uploading && (
        <div className="mt-1 mb-2 flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span>جاري رفع الصورة… / Uploading image…</span>
        </div>
      )}
      {uploadSuccess && !uploading && (
        <div className="mt-1 mb-2 flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          <span className="text-lg">✓</span>
          <span>تم الرفع بنجاح / Upload complete</span>
        </div>
      )}

      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex flex-1 gap-2 min-w-0">
          <input
            type="url"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
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
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px]"
          >
            {uploading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-3">
          <div className="relative h-20 w-28 shrink-0 rounded-lg border border-zinc-600 bg-zinc-800 overflow-hidden">
            {previewLoading && !previewError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/90">
                <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            )}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onLoad={() => setPreviewLoading(false)}
              onError={() => {
                setPreviewLoading(false);
                setPreviewError(true);
              }}
              style={{ visibility: previewLoading && !previewError ? "hidden" : "visible" }}
            />
          </div>
          <span className="text-xs text-zinc-500">
            {previewError ? "Preview unavailable" : "Preview"}
          </span>
        </div>
      )}
    </div>
  );
}
