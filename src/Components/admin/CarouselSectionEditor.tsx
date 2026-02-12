"use client";

import { useState } from "react";
import { setSiteSetting } from "@/lib/actions/site-content";
import {
  parseHeroSlides,
  stringifyHeroSlides,
  type HeroSlide,
} from "@/lib/hero-slides";
import { ImageUploadField } from "@/Components/admin/ImageUploadField";
import { deleteUploadedImage } from "@/lib/admin-storage";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
] as const;

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

type Props = {
  initialValues: Record<string, string>;
};

export function CarouselSectionEditor({ initialValues }: Props) {
  const [heroTitle, setHeroTitle] = useState<Record<string, string>>({
    en: initialValues["hero_title:en"] ?? "",
    ar: initialValues["hero_title:ar"] ?? "",
  });
  const [heroSubtitle, setHeroSubtitle] = useState<Record<string, string>>({
    en: initialValues["hero_subtitle:en"] ?? "",
    ar: initialValues["hero_subtitle:ar"] ?? "",
  });
  const [slidesByLocale, setSlidesByLocale] = useState<Record<string, HeroSlide[]>>({
    en: parseHeroSlides(initialValues["hero_slides:en"]),
    ar: parseHeroSlides(initialValues["hero_slides:ar"]),
  });
  const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [formSlide, setFormSlide] = useState<HeroSlide>({
    imageUrl: "",
    title1: "",
    title2: "",
  });
  const slides = slidesByLocale[activeLocale] ?? [];

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

  function handleSaveSlides(newSlides: HeroSlide[]) {
    setSlidesByLocale((prev) => ({ ...prev, [activeLocale]: newSlides }));
    saveKey("hero_slides", stringifyHeroSlides(newSlides), activeLocale);
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setAdding(false);
    setFormSlide({ ...slides[index] });
  }

  function handleAdd() {
    setAdding(true);
    setEditingIndex(null);
    setFormSlide({ imageUrl: "", title1: "", title2: "" });
  }

  async function handleSaveEdit() {
    if (adding) {
      handleSaveSlides([...slides, formSlide]);
      setAdding(false);
    } else if (editingIndex !== null) {
      const oldSlide = slides[editingIndex];
      if (oldSlide.imageUrl && oldSlide.imageUrl !== formSlide.imageUrl) {
        await deleteUploadedImage(oldSlide.imageUrl);
      }
      const next = [...slides];
      next[editingIndex] = formSlide;
      handleSaveSlides(next);
      setEditingIndex(null);
    }
    setFormSlide({ imageUrl: "", title1: "", title2: "" });
  }

  async function handleDelete(index: number) {
    if (!confirm("Remove this slide? The image will also be removed from storage.")) return;
    const slide = slides[index];
    await deleteUploadedImage(slide.imageUrl);
    const next = slides.filter((_, i) => i !== index);
    handleSaveSlides(next);
    setEditingIndex(null);
    setAdding(false);
  }

  const showForm = adding || editingIndex !== null;

  return (
    <div className="space-y-8">
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

      {/* Hero title & subtitle */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <h2 className="text-lg font-medium text-zinc-200">Hero title & subtitle</h2>
        <div className="mt-4 space-y-4">
          {LOCALES.map((loc) => (
            <div key={loc.id}>
              <label className="text-xs font-medium uppercase text-zinc-500">
                {loc.label}
              </label>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={heroTitle[loc.id]}
                  onChange={(e) => setHeroTitle((p) => ({ ...p, [loc.id]: e.target.value }))}
                  placeholder="Hero title"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={heroSubtitle[loc.id]}
                  onChange={(e) => setHeroSubtitle((p) => ({ ...p, [loc.id]: e.target.value }))}
                  placeholder="Hero subtitle"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    saveKey("hero_title", heroTitle[loc.id], loc.id);
                    saveKey("hero_subtitle", heroSubtitle[loc.id], loc.id);
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

      {/* Slides by locale */}
      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-200">Carousel slides</h2>
          <div className="flex gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveLocale(loc.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  activeLocale === loc.id
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          Edit or add slides for the hero carousel. Each slide has an image and two title lines.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-zinc-600 bg-zinc-900"
            >
              <div
                className="aspect-video w-full bg-zinc-800 bg-cover bg-center"
                style={{
                  backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined,
                }}
              >
                {!slide.imageUrl && (
                  <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-zinc-200">{slide.title1}</p>
                <p className="truncate text-xs text-zinc-500">{slide.title2}</p>
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
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/50 px-4 py-3 text-sm font-medium text-zinc-300 hover:border-amber-500 hover:bg-zinc-800 hover:text-amber-400"
        >
          <span className="text-lg">+</span>
          Add slide
        </button>

        {/* Edit / Add form */}
        {showForm && (
          <div className="mt-6 rounded-lg border border-amber-600/40 bg-zinc-900/80 p-6">
            <h3 className="text-base font-medium text-zinc-200">
              {adding ? "New slide" : "Edit slide"}
            </h3>
            <div className="mt-4 space-y-4">
              <ImageUploadField
                value={formSlide.imageUrl}
                onChange={(url) => setFormSlide((p) => ({ ...p, imageUrl: url }))}
                label="Image URL or upload"
                folder="carousel"
                onError={(text) => setMessage({ type: "err", text })}
              />
              <div>
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Title line 1
                </label>
                <input
                  type="text"
                  value={formSlide.title1}
                  onChange={(e) =>
                    setFormSlide((p) => ({ ...p, title1: e.target.value }))
                  }
                  placeholder="e.g. THE BEST LUXURY HOTEL"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Title line 2
                </label>
                <input
                  type="text"
                  value={formSlide.title2}
                  onChange={(e) =>
                    setFormSlide((p) => ({ ...p, title2: e.target.value }))
                  }
                  placeholder="e.g. IN NAJAF"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
                >
                  {adding ? "Add slide" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setEditingIndex(null);
                  }}
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
