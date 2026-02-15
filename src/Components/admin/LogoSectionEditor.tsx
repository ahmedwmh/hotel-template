"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";

const LOGO_KEY = "logo_url";
const STORAGE_FOLDER = "logo";

type Props = {
  initialValues: Record<string, string>;
};

export function LogoSectionEditor({ initialValues }: Props) {
  const [logoUrl, setLogoUrl] = useState(
    initialValues[`${LOGO_KEY}:`] ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await setSiteSetting(LOGO_KEY, logoUrl, null);
    if (res.success) {
      setMessage({ type: "ok", text: "تم الحفظ." });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "err", text: res.error ?? "فشل الحفظ." });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg px-4 py-2 text-sm ${
            message.type === "ok"
              ? "bg-emerald-900/30 text-emerald-300"
              : "bg-red-900/30 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">لوجو الموقع (Navbar & Footer)</h2>
        <p className="mt-1 text-sm text-zinc-400">
          ارفع صورة اللوجو أو أدخل رابط صورة. يتم التخزين في Supabase Storage.
        </p>
        <div className="mt-4">
          <ImageUploadField
            value={logoUrl}
            onChange={setLogoUrl}
            label="رابط اللوجو أو رفع صورة"
            folder={STORAGE_FOLDER}
            onError={setError}
            placeholder="/images/logo/logo-s.svg أو ارفع صورة"
          />
          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60 min-w-[120px]"
            >
              {saving ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
            {logoUrl && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>معاينة:</span>
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-auto max-w-[120px] object-contain rounded border border-zinc-600 bg-zinc-800"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
