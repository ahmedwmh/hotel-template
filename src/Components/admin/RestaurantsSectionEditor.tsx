"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import {
  parseRestaurantsList,
  stringifyRestaurantsList,
  type RestaurantItem,
} from "@/lib/restaurants-items";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";
import { deleteUploadedImage } from "@/lib/admin-storage";

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
const textareaClass =
  "min-h-[80px] w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y";

type Props = { initialValues: Record<string, string> };

export function RestaurantsSectionEditor({ initialValues }: Props) {
  const [items, setItems] = useState<RestaurantItem[]>(() =>
    parseRestaurantsList(initialValues["restaurants_list:"])
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<RestaurantItem>({
    imageUrl: "",
    titleEn: "",
    titleAr: "",
    subtitleEn: "",
    subtitleAr: "",
    descriptionEn: "",
    descriptionAr: "",
  });

  async function saveList(newItems: RestaurantItem[]) {
    setSaving(true);
    setMessage(null);
    const res = await setSiteSetting("restaurants_list", stringifyRestaurantsList(newItems), null);
    if (res.success) {
      setMessage({ type: "ok", text: "Saved." });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "err", text: res.error ?? "Save failed." });
    }
    setSaving(false);
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
      imageUrl: "",
      titleEn: "",
      titleAr: "",
      subtitleEn: "",
      subtitleAr: "",
      descriptionEn: "",
      descriptionAr: "",
    });
  }

  async function handleSaveEdit() {
    if (adding) {
      const next = [...items, form];
      setItems(next);
      await saveList(next);
      setAdding(false);
    } else if (editingIndex !== null) {
      const oldItem = items[editingIndex];
      if (oldItem.imageUrl && oldItem.imageUrl !== form.imageUrl) {
        await deleteUploadedImage(oldItem.imageUrl);
      }
      const next = [...items];
      next[editingIndex] = form;
      setItems(next);
      await saveList(next);
      setEditingIndex(null);
    }
    setForm({
      imageUrl: "",
      titleEn: "",
      titleAr: "",
      subtitleEn: "",
      subtitleAr: "",
      descriptionEn: "",
      descriptionAr: "",
    });
  }

  async function handleDelete(index: number) {
    if (!confirm("Remove this venue? The image will also be removed from storage.")) return;
    await deleteUploadedImage(items[index].imageUrl);
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    await saveList(next);
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
        <h2 className="text-lg font-medium text-zinc-200">Restaurants & venues</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Each venue has an image, title (EN/AR), subtitle and description. Content is shown on the public Restaurants page.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 rounded-lg border border-zinc-600 bg-zinc-900 p-4">
              <div
                className="h-20 w-28 shrink-0 rounded bg-zinc-800 bg-cover bg-center"
                style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-200">{item.titleEn || item.titleAr || "Untitled"}</p>
                <p className="text-xs text-zinc-500 truncate">{item.subtitleEn || item.subtitleAr || "—"}</p>
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
          <span className="text-lg">+</span> Add venue
        </button>

        {showForm && (
          <div className="mt-6 rounded-lg border border-amber-600/40 bg-zinc-900/80 p-6">
            <h3 className="text-base font-medium text-zinc-200">{adding ? "New venue" : "Edit venue"}</h3>
            <div className="mt-4 space-y-4">
              <ImageUploadField
                value={form.imageUrl}
                onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                label="Image URL or upload"
                folder="restaurants"
                onError={(text) => setMessage({ type: "err", text })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Title (EN)</label>
                  <input type="text" value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className={inputClass} placeholder="e.g. Zuwar Restaurant" />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Title (AR)</label>
                  <input type="text" value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} className={inputClass} dir="rtl" placeholder="مطعم زوّار" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Subtitle (EN)</label>
                  <input type="text" value={form.subtitleEn} onChange={(e) => setForm((p) => ({ ...p, subtitleEn: e.target.value }))} className={inputClass} placeholder="Short tagline" />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Subtitle (AR)</label>
                  <input type="text" value={form.subtitleAr} onChange={(e) => setForm((p) => ({ ...p, subtitleAr: e.target.value }))} className={inputClass} dir="rtl" placeholder="عنوان الفخامة…" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Description (EN)</label>
                  <textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} className={textareaClass} rows={4} placeholder="Full description…" />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase text-zinc-500">Description (AR)</label>
                  <textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} className={textareaClass} rows={4} dir="rtl" placeholder="الوصف الكامل…" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleSaveEdit} disabled={saving} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50">{saving ? "Saving…" : adding ? "Add" : "Save"}</button>
                <button type="button" onClick={() => { setAdding(false); setEditingIndex(null); }} className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
