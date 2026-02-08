export type TestimonialItem = {
  quote: string;
  authorName: string;
  role?: string;
  avatar?: string;
};

const DEFAULT: TestimonialItem[] = [
  {
    quote: "Professionally repurpose flexible testing procedures via molla in customer service.",
    authorName: "John D. Alexon",
    role: "Guest",
    avatar: "/images/home-1/testi-author.png",
  },
  {
    quote: "Model. Appropriately create interactive infrastructures after main.",
    authorName: "Sarah M. Johnson",
    role: "Traveler",
    avatar: "/images/home-1/testi-author-2.png",
  },
];

export function parseTestimonialItems(json: string | null | undefined): TestimonialItem[] {
  if (!json || json.trim() === "") return [...DEFAULT];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT];
    return parsed.map((item) => ({
      quote: typeof item?.quote === "string" ? item.quote : "",
      authorName: typeof item?.authorName === "string" ? item.authorName : "",
      role: typeof item?.role === "string" ? item.role : undefined,
      avatar: typeof item?.avatar === "string" ? item.avatar : undefined,
    })).filter((t) => t.quote || t.authorName);
  } catch {
    return [...DEFAULT];
  }
}

export function stringifyTestimonialItems(items: TestimonialItem[]): string {
  return JSON.stringify(items, null, 2);
}
