import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function getMessages(locale: Locale) {
  return locale === "ar" ? ar : en;
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
