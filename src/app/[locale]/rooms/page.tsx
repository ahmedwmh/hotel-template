import Link from "next/link";
import { getActiveRooms } from "@/lib/actions/rooms";
import { hotelImages } from "@/lib/hotel-images";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { RoomCard } from "@/Components/public/RoomCard";

function getRoomImage(index: number) {
  return hotelImages.rooms[index % hotelImages.rooms.length];
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const rooms = await getActiveRooms();

  const isAr = locale === "ar";
  const pageTitle = isAr ? "جميع الغرف والأجنحة" : "Rooms & Suites";
  const pageSubtitle = isAr
    ? "إقامة مريحة مع خدمة ممتازة في قلب النجف."
    : "Comfortable stay with excellent service in the heart of Najaf.";
  const roomLabel = isAr ? "غرفة" : "Room";
  const guestsLabel = isAr ? "ضيوف" : "guests";
  const nightLabel = isAr ? "ليلة" : "Night";
  const viewDetailsLabel = isAr ? "عرض التفاصيل" : "View Details";
  const bookLabel = isAr ? "احجز" : "Book";
  const noRoomsLabel = isAr ? "لا توجد غرف متاحة حالياً." : "No rooms available at the moment.";

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

      {/* Rooms grid */}
      <section className="py-16 2xl:py-24 bg-[#000]">
        <div
          className="Container px-4 md:px-6"
          style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
        >
          {rooms.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  imageSrc={room.images?.[0] ?? getRoomImage(index)}
                  locale={locale}
                  roomLabel={roomLabel}
                  guestsLabel={guestsLabel}
                  nightLabel={nightLabel}
                  viewDetailsLabel={viewDetailsLabel}
                  bookLabel={bookLabel}
                  isAr={isAr}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 font-Lora text-lg">{noRoomsLabel}</p>
              <Link
                href={`/${locale}`}
                className="inline-block mt-6 px-8 py-3 bg-[#C9A24D] text-white font-Garamond font-medium uppercase hover:bg-[#B8923F] transition-colors"
              >
                {isAr ? "العودة للرئيسية" : "Back to Home"}
              </Link>
            </div>
          )}
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
