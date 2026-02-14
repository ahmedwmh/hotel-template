"use client";

import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Locale } from "@/lib/i18n";

const DEFAULT_SUBTITLE: Record<Locale, string> = {
  en: "LUXURY HOTEL AND RESORT",
  ar: "فندق ومنتجع فاخر",
};
const DEFAULT_TITLE: Record<Locale, string> = {
  en: "LUXURY BEST HOTEL IN NAJAF",
  ar: "أفضل فندق فاخر في النجف",
};
const DEFAULT_DESCRIPTION: Record<Locale, string> = {
  en: "At Najaf International Hotel, we believe that true hospitality is not measured by service alone, but by respect, genuine care, and the sense of peace throughout the stay.",
  ar: "في فندق النجف الدولي نؤمن بأن الضيافة الحقيقية لا تُقاس بالخدمة فقط بل بالاحترام والاهتمام والشعور بالطمأنينة طوال الإقامة.",
};
const DEFAULT_ROOMS_LABEL: Record<Locale, string> = {
  en: "Luxury Rooms",
  ar: "غرف فاخرة",
};
const DEFAULT_RATINGS_LABEL: Record<Locale, string> = {
  en: "Customer Ratings",
  ar: "تقييم العملاء",
};
const DEFAULT_MORE_LABEL: Record<Locale, string> = {
  en: "More About",
  ar: "المزيد عنا",
};

type HotelAndResortNextProps = {
  locale: Locale;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  roomsCount?: number;
  roomsCountOverride?: number;
  rating?: string;
  luxuryRoomsLabel?: string;
  customerRatingsLabel?: string;
  moreAboutLabel?: string;
};

export function HotelAndResortNext({
  locale,
  title,
  subtitle,
  description,
  imageUrl,
  roomsCount,
  roomsCountOverride,
  rating = "4.9",
  luxuryRoomsLabel,
  customerRatingsLabel,
  moreAboutLabel,
}: HotelAndResortNextProps) {
  const descriptionText = description?.trim() || DEFAULT_DESCRIPTION[locale];
  const displayRoomsCount = roomsCountOverride ?? roomsCount ?? 50;
  const sectionSubtitle = subtitle?.trim() || DEFAULT_SUBTITLE[locale];
  const sectionTitle = title?.trim() || DEFAULT_TITLE[locale];
  const moreLabel = moreAboutLabel?.trim() || DEFAULT_MORE_LABEL[locale];
  const roomsLabel = luxuryRoomsLabel?.trim() || DEFAULT_ROOMS_LABEL[locale];
  const ratingsLabel = customerRatingsLabel?.trim() || DEFAULT_RATINGS_LABEL[locale];

  const imageSrc = imageUrl?.trim() || "/images/home-1/Hotel1.jpg";

  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width:320px)": {
        slides: { perView: 1, spacing: 20 },
      },
    },
    loop: true,
    initial: 0,
  });

  return (
    <section className="bg-[#000] py-20 2xl:py-[120px]">
      <div className="Container sm:overflow-hidden lg:overflow-auto" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
        <div className="md:flex items-center justify-between">
          <div className="flex-1 keen-slider w-screen md:w-[60%] 2xl:w-[580px] md:pr-5 lg:pr-6 xl:pr-8 2xl:pr-9 3xl:pr-10 md:mt-0" ref={sliderRef}>
            <div className="keen-slider__slide">
              <img src={imageSrc} className="h-[85%] lg:h-[90%] w-full object-cover" alt="Hotel" />
            </div>
            {!imageUrl && (
              <div className="keen-slider__slide">
                <img src="/images/home-1/Hotel.png" className="h-[85%] md:h-[100%] lg:h-[90%] w-full object-cover" alt="Hotel" />
              </div>
            )}
          </div>
          <div className="flex-1 font-Garamond mt-5 md:mt-0 md:pl-8 p-5 lg:pl-10 2xl:pl-14" dir={locale === "ar" ? "rtl" : "ltr"}>
            <h5 className="text-base text-[#C9A24D] leading-[26px] font-medium">
              {sectionSubtitle}
            </h5>
            <h1 className="text-[22px] sm:text-2xl md:text-[21px] xl:text-3xl 2xl:text-[38px] leading-6 md:leading-7 lg:leading-[30px] 2xl:leading-[44px] text-white font-semibold my-4">
              {sectionTitle}
            </h1>
            <p className="text-sm xl:text-base font-Lora text-[#acacac] font-normal leading-[26px]">
              {descriptionText}
            </p>
            <div className="flex items-center mt-4 md:mt-3 lg:mt-4">
              <div>
                <h2 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 3xl:text-[70px] leading-[42px] text-[#C9A24D] font-medium">
                  {displayRoomsCount}+
                </h2>
                <p className="text-sm sm:text-base leading-[26px] text-[#acacac] font-Lora pt-5 xl:pt-7">
                  {roomsLabel}
                </p>
              </div>
              <div className="ml-10 xl:ml-[60px] 2xl:ml-20 3xl:ml-[100px]">
                <h2 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 3xl:text-[70px] leading-[42px] text-[#C9A24D] font-medium">
                  {rating}
                </h2>
                <p className="text-sm sm:text-base leading-[26px] text-[#acacac] font-Lora pt-5 xl:pt-7">
                  {ratingsLabel}
                </p>
              </div>
            </div>
            <div className="py-5 lg:py-7 xl:py-[30px]">
              <hr className="w-full h-[2px] bg-[#ddd]" />
            </div>
            <Link href={`/${locale}/about`}>
              <button type="button" className="h-[40px] lg:h-[60px] w-[145px] sm:w-[155px] lg:w-[170px] bg-[#C9A24D] text-white uppercase text-sm lg:text-base font-medium font-Garamond hover:bg-[#272727] transition-colors">
                {moreLabel}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
