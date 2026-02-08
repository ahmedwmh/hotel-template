/**
 * Hero carousel slide shape and defaults.
 * Stored as JSON in SiteSetting key "hero_slides" per locale.
 */

export type HeroSlide = {
  imageUrl: string;
  title1: string;
  title2: string;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85",
    title1: "THE BEST LUXURY HOTEL",
    title2: "IN NAJAF",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85",
    title1: "THE BEST LUXURY HOTEL",
    title2: "& RESORT",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85",
    title1: "COMFORT & ELEGANCE",
    title2: "IN THE HEART OF NAJAF",
  },
];

export function parseHeroSlides(json: string | null | undefined): HeroSlide[] {
  if (!json || json.trim() === "") return [...DEFAULT_SLIDES];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_SLIDES];
    return parsed.map((item) => ({
      imageUrl: typeof item?.imageUrl === "string" ? item.imageUrl : "",
      title1: typeof item?.title1 === "string" ? item.title1 : "",
      title2: typeof item?.title2 === "string" ? item.title2 : "",
    })).filter((s) => s.imageUrl || s.title1 || s.title2);
  } catch {
    return [...DEFAULT_SLIDES];
  }
}

export function stringifyHeroSlides(slides: HeroSlide[]): string {
  return JSON.stringify(slides, null, 2);
}

export { DEFAULT_SLIDES };
