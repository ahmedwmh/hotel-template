import Link from "next/link";
import { notFound } from "next/navigation";
import { BsCheck2 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { getRoomById } from "@/lib/actions/rooms";
import { hotelImages } from "@/lib/hotel-images";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { RoomDetailsSlider } from "@/Components/public/RoomDetailsSlider";

const ROOM_AMENITIES = [
  { img: "/images/inner/room-amenities-1.png", textEn: "2 - 5 Persons", textAr: "2 - 5 أشخاص" },
  { img: "/images/inner/room-amenities-2.png", textEn: "Free WiFi Available", textAr: "واي فاي مجاني" },
  { img: "/images/inner/room-amenities-3.png", textEn: "Swimming Pools", textAr: "مسابح" },
  { img: "/images/inner/room-amenities-4.png", textEn: "Breakfast", textAr: "إفطار" },
  { img: "/images/inner/room-amenities-5.png", textEn: "250 SQFT Rooms", textAr: "غرف 250 قدم²" },
  { img: "/images/inner/room-amenities-6.png", textEn: "Gym facilities", textAr: "مرافق رياضية" },
];

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const room = await getRoomById(id);
  if (!room) notFound();

  const isAr = locale === "ar";
  const roomLabel = isAr ? "غرفة" : "Room";
  const roomDetailsTitle = isAr ? "تفاصيل الغرفة" : "Room details";
  const homeLabel = isAr ? "الرئيسية" : "Home";
  const luxuryRoom = isAr ? "غرفة فاخرة" : "LUXURY ROOM";
  const checkInLabel = isAr ? "تسجيل الوصول" : "Check In";
  const checkOutLabel = isAr ? "تسجيل المغادرة" : "Check Out";
  const houseRulesLabel = isAr ? "قواعد المنزل" : "House Rules";
  const childrenExtraLabel = isAr ? "الأطفال والأسرّة الإضافية" : "Children & Extra Beds";
  const amenitiesLabel = isAr ? "المرافق" : "Amenities";
  const bookingLabel = isAr ? "الحجز" : "Booking";
  const confirmBookingLabel = isAr ? "تأكيد الحجز" : "Confirm Booking";
  const checkInFrom = isAr ? "تسجيل الوصول من 9:00 صباحاً - في أي وقت" : "Check-in from 9:00 AM - anytime";
  const earlyCheckIn = isAr ? "التسكير المبكر حسب التوفر" : "Early check-in subject to availability";
  const checkOutBefore = isAr ? "التسكير قبل الظهر" : "Check-out before noon";
  const checkOutFrom = isAr ? "التسكير من 9:00 صباحاً - في أي وقت" : "Check-out from 9:00 AM - anytime";
  const rulesText = isAr
    ? "يرجى الالتزام بمواعيد التسكير والهدوء لراحة جميع النزلاء."
    : "Please respect check-in/out times and quiet hours for the comfort of all guests.";
  const childrenText = isAr
    ? "يمكن ترتيب أسرّة إضافية للأطفال حسب الطلب. يرجى الاستفسار عند الحجز."
    : "Extra beds for children can be arranged on request. Please inquire when booking.";

  const displayName = isAr ? (room.nameAr || room.name) : (room.nameEn || room.name);
  const descriptionEn = room.descriptionEn?.trim() || null;
  const descriptionAr = room.descriptionAr?.trim() || null;
  const descriptionParagraphs = isAr
    ? (descriptionAr ? descriptionAr.split("\n").filter(Boolean) : null)
    : (descriptionEn ? descriptionEn.split("\n").filter(Boolean) : null);
  const defaultDesc1 = isAr
    ? "غرفنا مصممة لتوفير راحة واسترخاء مع خدمة ممتازة في قلب النجف."
    : "Our rooms are designed for comfort and relaxation with excellent service in the heart of Najaf.";
  const defaultDesc2 = isAr
    ? "مرافق عالية الجودة وضيافة ترحيبية لضمان إقامة ممتعة."
    : "High-quality amenities and welcoming hospitality for a pleasant stay.";

  const guestRates = Array.from({ length: Math.min(5, room.capacity) }, (_, i) => i + 1).map(
    (g) => ({ guests: g, rate: room.rates[g] ?? room.rate })
  );

  return (
    <main className="min-h-screen" dir={locale}>
      <PublicNavbar locale={locale} />

      {/* Breadcrumb */}
      <section
        className="bg-no-repeat bg-cover min-h-[280px] lg:min-h-[350px] bg-center grid items-center justify-center"
        style={{ backgroundImage: `url(${hotelImages.breadcrumb})`, backgroundSize: "cover" }}
      >
        <div className="mt-10 text-center px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-tight text-white font-semibold font-Garamond uppercase">
            {roomDetailsTitle}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Link
              href={`/${locale}`}
              className="text-base lg:text-xl text-[#c19d68] font-semibold font-Garamond"
            >
              {homeLabel} <span className="mx-2 text-white">/</span>
            </Link>
            <span className="text-base lg:text-xl text-white font-semibold font-Garamond capitalize">
              {displayName}
            </span>
          </div>
        </div>
      </section>

      {/* Room Details */}
      <div className="py-12 2xl:py-20 bg-zinc-900">
        <div
          className="grid grid-cols-1 md:grid-cols-7 lg:grid-cols-6 gap-6 px-4 md:px-6"
          style={{ maxWidth: "1250px", margin: "0 auto" }}
        >
          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <RoomDetailsSlider />
            <div className="pt-5 lg:pt-8 pr-0 lg:pr-3">
              <p className="text-base font-Lora text-[#c19d68]">{luxuryRoom}</p>
              <h2 className="py-2 sm:py-3 md:py-4 lg:py-5 font-Garamond text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] leading-snug text-white font-semibold">
                {displayName}
              </h2>
              {descriptionParagraphs && descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-sm lg:text-base leading-6 text-zinc-400 font-Lora mt-2" : "mt-4 text-sm lg:text-base leading-6 text-zinc-400 font-Lora"}>
                    {p}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-sm lg:text-base leading-6 text-zinc-400 font-Lora mt-2">
                    {defaultDesc1}
                  </p>
                  <p className="mt-4 text-sm lg:text-base leading-6 text-zinc-400 font-Lora">
                    {defaultDesc2}
                  </p>
                </>
              )}

              {/* Check-in / Check-out */}
              <div className="md:flex md:justify-between gap-8 py-10 lg:py-14">
                <div>
                  <div className="flex items-center gap-2">
                    <FiLogOut className="text-[#c19d68] rotate-180" size={24} />
                    <h4 className="text-lg md:text-xl lg:text-2xl font-Garamond text-white font-semibold">
                      {checkInLabel}
                    </h4>
                  </div>
                  <ul className="space-y-2 lg:space-y-3 mt-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 size={16} className="text-[#c19d68] shrink-0" />
                      <span className="text-sm lg:text-base text-zinc-400 font-Lora">{checkInFrom}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 size={16} className="text-[#c19d68] shrink-0" />
                      <span className="text-sm lg:text-base text-zinc-400 font-Lora">{earlyCheckIn}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="flex items-center gap-2">
                    <FiLogOut className="text-[#c19d68]" size={24} />
                    <h4 className="text-lg md:text-xl lg:text-2xl font-Garamond text-white font-semibold">
                      {checkOutLabel}
                    </h4>
                  </div>
                  <ul className="space-y-2 lg:space-y-3 mt-4">
                    <li className="flex items-center gap-2">
                      <BsCheck2 size={16} className="text-[#c19d68] shrink-0" />
                      <span className="text-sm lg:text-base text-zinc-400 font-Lora">{checkOutBefore}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsCheck2 size={16} className="text-[#c19d68] shrink-0" />
                      <span className="text-sm lg:text-base text-zinc-400 font-Lora">{checkOutFrom}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="pb-3 lg:pb-4 font-Garamond text-xl sm:text-2xl md:text-3xl text-white font-semibold">
                  {houseRulesLabel}
                </h2>
                <p className="text-sm lg:text-base leading-6 text-zinc-400 font-Lora">
                  {rulesText}
                </p>
              </div>

              <div className="pt-10 2xl:pt-14">
                <h2 className="pb-3 lg:pb-4 font-Garamond text-xl sm:text-2xl md:text-3xl text-white font-semibold">
                  {childrenExtraLabel}
                </h2>
                <p className="text-sm lg:text-base leading-6 text-zinc-400 font-Lora mb-4">
                  {childrenText}
                </p>
                <ul className="space-y-2">
                  {guestRates.map(({ guests, rate }) => (
                    <li key={guests} className="flex items-center gap-2">
                      <BsCheck2 size={16} className="text-[#c19d68] shrink-0" />
                      <span className="text-sm lg:text-base text-zinc-400 font-Lora">
                        {guests} {guests === 1 ? (isAr ? "ضيف" : "guest") : isAr ? "ضيوف" : "guests"} • {rate} / {isAr ? "ليلة" : "night"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar: Booking + Amenities */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <div className="bg-zinc-800 border border-zinc-600 px-6 py-8 lg:px-8 lg:py-10">
              <h4 className="font-Garamond text-xl md:text-2xl lg:text-3xl text-white font-semibold mb-4">
                {bookingLabel}
              </h4>
              <div className="space-y-3">
                <div className="bg-zinc-700/50 border border-zinc-600 h-12 lg:h-14 flex items-center px-4">
                  <p className="text-sm lg:text-base font-Lora text-zinc-100">
                    {roomLabel} — <span className="text-[#c19d68]">{displayName}</span>
                  </p>
                </div>
                <div className="bg-zinc-700/50 border border-zinc-600 h-12 lg:h-14 flex items-center px-4">
                  <p className="text-sm lg:text-base font-Lora text-zinc-100">
                    {isAr ? "السعة" : "Capacity"} — <span className="text-[#c19d68]">{room.capacity}</span>{" "}
                    {isAr ? "ضيوف" : "guests"}
                  </p>
                </div>
                <div className="bg-zinc-700/50 border border-zinc-600 h-12 lg:h-14 flex items-center px-4">
                  <p className="text-sm lg:text-base font-Lora text-zinc-100">
                    {isAr ? "السعر" : "Rate"} — <span className="text-[#c19d68]">{room.rate}</span> /{" "}
                    {isAr ? "ليلة" : "night"} {isAr ? "(لـ 1 ضيف)" : "(1 guest)"}
                  </p>
                </div>
              </div>
              <div className="pt-5">
                <Link
                  href={`/${locale}/book?room=${room.id}`}
                  className="block w-full h-12 2xl:h-14 bg-[#c19d68] text-white font-Lora font-semibold text-center leading-[3rem] hover:bg-[#a88652] transition-colors"
                >
                  {confirmBookingLabel}
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-Garamond text-xl md:text-2xl lg:text-3xl text-white font-semibold mb-4">
                {amenitiesLabel}
              </h4>
              <div className="bg-zinc-800 border border-zinc-600">
                {ROOM_AMENITIES.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-4 px-4 ${i < ROOM_AMENITIES.length - 1 ? "border-b border-zinc-600" : ""}`}
                  >
                    <img src={a.img} alt="" className="w-8 h-8 object-contain opacity-90" />
                    <span className="text-sm lg:text-base text-zinc-400 font-Lora">
                      {isAr ? a.textAr : a.textEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter locale={locale} />
    </main>
  );
}
