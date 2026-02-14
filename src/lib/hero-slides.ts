/**
 * Hero carousel slide shape and defaults.
 * Stored as JSON in SiteSetting key "hero_slides" (single list, locale: false).
 * Each slide has titles in English and Arabic.
 */

export type HeroSlide = {
  imageUrl: string;
  /** Title line 1 – English */
  title1En: string;
  /** Title line 2 – English */
  title2En: string;
  /** Title line 1 – Arabic */
  title1Ar: string;
  /** Title line 2 – Arabic */
  title2Ar: string;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85",
    title1En: "THE BEST LUXURY HOTEL",
    title2En: "IN NAJAF",
    title1Ar: "أفضل فندق فاخر",
    title2Ar: "في النجف",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85",
    title1En: "THE BEST LUXURY HOTEL",
    title2En: "& RESORT",
    title1Ar: "أفضل فندق فاخر",
    title2Ar: "ومنتجع",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85",
    title1En: "COMFORT & ELEGANCE",
    title2En: "IN THE HEART OF NAJAF",
    title1Ar: "راحة وأناقة",
    title2Ar: "في قلب النجف",
  },
];

function normalizeSlide(item: unknown): HeroSlide {
  const o = item as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  // Support legacy shape (title1, title2) as fallback
  const title1 = str(o?.title1);
  const title2 = str(o?.title2);
  return {
    imageUrl: str(o?.imageUrl),
    title1En: str(o?.title1En) || title1,
    title2En: str(o?.title2En) || title2,
    title1Ar: str(o?.title1Ar) || title1,
    title2Ar: str(o?.title2Ar) || title2,
  };
}

export function parseHeroSlides(json: string | null | undefined): HeroSlide[] {
  if (!json || json.trim() === "") return [...DEFAULT_SLIDES];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_SLIDES];
    return parsed
      .map((item) => normalizeSlide(item))
      .filter((s) => s.imageUrl || s.title1En || s.title2En || s.title1Ar || s.title2Ar);
  } catch {
    return [...DEFAULT_SLIDES];
  }
}

export function stringifyHeroSlides(slides: HeroSlide[]): string {
  return JSON.stringify(slides, null, 2);
}

export { DEFAULT_SLIDES };
