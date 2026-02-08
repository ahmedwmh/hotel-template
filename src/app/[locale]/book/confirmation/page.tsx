import Link from "next/link";
import { getMessages, type Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { HiCheckCircle } from "react-icons/hi2";
import { BookingConfirmationCard } from "./BookingConfirmationCard";

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ reference?: string }>;
}) {
  const { locale } = await params;
  const { reference } = await searchParams;
  const messages = getMessages(locale);
  const m = messages.booking as Record<string, string>;

  const isAr = locale === "ar";
  const backHomeLabel = isAr ? "العودة للرئيسية" : "Back to home";
  const viewRoomsLabel = isAr ? "عرض الغرف" : "View rooms";
  const bookAgainLabel = isAr ? "حجز آخر" : "Book again";
  const refLabel = isAr ? "رقم المرجع" : "Reference number";
  const saveRefLabel = isAr ? "احتفظ بهذا الرقم للمتابعة." : "Keep this number for your records.";
  const copyLabel = isAr ? "نسخ" : "Copy";
  const copiedLabel = isAr ? "تم النسخ" : "Copied";

  return (
    <main className="min-h-screen bg-zinc-950">
      <PublicNavbar locale={locale} />

      {/* Dark hero strip */}
      <section className="bg-[#1e1e1e] border-b border-zinc-800">
        <div className="max-w-[1330px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <hr className="w-16 sm:w-24 h-px border-0 bg-[#C9A24D]/50" />
            <HiCheckCircle className="w-8 h-8 text-[#C9A24D] shrink-0" aria-hidden />
            <hr className="w-16 sm:w-24 h-px border-0 bg-[#C9A24D]/50" />
          </div>
          <h1 className="font-Garamond text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-zinc-100">
            {isAr ? "تم تأكيد طلبك" : "Booking confirmed"}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6">
        <div className="max-w-xl mx-auto">
          <BookingConfirmationCard
            successMessage={m.success}
            reference={reference ?? null}
            refLabel={refLabel}
            saveRefLabel={saveRefLabel}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            backHomeHref={`/${locale}`}
            backHomeLabel={backHomeLabel}
            viewRoomsHref={`/${locale}/rooms`}
            viewRoomsLabel={viewRoomsLabel}
            bookAgainHref={`/${locale}/book`}
            bookAgainLabel={bookAgainLabel}
          />
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
