import { getSiteSettingsBatch } from "@/lib/actions/site-content";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";

const DEFAULT_LOGO = "/images/logo/logo-s.svg";

type Props = {
  locale: Locale;
  children: React.ReactNode;
};

function get(batch: Record<string, string | null>, key: string, locale: string | null): string | null {
  return batch[`${key}:${locale ?? ""}`] ?? null;
}

/** Fetches logo and contact info from DB and renders public shell. */
export async function PublicLayout({ locale, children }: Props) {
  const batch = await getSiteSettingsBatch([
    { key: "logo_url", locale: null },
    { key: "contact_email", locale },
    { key: "contact_phone", locale },
    { key: "contact_phone_2", locale },
    { key: "contact_address", locale },
  ]);

  const logoVal = get(batch, "logo_url", null)?.trim();
  const logoUrl = logoVal && logoVal !== "" ? logoVal : DEFAULT_LOGO;
  const contactEmail = get(batch, "contact_email", locale)?.trim() ?? "";
  const contactPhone = get(batch, "contact_phone", locale)?.trim() ?? "";
  const contactPhone2 = get(batch, "contact_phone_2", locale)?.trim() ?? "";
  const contactAddress = get(batch, "contact_address", locale)?.trim() ?? "";

  return (
    <main className="min-h-screen">
      <PublicNavbar locale={locale} logoUrl={logoUrl} />
      {children}
      <PublicFooter
        locale={locale}
        logoUrl={logoUrl}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        contactPhone2={contactPhone2}
        contactAddress={contactAddress}
      />
    </main>
  );
}
