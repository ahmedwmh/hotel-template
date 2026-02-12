export type RestaurantItem = {
  imageUrl: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  descriptionEn: string;
  descriptionAr: string;
};

export function parseRestaurantsList(json: string | null | undefined): RestaurantItem[] {
  if (!json || json.trim() === "") return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      imageUrl: typeof item?.imageUrl === "string" ? item.imageUrl : "",
      titleEn: typeof item?.titleEn === "string" ? item.titleEn : "",
      titleAr: typeof item?.titleAr === "string" ? item.titleAr : "",
      subtitleEn: typeof item?.subtitleEn === "string" ? item.subtitleEn : "",
      subtitleAr: typeof item?.subtitleAr === "string" ? item.subtitleAr : "",
      descriptionEn: typeof item?.descriptionEn === "string" ? item.descriptionEn : "",
      descriptionAr: typeof item?.descriptionAr === "string" ? item.descriptionAr : "",
    })).filter((r) => r.titleEn || r.titleAr);
  } catch {
    return [];
  }
}

export function stringifyRestaurantsList(items: RestaurantItem[]): string {
  return JSON.stringify(items, null, 2);
}
