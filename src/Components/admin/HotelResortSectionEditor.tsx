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

function getInitial(initial: Record<string, string>, key: string, locale: string | null): string {
  const k = locale ? `${key}:${locale}` : `${key}:`;
  return initial[k] ?? "";
}

type Props = {
  initialValues: Record<string, string>;
};

export function HotelResortSectionEditor({ initialValues }: Props) {
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
          <button
            type="button"
            onClick={() => saveKey("hotel_resort_image", getVal("hotel_resort_image", null), null)}
            disabled={saving !== null}
            className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {saving === "hotel_resort_image:" ? "Saving…" : "Save"}
          </button>
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
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={getVal("hotel_resort_subtitle", loc.id)}
                  onChange={(e) => setVal("hotel_resort_subtitle", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "القيمة بالعربية" : "English value"}
                  className={inputClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => saveKey("hotel_resort_subtitle", getVal("hotel_resort_subtitle", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `hotel_resort_subtitle:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
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
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={getVal("hotel_resort_title", loc.id)}
                  onChange={(e) => setVal("hotel_resort_title", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "العنوان بالعربية" : "English title"}
                  className={inputClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  onClick={() => saveKey("hotel_resort_title", getVal("hotel_resort_title", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `hotel_resort_title:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
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
              <div className="mt-1 flex gap-2">
                <textarea
                  value={getVal("hotel_resort_description", loc.id)}
                  onChange={(e) => setVal("hotel_resort_description", loc.id, e.target.value)}
                  placeholder={loc.id === "ar" ? "الوصف بالعربية" : "Description in English"}
                  className={textareaClass}
                  dir={loc.id === "ar" ? "rtl" : "ltr"}
                  rows={4}
                />
                <button
                  type="button"
                  onClick={() => saveKey("hotel_resort_description", getVal("hotel_resort_description", loc.id), loc.id)}
                  disabled={saving !== null}
                  className="shrink-0 self-start rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving === `hotel_resort_description:${loc.id}` ? "Saving…" : "Save"}
                </button>
              </div>
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
          <div>
            <label className="text-xs font-medium uppercase text-zinc-500">Rooms number override</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={getVal("hotel_resort_rooms_count", null)}
                onChange={(e) => setVal("hotel_resort_rooms_count", null, e.target.value)}
                placeholder="e.g. 10 or empty"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => saveKey("hotel_resort_rooms_count", getVal("hotel_resort_rooms_count", null), null)}
                disabled={saving !== null}
                className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
              >
                {saving === "hotel_resort_rooms_count:" ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase text-zinc-500">Rating</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={getVal("hotel_resort_rating", null)}
                onChange={(e) => setVal("hotel_resort_rating", null, e.target.value)}
                placeholder="e.g. 4.9"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => saveKey("hotel_resort_rating", getVal("hotel_resort_rating", null), null)}
                disabled={saving !== null}
                className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
              >
                {saving === "hotel_resort_rating:" ? "Saving…" : "Save"}
              </button>
            </div>
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
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={getVal(key, loc.id)}
                        onChange={(e) => setVal(key, loc.id, e.target.value)}
                        placeholder={loc.id === "ar" ? "العربية" : "English"}
                        className={inputClass}
                        dir={loc.id === "ar" ? "rtl" : "ltr"}
                      />
                      <button
                        type="button"
                        onClick={() => saveKey(key, getVal(key, loc.id), loc.id)}
                        disabled={saving !== null}
                        className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                      >
                        {saving === `${key}:${loc.id}` ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
