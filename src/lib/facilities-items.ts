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
    categoryEn: "Services",
    categoryAr: "خدمات",
    titleEn: "24-Hour Reception",
    titleAr: "استقبال 24 ساعة",
    description: "Round-the-clock reception for your convenience.",
  },
  {
    image: "/images/home-1/facilities-thumb-2.jpg",
    number: "02",
    categoryEn: "Services",
    categoryAr: "خدمات",
    titleEn: "Room Service",
    titleAr: "خدمة الغرف",
    description: "In-room dining and service at your request.",
  },
  {
    image: "/images/home-1/facilities-thumb-3.jpg",
    number: "03",
    categoryEn: "Dining",
    categoryAr: "مطعم",
    titleEn: "Hotel Restaurant",
    titleAr: "مطعم الفندق",
    description: "Full-service hotel restaurant for breakfast, lunch and dinner.",
  },
  {
    image: "/images/home-1/facilities-thumb-4.jpg",
    number: "04",
    categoryEn: "Dining",
    categoryAr: "مقهى",
    titleEn: "Elegant Coffee Shop",
    titleAr: "كوفي شوب أنيق",
    description: "A refined coffee shop for drinks and light bites.",
  },
  {
    image: "/images/home-1/facilities-1.png",
    number: "05",
    categoryEn: "Lounge",
    categoryAr: "لاونج",
    titleEn: "Luxury Shisha Lounge",
    titleAr: "شيشه لاونج فاخر",
    description: "A luxury shisha lounge for relaxation.",
  },
  {
    image: "/images/home-1/facilities-thumb-2.jpg",
    number: "06",
    categoryEn: "Amenities",
    categoryAr: "مرافق",
    titleEn: "Free Wi-Fi",
    titleAr: "واي فاي مجاني",
    description: "Complimentary high-speed Wi-Fi throughout the hotel.",
  },
  {
    image: "/images/home-1/facilities-thumb-3.jpg",
    number: "07",
    categoryEn: "Amenities",
    categoryAr: "مرافق",
    titleEn: "Modern Elevators",
    titleAr: "مصاعد حديثة",
    description: "Modern elevators for easy access to all floors.",
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
