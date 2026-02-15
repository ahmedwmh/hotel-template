"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import {
  parseFacilitiesItems,
  stringifyFacilitiesItems,
  type FacilityItem,
} from "@/lib/facilities-items";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";
import { deleteUploadedImage } from "@/lib/admin-storage";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
] as const;

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const textareaClass =
  "min-h-[60px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

type Props = { initialValues: Record<string, string> };

export function FacilitiesSectionEditor({ initialValues }: Props) {
  const [title, setTitle] = useState<Record<string, string>>({
    en: initialValues["facilities_title:en"] ?? "",
    ar: initialValues["facilities_title:ar"] ?? "",
  });
  const [subtitle, setSubtitle] = useState<Record<string, string>>({
    en: initialValues["facilities_subtitle:en"] ?? "",
    ar: initialValues["facilities_subtitle:ar"] ?? "",
  });
  const [itemsByLocale, setItemsByLocale] = useState<Record<string, FacilityItem[]>>({
    en: parseFacilitiesItems(initialValues["facilities_items:en"]),
    ar: parseFacilitiesItems(initialValues["facilities_items:ar"]),
  });
  const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
  const [saving, setSaving] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FacilityItem>({
    image: "",
    number: "",
    categoryEn: "",
    categoryAr: "",
    titleEn: "",
    titleAr: "",
    description: "",
  });

  const items = itemsByLocale[activeLocale] ?? [];

  async function saveKey(key: string, value: string, locale: string) {
    setSaving(`${key}:${locale}`);
    setMessage(null);
    const res = await setSiteSetting(key, value, locale);
    if (res.success) {
      setMessage({ type: "ok", text: "Saved." });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "err", text: res.error ?? "Save failed." });
    }
    setSaving(null);
  }

  async function handleSaveAll() {
    setSavingAll(true);
    setMessage(null);
    const toSave: [string, string, string][] = [
      ["facilities_title", title.en, "en"],
      ["facilities_title", title.ar, "ar"],
      ["facilities_subtitle", subtitle.en, "en"],
      ["facilities_subtitle", subtitle.ar, "ar"],
      ["facilities_items", stringifyFacilitiesItems(itemsByLocale.en ?? []), "en"],
      ["facilities_items", stringifyFacilitiesItems(itemsByLocale.ar ?? []), "ar"],
    ];
    let ok = true;
    for (const [key, value, locale] of toSave) {
      const res = await setSiteSetting(key, value, locale);
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
    setSavingAll(false);
  }

  function handleSaveList(newItems: FacilityItem[]) {
    setItemsByLocale((prev) => ({ ...prev, [activeLocale]: newItems }));
    saveKey("facilities_items", stringifyFacilitiesItems(newItems), activeLocale);
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setAdding(false);
    setForm({ ...items[index] });
  }

  function handleAdd() {
    setAdding(true);
    setEditingIndex(null);
    setForm({
      image: "",
      number: "",
      categoryEn: "",
      categoryAr: "",
      titleEn: "",
      titleAr: "",
      description: "",
    });
  }

  async function handleSaveEdit() {
    if (adding) {
      handleSaveList([...items, form]);
      setAdding(false);
    } else if (editingIndex !== null) {
      const oldItem = items[editingIndex];
      if (oldItem.image && oldItem.image !== form.image) {
        await deleteUploadedImage(oldItem.image);
      }
      const next = [...items];
      next[editingIndex] = form;
      handleSaveList(next);
      setEditingIndex(null);
    }
  }

  async function handleDelete(index: number) {
    if (!confirm("Remove this facility? The image will also be removed from storage.")) return;
    await deleteUploadedImage(items[index].image);
    handleSaveList(items.filter((_, i) => i !== index));
    setEditingIndex(null);
    setAdding(false);
  }

  const showForm = adding || editingIndex !== null;

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`rounded-lg px-4 py-2 text-sm ${
            message.type === "ok" ? "bg-emerald-900/30 text-emerald-300" : "bg-red-900/30 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Section title & subtitle</h2>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">{loc.label}</label>
              <div className="mt-2 space-y-2">
                <input type="text" value={title[loc.id]} onChange={(e) => setTitle((p) => ({ ...p, [loc.id]: e.target.value }))} className={inputClass} placeholder="Title" />
                <input type="text" value={subtitle[loc.id]} onChange={(e) => setSubtitle((p) => ({ ...p, [loc.id]: e.target.value }))} className={inputClass} placeholder="Subtitle" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-200">Facilities items</h2>
          <div className="flex gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveLocale(loc.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  activeLocale === loc.id ? "bg-amber-600 text-white" : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 rounded-lg border border-zinc-600 bg-zinc-900 p-4">
              <div
                className="h-20 w-28 shrink-0 rounded bg-zinc-800 bg-cover bg-center"
                style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-200">{activeLocale === "en" ? item.titleEn : item.titleAr}</p>
                <p className="text-xs text-zinc-500">{item.number}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => handleEdit(index)} className="rounded bg-zinc-600 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-500">Edit</button>
                  <button type="button" onClick={() => handleDelete(index)} className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-300 hover:bg-red-900/70">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/50 px-4 py-3 text-sm font-medium text-zinc-300 hover:border-amber-500 hover:bg-zinc-800 hover:text-amber-400"
        >
          <span className="text-lg">+</span> Add facility
        </button>

        {showForm && (
          <div className="mt-6 rounded-lg border border-amber-600/40 bg-zinc-900/80 p-6">
            <h3 className="text-base font-medium text-zinc-200">{adding ? "New facility" : "Edit facility"}</h3>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Number (e.g. 01)</label>
                  <input type="text" value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <ImageUploadField
                    value={form.image}
                    onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                    label="Image URL or upload"
                    folder="facilities"
                    onError={(text) => setMessage({ type: "err", text })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Category (EN)</label>
                  <input type="text" value={form.categoryEn} onChange={(e) => setForm((p) => ({ ...p, categoryEn: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Category (AR)</label>
                  <input type="text" value={form.categoryAr} onChange={(e) => setForm((p) => ({ ...p, categoryAr: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Title (EN)</label>
                  <input type="text" value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Title (AR)</label>
                  <input type="text" value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-zinc-500">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={textareaClass} rows={2} />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleSaveEdit} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500">{adding ? "Add" : "Save"}</button>
                <button type="button" onClick={() => { setAdding(false); setEditingIndex(null); }} className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          Edit title, subtitle and items above. Save once to apply all changes.
        </p>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={savingAll || saving !== null}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60 min-w-[140px]"
        >
          {savingAll ? (
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
