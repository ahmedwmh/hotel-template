export type FacilityItem = {
  image: string;
  number: string;
  categoryEn: string;
  categoryAr: string;
  titleEn: string;
  titleAr: string;
  description: string;
};

const DEFAULT: FacilityItem[] = [
  {
    image: "/images/home-1/facilities-1.png",
    number: "01",
    categoryEn: "Fitness",
    categoryAr: "لياقة",
    titleEn: "Gym Training Grounds",
    titleAr: "صالة رياضية",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model.",
  },
  {
    image: "/images/home-1/facilities-thumb-2.jpg",
    number: "02",
    categoryEn: "Fitness",
    categoryAr: "لياقة",
    titleEn: "Indoor Swimming Pool",
    titleAr: "مسبح داخلي",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model.",
  },
  {
    image: "/images/home-1/facilities-thumb-3.jpg",
    number: "03",
    categoryEn: "FOODS",
    categoryAr: "مطعم",
    titleEn: "The Restaurant Center",
    titleAr: "المطعم",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model.",
  },
  {
    image: "/images/home-1/facilities-thumb-4.jpg",
    number: "04",
    categoryEn: "EXPERIENCE",
    categoryAr: "تجربة",
    titleEn: "Gym Training Grounds",
    titleAr: "صالة رياضية",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model.",
  },
];

export function parseFacilitiesItems(json: string | null | undefined): FacilityItem[] {
  if (!json || json.trim() === "") return [...DEFAULT];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT];
    return parsed.map((item) => ({
      image: typeof item?.image === "string" ? item.image : "",
      number: typeof item?.number === "string" ? item.number : "",
      categoryEn: typeof item?.categoryEn === "string" ? item.categoryEn : "",
      categoryAr: typeof item?.categoryAr === "string" ? item.categoryAr : "",
      titleEn: typeof item?.titleEn === "string" ? item.titleEn : "",
      titleAr: typeof item?.titleAr === "string" ? item.titleAr : "",
      description: typeof item?.description === "string" ? item.description : "",
    })).filter((f) => f.titleEn || f.titleAr);
  } catch {
    return [...DEFAULT];
  }
}

export function stringifyFacilitiesItems(items: FacilityItem[]): string {
  return JSON.stringify(items, null, 2);
}
