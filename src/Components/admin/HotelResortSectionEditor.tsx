"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
] as const;

const HOTEL_RESORT_KEYS: { key: string; locale: string | null }[] = [
  { key: "hotel_resort_image", locale: null },
  { key: "hotel_resort_subtitle", locale: "en" },
  { key: "hotel_resort_subtitle", locale: "ar" },
  { key: "hotel_resort_title", locale: "en" },
  { key: "hotel_resort_title", locale: "ar" },
  { key: "hotel_resort_description", locale: "en" },
  { key: "hotel_resort_description", locale: "ar" },
  { key: "hotel_resort_rooms_count", locale: null },
  { key: "hotel_resort_rating", locale: null },
  { key: "hotel_resort_rooms_label", locale: "en" },
  { key: "hotel_resort_rooms_label", locale: "ar" },
  { key: "hotel_resort_ratings_label", locale: "en" },
  { key: "hotel_resort_ratings_label", locale: "ar" },
  { key: "hotel_resort_more_label", locale: "en" },
  { key: "hotel_resort_more_label", locale: "ar" },
];

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const textareaClass =
  "mt-1 min-h-[100px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

type Props = {
  initialValues: Record<string, string>;
};

export function HotelResortSectionEditor({ initialValues }: Props) {
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
    for (const { key, locale } of HOTEL_RESORT_KEYS) {
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

      {/* Section image */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Section image</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Main image for the block (left side). Upload or paste URL.
        </p>
        <div className="mt-4">
          <ImageUploadField
            value={getVal("hotel_resort_image", null)}
            onChange={(v) => setVal("hotel_resort_image", null, v)}
            label="Image URL or upload"
            folder="hotel-resort"
            onError={setImgError}
            placeholder="https://... or upload"
          />
          {imgError && <p className="mt-1 text-sm text-red-400">{imgError}</p>}
        </div>
      </div>

      {/* Subtitle (gold line) – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Small gold line (subtitle)</h2>
        <p className="mt-1 text-sm text-zinc-500">e.g. LUXURY HOTEL AND RESORT / فندق ومنتجع فاخر</p>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <input
                type="text"
                value={getVal("hotel_resort_subtitle", loc.id)}
                onChange={(e) => setVal("hotel_resort_subtitle", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "القيمة بالعربية" : "English value"}
                className={inputClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main title – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Main title</h2>
        <p className="mt-1 text-sm text-zinc-500">e.g. LUXURY BEST HOTEL IN NAJAF</p>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <input
                type="text"
                value={getVal("hotel_resort_title", loc.id)}
                onChange={(e) => setVal("hotel_resort_title", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "العنوان بالعربية" : "English title"}
                className={inputClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Description – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Description</h2>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <textarea
                value={getVal("hotel_resort_description", loc.id)}
                onChange={(e) => setVal("hotel_resort_description", loc.id, e.target.value)}
                placeholder={loc.id === "ar" ? "الوصف بالعربية" : "Description in English"}
                className={textareaClass}
                dir={loc.id === "ar" ? "rtl" : "ltr"}
                rows={4}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats: rooms count override, rating */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Statistics</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Rooms number (leave empty to use live count from DB). Rating e.g. 4.9.
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          <div className="min-w-[200px]">
            <label className="text-xs font-medium uppercase text-zinc-500">Rooms number override</label>
            <input
              type="text"
              value={getVal("hotel_resort_rooms_count", null)}
              onChange={(e) => setVal("hotel_resort_rooms_count", null, e.target.value)}
              placeholder="e.g. 10 or empty"
              className={inputClass}
            />
          </div>
          <div className="min-w-[120px]">
            <label className="text-xs font-medium uppercase text-zinc-500">Rating</label>
            <input
              type="text"
              value={getVal("hotel_resort_rating", null)}
              onChange={(e) => setVal("hotel_resort_rating", null, e.target.value)}
              placeholder="e.g. 4.9"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Labels: Luxury Rooms, Customer Ratings, More About – EN/AR */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Labels (stats & button)</h2>
        <p className="mt-1 text-sm text-zinc-500">Luxury Rooms, Customer Ratings, More About button – English & Arabic.</p>
        <div className="mt-4 space-y-4">
          {["hotel_resort_rooms_label", "hotel_resort_ratings_label", "hotel_resort_more_label"].map((key) => (
            <div key={key} className="rounded-lg border border-zinc-600/80 p-4">
              <span className="text-xs font-medium uppercase text-zinc-500">
                {key === "hotel_resort_rooms_label"
                  ? "Luxury Rooms label"
                  : key === "hotel_resort_ratings_label"
                    ? "Customer Ratings label"
                    : "More About button"}
              </span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {LOCALES.map((loc) => (
                  <div key={loc.id}>
                    <label className="text-xs text-zinc-500">{loc.label}</label>
                    <input
                      type="text"
                      value={getVal(key, loc.id)}
                      onChange={(e) => setVal(key, loc.id, e.target.value)}
                      placeholder={loc.id === "ar" ? "العربية" : "English"}
                      className={inputClass}
                      dir={loc.id === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
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
