import { getSiteSetting } from "@/lib/actions/site-content";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";

const DEFAULT_LOGO = "/images/logo/logo-s.svg";

type Props = {
  locale: Locale;
  children: React.ReactNode;
};

/** Fetches logo and contact info from DB and renders public shell. */
export async function PublicLayout({ locale, children }: Props) {
  const [logoRes, emailRes, phoneRes, phone2Res, addressRes] = await Promise.all([
    getSiteSetting("logo_url", null),
    getSiteSetting("contact_email", locale),
    getSiteSetting("contact_phone", locale),
    getSiteSetting("contact_phone_2", locale),
    getSiteSetting("contact_address", locale),
  ]);

  const logoUrl =
    logoRes.success && logoRes.value && logoRes.value.trim() !== ""
      ? logoRes.value.trim()
      : DEFAULT_LOGO;
  const contactEmail = (emailRes.success ? emailRes.value : null)?.trim() ?? "";
  const contactPhone = (phoneRes.success ? phoneRes.value : null)?.trim() ?? "";
  const contactPhone2 = (phone2Res.success ? phone2Res.value : null)?.trim() ?? "";
  const contactAddress = (addressRes.success ? addressRes.value : null)?.trim() ?? "";

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
