/**
 * Content admin: pages and sections for the grid UX.
 * Each page has sections; each section has content keys (SiteSetting).
 */

export type ContentKeyDef = {
  key: string;
  label: string;
  locale: boolean;
  type?: "text" | "textarea" | "json";
};

export type ContentSection = {
  id: string;
  label: string;
  description?: string;
  keys: ContentKeyDef[];
};

export type ContentPage = {
  id: string;
  label: string;
  description?: string;
  path?: string; // public path e.g. "/en" for home
  sections: ContentSection[];
};

/** All keys that may be used in any section (for validation). */
export function getAllContentKeys(): string[] {
  const keys = new Set<string>();
  CONTENT_PAGES.forEach((p) => {
    p.sections.forEach((s) => s.keys.forEach((k) => keys.add(k.key)));
  });
  return Array.from(keys);
}

export const CONTENT_PAGES: ContentPage[] = [
  {
    id: "home",
    label: "Home",
    description: "Hero, rooms, hotel info, offers, testimonials, blog",
    path: "/",
    sections: [
      {
        id: "carousel",
        label: "Hero / Carousel",
        description: "Main hero slider and headlines",
        keys: [
          { key: "hero_title", label: "Hero title", locale: true },
          { key: "hero_subtitle", label: "Hero subtitle", locale: true },
          { key: "hero_slides", label: "Carousel slides (JSON)", locale: true, type: "textarea" },
        ],
      },
      {
        id: "rooms",
        label: "Rooms section",
        description: "Rooms & suites block on home",
        keys: [
          { key: "home_rooms_title", label: "Section title", locale: true },
          { key: "home_rooms_subtitle", label: "Section subtitle", locale: true },
        ],
      },
      {
        id: "hotel-resort",
        label: "Hotel & Resort",
        description: "Luxury hotel intro block",
        keys: [
          { key: "hotel_resort_title", label: "Title", locale: true },
          { key: "hotel_resort_subtitle", label: "Subtitle", locale: true },
          { key: "hotel_resort_description", label: "Description", locale: true },
        ],
      },
      {
        id: "hotel-facilities",
        label: "Hotel & Facilities",
        description: "Facilities intro",
        keys: [
          { key: "hotel_facilities_title", label: "Title", locale: true },
          { key: "hotel_facilities_subtitle", label: "Subtitle", locale: true },
        ],
      },
      {
        id: "action",
        label: "About Hotel / Manager & Video",
        description: "Manager quote, description and hotel video block (two languages)",
        keys: [
          { key: "action_title", label: "Title", locale: true },
          { key: "action_description", label: "Description (first paragraph)", locale: true, type: "textarea" },
          { key: "action_quote", label: "Quote (italic)", locale: true, type: "textarea" },
          { key: "action_manager_name", label: "Manager name", locale: true },
          { key: "action_manager_role", label: "Manager role", locale: true },
          { key: "action_video_url", label: "Video URL (YouTube/Vimeo embed)", locale: false },
          { key: "action_video_poster", label: "Video poster image URL (optional)", locale: false },
          { key: "action_manager_avatar", label: "Manager avatar image URL (optional)", locale: false },
        ],
      },
      {
        id: "facilities",
        label: "Facilities",
        description: "Facilities list section (items with image, title, description)",
        keys: [
          { key: "facilities_title", label: "Section title", locale: true },
          { key: "facilities_subtitle", label: "Section subtitle", locale: true },
          { key: "facilities_items", label: "Facilities list (JSON)", locale: true, type: "textarea" },
        ],
      },
      {
        id: "offers",
        label: "Offers",
        description: "Offers section",
        keys: [
          { key: "offers_title", label: "Section title", locale: true },
          { key: "offers_subtitle", label: "Section subtitle", locale: true },
        ],
      },
      {
        id: "testimonials",
        label: "Testimonials",
        description: "Guest testimonials (quote, author, avatar)",
        keys: [
          { key: "testimonials_title", label: "Section title", locale: true },
          { key: "testimonials_subtitle", label: "Section subtitle", locale: true },
          { key: "testimonials_list", label: "Testimonials list (JSON)", locale: true, type: "textarea" },
        ],
      },
      {
        id: "latest-blog",
        label: "Latest Blog",
        description: "Blog posts (title, date, category, image)",
        keys: [
          { key: "blog_title", label: "Section title", locale: true },
          { key: "blog_subtitle", label: "Section subtitle", locale: true },
          { key: "blog_posts", label: "Blog posts list (JSON)", locale: true, type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    description: "About page content",
    path: "/about",
    sections: [
      {
        id: "about-main",
        label: "About content",
        description: "Title, subtitle, main text and optional image",
        keys: [
          { key: "about_title", label: "Page title", locale: true },
          { key: "about_subtitle", label: "Subtitle (small label above title)", locale: true },
          { key: "about_text", label: "About text (main body)", locale: true, type: "textarea" },
          { key: "about_image", label: "About section image URL (optional)", locale: false, type: "text" },
        ],
      },
    ],
  },
  {
    id: "restaurants",
    label: "Restaurants",
    description: "Restaurants & venues page (Zuwar, Beit Al Qahwa, Jalsa Shisha Lounge)",
    path: "/restaurants",
    sections: [
      {
        id: "list",
        label: "Restaurants & venues list",
        description: "Venues with image, title, subtitle and description (EN/AR)",
        keys: [
          { key: "restaurants_list", label: "Restaurants list (JSON)", locale: false, type: "json" },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    description: "Contact page and global contact info",
    path: "/contact",
    sections: [
      {
        id: "contact-hero",
        label: "Contact page heading",
        description: "Title and intro text",
        keys: [
          { key: "contact_title", label: "Page title", locale: true },
          { key: "contact_subtitle", label: "Subtitle", locale: true },
          { key: "contact_description", label: "Description (intro paragraph)", locale: true, type: "textarea" },
        ],
      },
      {
        id: "contact-info",
        label: "Contact information",
        description: "Email, phone, address",
        keys: [
          { key: "contact_email", label: "Email", locale: true },
          { key: "contact_phone", label: "Phone", locale: true },
          { key: "contact_address", label: "Address", locale: true },
        ],
      },
      {
        id: "contact-form",
        label: "Contact form & map",
        description: "Form heading and map embed",
        keys: [
          { key: "contact_form_heading", label: "Form section heading", locale: true },
          { key: "contact_map_embed", label: "Google Maps embed URL (iframe src)", locale: false, type: "text" },
        ],
      },
    ],
  },
];

export function getPageById(id: string): ContentPage | undefined {
  return CONTENT_PAGES.find((p) => p.id === id);
}

export function getSectionById(pageId: string, sectionId: string): ContentSection | undefined {
  const page = getPageById(pageId);
  return page?.sections.find((s) => s.id === sectionId);
}
