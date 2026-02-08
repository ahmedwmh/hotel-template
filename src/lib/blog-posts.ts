export type BlogPostItem = {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  slug?: string;
};

const DEFAULT: BlogPostItem[] = [
  { id: "1", title: "Luxury Hotel for Traveling Spot", date: "August 10, 2023", category: "Interior", image: "/images/home-1/blog-1.jpg" },
  { id: "2", title: "Best Resort for Family Vacation", date: "August 12, 2023", category: "Travel", image: "/images/home-1/blog-2.jpg" },
  { id: "3", title: "Top 10 Hotels with Amazing Views", date: "August 15, 2023", category: "Tips", image: "/images/home-1/blog-3.jpg" },
];

export function parseBlogPosts(json: string | null | undefined): BlogPostItem[] {
  if (!json || json.trim() === "") return [...DEFAULT];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT];
    return parsed.map((item) => ({
      id: typeof item?.id === "string" ? item.id : String(Date.now()),
      title: typeof item?.title === "string" ? item.title : "",
      date: typeof item?.date === "string" ? item.date : "",
      category: typeof item?.category === "string" ? item.category : "",
      image: typeof item?.image === "string" ? item.image : "",
      slug: typeof item?.slug === "string" ? item.slug : undefined,
    })).filter((p) => p.title || p.image);
  } catch {
    return [...DEFAULT];
  }
}

export function stringifyBlogPosts(items: BlogPostItem[]): string {
  return JSON.stringify(items, null, 2);
}
