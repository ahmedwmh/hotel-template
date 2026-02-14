/**
 * Site content keys and types for admin UI and public pages.
 * Kept in a separate file so "use server" actions file only exports async functions.
 */

export type GetSiteSettingResult =
  | { success: true; value: string | null }
  | { success: false; error: string };

export type SetSiteSettingResult =
  | { success: true }
  | { success: false; error: string };

export const CONTENT_KEYS = [
  { key: "logo_url", label: "Logo URL", locale: false },
  { key: "hero_title", label: "Hero title", locale: true },
  { key: "hero_subtitle", label: "Hero subtitle", locale: true },
  { key: "about_text", label: "About text", locale: true },
  { key: "contact_email", label: "Contact email", locale: true },
  { key: "contact_phone", label: "Contact phone (primary)", locale: true },
  { key: "contact_phone_2", label: "Contact phone (secondary)", locale: true },
  { key: "contact_address", label: "Contact address", locale: true },
] as const;
