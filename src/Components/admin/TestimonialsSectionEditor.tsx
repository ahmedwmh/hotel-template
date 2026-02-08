"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import {
  parseTestimonialItems,
  stringifyTestimonialItems,
  type TestimonialItem,
} from "@/lib/testimonial-items";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
] as const;

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const textareaClass =
  "min-h-[80px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

type Props = { initialValues: Record<string, string> };

export function TestimonialsSectionEditor({ initialValues }: Props) {
  const [title, setTitle] = useState<Record<string, string>>({
    en: initialValues["testimonials_title:en"] ?? "",
    ar: initialValues["testimonials_title:ar"] ?? "",
  });
  const [subtitle, setSubtitle] = useState<Record<string, string>>({
    en: initialValues["testimonials_subtitle:en"] ?? "",
    ar: initialValues["testimonials_subtitle:ar"] ?? "",
  });
  const [itemsByLocale, setItemsByLocale] = useState<Record<string, TestimonialItem[]>>({
    en: parseTestimonialItems(initialValues["testimonials_list:en"]),
    ar: parseTestimonialItems(initialValues["testimonials_list:ar"]),
  });
  const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<TestimonialItem>({
    quote: "",
    authorName: "",
    role: "",
    avatar: "",
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

  function handleSaveList(newItems: TestimonialItem[]) {
    setItemsByLocale((prev) => ({ ...prev, [activeLocale]: newItems }));
    saveKey("testimonials_list", stringifyTestimonialItems(newItems), activeLocale);
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setAdding(false);
    setForm({ ...items[index], role: items[index].role ?? "", avatar: items[index].avatar ?? "" });
  }

  function handleAdd() {
    setAdding(true);
    setEditingIndex(null);
    setForm({ quote: "", authorName: "", role: "", avatar: "" });
  }

  function handleSaveEdit() {
    const item: TestimonialItem = {
      quote: form.quote,
      authorName: form.authorName,
      role: form.role || undefined,
      avatar: form.avatar || undefined,
    };
    if (adding) {
      handleSaveList([...items, item]);
      setAdding(false);
    } else if (editingIndex !== null) {
      const next = [...items];
      next[editingIndex] = item;
      handleSaveList(next);
      setEditingIndex(null);
    }
    setForm({ quote: "", authorName: "", role: "", avatar: "" });
  }

  function handleDelete(index: number) {
    if (!confirm("Remove this testimonial?")) return;
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
                <input
                  type="text"
                  value={title[loc.id]}
                  onChange={(e) => setTitle((p) => ({ ...p, [loc.id]: e.target.value }))}
                  placeholder="Title"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={subtitle[loc.id]}
                  onChange={(e) => setSubtitle((p) => ({ ...p, [loc.id]: e.target.value }))}
                  placeholder="Subtitle"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    saveKey("testimonials_title", title[loc.id], loc.id);
                    saveKey("testimonials_subtitle", subtitle[loc.id], loc.id);
                  }}
                  disabled={saving !== null}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  Save {loc.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-200">Testimonials list</h2>
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-zinc-600 bg-zinc-900 p-4">
              <p className="line-clamp-2 text-sm text-zinc-300">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-2 font-medium text-zinc-100">{item.authorName}</p>
              <p className="text-xs text-zinc-500">{item.role}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="rounded bg-zinc-600 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-300 hover:bg-red-900/70"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/50 px-4 py-3 text-sm font-medium text-zinc-300 hover:border-amber-500 hover:bg-zinc-800 hover:text-amber-400"
        >
          <span className="text-lg">+</span> Add testimonial
        </button>

        {showForm && (
          <div className="mt-6 rounded-lg border border-amber-600/40 bg-zinc-900/80 p-6">
            <h3 className="text-base font-medium text-zinc-200">{adding ? "New testimonial" : "Edit testimonial"}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium uppercase text-zinc-500">Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
                  className={textareaClass}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-zinc-500">Author name</label>
                <input
                  type="text"
                  value={form.authorName}
                  onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-zinc-500">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. Guest"
                  className={inputClass}
                />
              </div>
              <ImageUploadField
                value={form.avatar ?? ""}
                onChange={(url) => setForm((p) => ({ ...p, avatar: url }))}
                label="Avatar image URL or upload"
                folder="testimonials"
                onError={(text) => setMessage({ type: "err", text })}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
                >
                  {adding ? "Add" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => { setAdding(false); setEditingIndex(null); }}
                  className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
