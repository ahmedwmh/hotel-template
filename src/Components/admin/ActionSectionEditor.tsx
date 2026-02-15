"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
] as const;

const ACTION_KEYS: { key: string; locale: string | null }[] = [
  { key: "action_title", locale: "en" },
  { key: "action_title", locale: "ar" },
  { key: "action_description", locale: "en" },
  { key: "action_description", locale: "ar" },
  { key: "action_quote", locale: "en" },
  { key: "action_quote", locale: "ar" },
  { key: "action_manager_name", locale: "en" },
  { key: "action_manager_name", locale: "ar" },
  { key: "action_manager_role", locale: "en" },
  { key: "action_manager_role", locale: "ar" },
  { key: "action_video_url", locale: null },
  { key: "action_video_poster", locale: null },
  { key: "action_manager_avatar", locale: null },
];

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const textareaClass =
  "mt-1 min-h-[100px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

type Props = {
  initialValues: Record<string, string>;
};

export function ActionSectionEditor({ initialValues }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [imgError, setImgError] = useState("");

  function getVal(key: string, locale: string | null): string {
    const k = locale ? `${key}:${locale}` : `${key}:`;
    return values[k] ?? "";
  }

  function setVal(key: string, locale: string | null, value: string) {
    const k = locale ? `${key}:${locale}` : `${key}:`;
    setValues((p) => ({ ...p, [k]: value }));
  }

  async function handleSaveAll() {
    setSaving(true);
    setMessage(null);
    setImgError("");
    let ok = true;
    for (const { key, locale } of ACTION_KEYS) {
      const k = locale ? `${key}:${locale}` : `${key}:`;
      const res = await setSiteSetting(key, values[k] ?? "", locale ?? undefined);
      if (!res.success) {
        setMessage({ type: "err", text: res.error ?? "Save failed." });
        ok = false;
        break;
      }
    }
    if (ok) {
      setMessage({ type: "ok", text: "All changes saved." });
      setTimeout(() => setMessage(null), 2500);
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

      {/* Title – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Title</h2>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <input
                type="text"
                value={getVal("action_title", loc.id)}
                onChange={(e) => setVal("action_title", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "العنوان بالعربية" : "English value"}
                className={inputClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Description – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Description (first paragraph)</h2>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <textarea
                value={getVal("action_description", loc.id)}
                onChange={(e) => setVal("action_description", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "الوصف بالعربية" : "English value"}
                className={textareaClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
                rows={4}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quote – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Quote (italic)</h2>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <textarea
                value={getVal("action_quote", loc.id)}
                onChange={(e) => setVal("action_quote", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "الاقتباس بالعربية" : "English value"}
                className={textareaClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Manager name – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Manager name</h2>
        <p className="mt-1 text-sm text-zinc-500">اسم المدير – إنجليزي وعربي</p>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <input
                type="text"
                value={getVal("action_manager_name", loc.id)}
                onChange={(e) => setVal("action_manager_name", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "اسم المدير بالعربية" : "Manager name in English"}
                className={inputClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Manager role – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Manager role</h2>
        <p className="mt-1 text-sm text-zinc-500">منصب المدير – إنجليزي وعربي</p>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <input
                type="text"
                value={getVal("action_manager_role", loc.id)}
                onChange={(e) => setVal("action_manager_role", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "المسمى الوظيفي بالعربية" : "e.g. General Manager"}
                className={inputClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video URL */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Video URL (YouTube/Vimeo embed)</h2>
        <p className="mt-1 text-sm text-zinc-500">رابط الفيديو للتضمين</p>
        <input
          type="url"
          value={getVal("action_video_url", null)}
          onChange={(e) => setVal("action_video_url", null, e.target.value)}
          placeholder="https://www.youtube.com/embed/..."
          className={inputClass}
        />
      </div>

      {/* Video poster */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Video poster image (optional)</h2>
        <p className="mt-1 text-sm text-zinc-500">صورة غلاف الفيديو. ارفع صورة أو الصق رابطاً.</p>
        <div className="mt-4">
          <ImageUploadField
            value={getVal("action_video_poster", null)}
            onChange={(v) => setVal("action_video_poster", null, v)}
            label="رفع صورة أو رابط"
            folder="action"
            onError={setImgError}
            placeholder="ارفع صورة أو الصق الرابط"
          />
          {imgError && <p className="mt-1 text-sm text-red-400">{imgError}</p>}
        </div>
      </div>

      {/* Manager avatar */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Manager avatar image (optional)</h2>
        <p className="mt-1 text-sm text-zinc-500">صورة المدير. ارفع صورة أو الصق رابطاً.</p>
        <div className="mt-4">
          <ImageUploadField
            value={getVal("action_manager_avatar", null)}
            onChange={(v) => setVal("action_manager_avatar", null, v)}
            label="رفع صورة أو رابط"
            folder="action"
            onError={setImgError}
            placeholder="ارفع صورة أو الصق الرابط"
          />
          {imgError && <p className="mt-1 text-sm text-red-400">{imgError}</p>}
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          Edit the fields above, then save once to apply all changes.
        </p>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60 min-w-[140px]"
        >
          {saving ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : (
            "Save all"
          )}
        </button>
      </div>
    </div>
  );
}
