"use client";

import { useRef, useState } from "react";

type MultiImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  onError?: (message: string) => void;
  label?: string;
  helpText?: string;
};

export function MultiImageUpload({
  value,
  onChange,
  folder = "rooms",
  onError,
  label = "Room images",
  helpText = "Upload or paste URLs. First image is shown on the room card and detail page.",
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [addUrl, setAddUrl] = useState("");

  const list = Array.isArray(value) ? value.filter((u): u is string => typeof u === "string" && u.trim() !== "") : [];

  async function uploadOneFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok && data.url) return data.url;
    onError?.(data.error ?? "Upload failed.");
    return null;
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      onError?.("Please select image files (JPEG, PNG, WebP, GIF or SVG).");
      e.target.value = "";
      return;
    }
    setUploading(true);
    onError?.("");
    const newUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: imageFiles.length });
      const url = await uploadOneFile(imageFiles[i]);
      if (url) newUrls.push(url);
    }
    setUploadProgress(null);
    setUploading(false);
    e.target.value = "";
    if (newUrls.length) onChange([...list, ...newUrls]);
  }

  function handleRemove(index: number) {
    const next = list.filter((_, i) => i !== index);
    onChange(next);
  }

  function handleAddByUrl() {
    const url = addUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      onError?.("Please enter a valid URL starting with http:// or https://");
      return;
    }
    onChange([...list, url]);
    setAddUrl("");
    onError?.("");
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-600/80 bg-zinc-900/50 p-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-200">{label}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{helpText}</p>
      </div>

      {/* حالة الرفع: جاري رفع 2 من 5 */}
      {uploading && uploadProgress && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <span className="inline-block h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span>
            جاري رفع الصورة {uploadProgress.current} من {uploadProgress.total} / Uploading image {uploadProgress.current} of {uploadProgress.total}
          </span>
        </div>
      )}

      {/* زر واحد لاختيار عدة صور */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Uploading…
            </>
          ) : (
            <>📷 Select multiple images / اختر عدة صور</>
          )}
        </button>
        <span className="text-xs text-zinc-500">Select several images at once; they will be uploaded one by one.</span>
      </div>

      {/* إضافة رابط واحد يدوياً */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium uppercase text-zinc-500 block mb-1">Add by URL (optional)</label>
          <input
            type="url"
            value={addUrl}
            onChange={(e) => setAddUrl(e.target.value)}
            placeholder="https://... paste image URL"
            className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddByUrl}
          disabled={uploading || !addUrl.trim()}
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
        >
          Add URL
        </button>
      </div>

      {/* شبكة المعاينات مع زر الحذف */}
      {list.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-2">
            Order: first image = room card & detail. Drag not supported; remove and re-add to reorder.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {list.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group rounded-lg border border-zinc-600 bg-zinc-800 overflow-hidden">
                <div className="aspect-[4/3] bg-zinc-800 relative">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 px-2 py-1 truncate">Image {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
