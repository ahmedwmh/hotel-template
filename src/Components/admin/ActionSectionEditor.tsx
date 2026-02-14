"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
] as const;

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const textareaClass =
  "mt-1 min-h-[100px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

type Props = {
  initialValues: Record<string, string>;
};

export function ActionSectionEditor({ initialValues }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState<string | null>(null);
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

  async function saveKey(key: string, value: string, locale: string | null) {
    const k = locale ? `${key}:${locale}` : `${key}:`;
    setSaving(k);
    setMessage(null);
    const res = await setSiteSetting(key, value, locale ?? undefined);
    if (res.success) {
      setMessage({ type: "ok", text: "Saved." });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "err", text: res.error ?? "Save failed." });
    }
    setSaving(null);
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
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
                <input
                  type="text"
                  value={getVal("action_title", loc.id)}
                  onChange={(e) => setVal("action_title", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "العنوان بالعربية" : "English value"}
                  className={inputClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => saveKey("action_title", getVal("action_title", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `action_title:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
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
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
                <textarea
                  value={getVal("action_description", loc.id)}
                  onChange={(e) => setVal("action_description", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "الوصف بالعربية" : "English value"}
                  className={textareaClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                  rows={4}
                />
                <button
                  type="button"
                  onClick={() => saveKey("action_description", getVal("action_description", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `action_description:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
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
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
                <textarea
                  value={getVal("action_quote", loc.id)}
                  onChange={(e) => setVal("action_quote", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "الاقتباس بالعربية" : "English value"}
                  className={textareaClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() => saveKey("action_quote", getVal("action_quote", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `action_quote:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manager name – EN/AR (dynamic) */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Manager name</h2>
        <p className="mt-1 text-sm text-zinc-500">اسم المدير – إنجليزي وعربي (ديناميك)</p>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={getVal("action_manager_name", loc.id)}
                  onChange={(e) => setVal("action_manager_name", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "اسم المدير بالعربية" : "Manager name in English"}
                  className={inputClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => saveKey("action_manager_name", getVal("action_manager_name", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `action_manager_name:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manager role – EN/AR (dynamic) */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Manager role</h2>
        <p className="mt-1 text-sm text-zinc-500">منصب المدير – إنجليزي وعربي (ديناميك)</p>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={getVal("action_manager_role", loc.id)}
                  onChange={(e) => setVal("action_manager_role", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "المسمى الوظيفي بالعربية" : "e.g. General Manager"}
                  className={inputClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => saveKey("action_manager_role", getVal("action_manager_role", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `action_manager_role:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video URL */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Video URL (YouTube/Vimeo embed)</h2>
        <p className="mt-1 text-sm text-zinc-500">رابط الفيديو للتضمين (YouTube أو Vimeo)</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start">
          <input
            type="url"
            value={getVal("action_video_url", null)}
            onChange={(e) => setVal("action_video_url", null, e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => saveKey("action_video_url", getVal("action_video_url", null), null)}
            disabled={saving !== null}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {saving === "action_video_url:" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Video poster – رفع صورة إلى Supabase */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Video poster image (optional)</h2>
        <p className="mt-1 text-sm text-zinc-500">
          صورة غلاف الفيديو. ارفع صورة من جهازك أو الصق رابطاً. التخزين في Supabase.
        </p>
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
          <button
            type="button"
            onClick={() => saveKey("action_video_poster", getVal("action_video_poster", null), null)}
            disabled={saving !== null}
            className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {saving === "action_video_poster:" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Manager avatar – رفع صورة إلى Supabase */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Manager avatar image (optional)</h2>
        <p className="mt-1 text-sm text-zinc-500">
          صورة المدير. ارفع صورة من جهازك أو الصق رابطاً. التخزين في Supabase.
        </p>
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
          <button
            type="button"
            onClick={() => saveKey("action_manager_avatar", getVal("action_manager_avatar", null), null)}
            disabled={saving !== null}
            className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {saving === "action_manager_avatar:" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
