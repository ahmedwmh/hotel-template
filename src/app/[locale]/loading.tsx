import { PublicLoading } from "@/Components/public/PublicLoading";

/**
 * Loading for [locale] (e.g. /en, /ar). Full-page loading until content is ready.
 */
export default function LocaleLoading() {
  return <PublicLoading fullScreen />;
}
