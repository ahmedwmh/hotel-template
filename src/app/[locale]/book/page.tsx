import { getActiveRooms } from "@/lib/actions/rooms";
import { hotelImages } from "@/lib/hotel-images";
import { getMessages, type Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { BookingForm } from "@/Components/forms/BookingForm";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ room?: string; checkIn?: string; checkOut?: string }>;
}) {
  const { locale } = await params;
  const { room: roomId, checkIn, checkOut } = await searchParams;
  const messages = getMessages(locale);
  const rooms = await getActiveRooms();

  const m = messages.booking as Record<string, string>;
  const common = messages.common as Record<string, string>;

  const isAr = locale === "ar";
  const pageTitle = isAr ? "احجز غرفة" : "Book a Room";
  const pageSubtitle = isAr
    ? "أكمل بياناتك وتواريخ إقامتك للحجز."
    : "Complete your details and stay dates to reserve.";

  return (
    <main className="min-h-screen">
      <PublicNavbar locale={locale} />

      {/* Breadcrumb / Header */}
      <section
        className="bg-no-repeat bg-cover min-h-[280px] lg:min-h-[320px] bg-center grid items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,0.5), rgba(30,30,30,0.5)), url(${hotelImages.breadcrumb})`,
          backgroundSize: "cover",
        }}
      >
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <hr className="w-[100px] h-[1px] bg-[#C9A24D]" />
            <img src="/images/logo/logo-s.svg" alt="" className="w-[50px] h-[50px]" />
            <hr className="w-[100px] h-[1px] bg-[#C9A24D]" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-tight text-white font-semibold font-Garamond uppercase">
            {pageTitle}
          </h1>
          <p className="mt-3 text-base lg:text-lg text-[#acacac] font-Lora max-w-xl mx-auto">
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* Booking form */}
      <section className="py-16 2xl:py-24 bg-[#000] bg-no-repeat bg-top">
        <div
          className="Container px-4 md:px-6"
          style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
        >
          <BookingForm
            rooms={rooms}
            locale={locale}
            messages={{
              guestName: m.guestName,
              guestEmail: m.guestEmail,
              guestPhone: m.guestPhone,
              checkIn: m.checkIn,
              checkOut: m.checkOut,
              room: m.room,
              totalGuests: m.totalGuests,
              submit: common.submit,
              loading: common.loading,
              roomUnavailable: m.roomUnavailable,
              unavailableTitle: m.unavailableTitle,
              unavailableDescription: m.unavailableDescription,
              invalidDatesTitle: m.invalidDatesTitle,
              invalidDatesDescription: m.invalidDatesDescription,
              errorTitle: m.errorTitle,
              success: m.success,
            }}
            defaultRoomId={roomId ?? undefined}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
          />
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
