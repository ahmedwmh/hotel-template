"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";

type KeyInfo = { key: string; label: string; locale: boolean; type?: "text" | "textarea" | "json" };

export function ContentEditor({
  keys,
  initialValues,
  showTextareaForType = true,
}: {
  keys: KeyInfo[];
  initialValues: Record<string, string>;
  showTextareaForType?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const locales = ["en", "ar"];

  function getValue(key: string, locale: string | null): string {
    const k = locale ? `${key}:${locale}` : `${key}:`;
    return values[k] ?? "";
  }

  function setValue(key: string, locale: string | null, value: string) {
    const k = locale ? `${key}:${locale}` : `${key}:`;
    setValues((prev) => ({ ...prev, [k]: value }));
  }

  async function handleSaveAll() {
    setSaving(true);
    setMessage(null);
    const entries: { key: string; locale: string | null }[] = [];
    for (const { key, locale: hasLocale } of keys) {
      if (hasLocale) {
        for (const loc of locales) {
          entries.push({ key, locale: loc });
        }
      } else {
        entries.push({ key, locale: null });
      }
    }
    let ok = true;
    for (const { key, locale } of entries) {
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

  const inputClass =
    "mt-1 h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
  const textareaClass =
    "mt-1 min-h-[120px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

  const useTextarea = (type?: string) =>
    showTextareaForType && (type === "textarea" || type === "json");

  function Field({
    keyName,
    loc,
    type,
  }: {
    keyName: string;
    loc: string | null;
    type?: string;
  }) {
    const val = getValue(keyName, loc);
    const isTextarea = useTextarea(type);
    return (
      <div className="mt-1">
        {isTextarea ? (
          <textarea
            value={val}
            onChange={(e) => setValue(keyName, loc, e.target.value)}
            className={textareaClass}
            placeholder={loc === "ar" ? "القيمة بالعربية" : "English value"}
            rows={5}
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => setValue(keyName, loc, e.target.value)}
            className={inputClass}
            placeholder={loc === "ar" ? "القيمة بالعربية" : "English value"}
          />
        )}
      </div>
    );
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

      {keys.map(({ key, label, locale, type }) => (
        <div
          key={key}
          className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6"
        >
          <h2 className="text-lg font-medium text-zinc-200">{label}</h2>
          {locale ? (
            <div className="mt-4 space-y-4">
              {locales.map((loc) => (
                <div key={loc}>
                  <label className="text-xs font-medium uppercase text-zinc-500">
                    {loc === "en" ? "English" : "Arabic"}
                  </label>
                  <Field keyName={key} loc={loc} type={type} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2">
              <Field keyName={key} loc={null} type={type} />
            </div>
          )}
        </div>
      ))}

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
