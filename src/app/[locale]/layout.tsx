import React from "react";
import { locales, type Locale, getDir } from "@/lib/i18n";
import { notFound } from "next/navigation";

/** All pages under [locale] depend on DB (rooms, site settings). Render on request, not at build. */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const dir = getDir(locale as Locale);
  return <div dir={dir} lang={locale}>{children}</div>;
}
