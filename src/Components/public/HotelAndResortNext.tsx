"use client";

import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Locale } from "@/lib/i18n";

type HotelAndResortNextProps = {
  locale: Locale;
  title?: string;
  subtitle?: string;
  description?: string;
  roomsCount?: number;
  rating?: string;
  moreAboutLabel?: string;
};

const DEFAULT_DESCRIPTION: Record<Locale, string> = {
  en: "At Najaf International Hotel, we believe that true hospitality is not measured by service alone, but by respect, genuine care, and the sense of peace throughout the stay.",
  ar: "في فندق النجف الدولي نؤمن بأن الضيافة الحقيقية لا تُقاس بالخدمة فقط بل بالاحترام والاهتمام والشعور بالطمأنينة طوال الإقامة.",
};

export function HotelAndResortNext({
  locale,
  title = "LUXURY BEST HOTEL IN NAJAF",
  subtitle,
  description,
  roomsCount,
  rating = "4.9",
  moreAboutLabel,
}: HotelAndResortNextProps) {
  const descriptionText = description?.trim() || DEFAULT_DESCRIPTION[locale];
  const displayRoomsCount = roomsCount ?? 50;
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width:320px)": {
        slides: { perView: 1, spacing: 20 },
      },
    },
    loop: true,
    initial: 0,
  });

  const sectionTitle = title;
  const moreLabel = moreAboutLabel ?? (locale === "ar" ? "المزيد عنا" : "More About");
  const luxuryRoomsLabel = locale === "ar" ? "غرف فاخرة" : "Luxury Rooms";
  const customerRatingsLabel = locale === "ar" ? "تقييم العملاء" : "Customer Ratings";

  return (
    <section className="bg-[#212121] py-20 2xl:py-[120px]">
      <div className="Container sm:overflow-hidden lg:overflow-auto" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
        <div className="md:flex items-center justify-between">
          <div className="flex-1 keen-slider w-screen md:w-[60%] 2xl:w-[580px] md:pr-5 lg:pr-6 xl:pr-8 2xl:pr-9 3xl:pr-10 md:mt-0" ref={sliderRef}>
            <div className="keen-slider__slide">
              <img src="/images/home-1/Hotel1.jpg" className="h-[85%] lg:h-[90%] w-full object-cover" alt="Hotel" />
            </div>
            <div className="keen-slider__slide">
              <img src="/images/home-1/Hotel.png" className="h-[85%] md:h-[100%] lg:h-[90%] w-full object-cover" alt="Hotel" />
            </div>
          </div>
          <div className="flex-1 font-Garamond mt-5 md:mt-0 md:pl-8 p-5 lg:pl-10 2xl:pl-14">
            <h5 className="text-base text-[#C9A24D] leading-[26px] font-medium">
              {locale === "ar" ? "فندق ومنتجع فاخر" : "LUXURY HOTEL AND RESORT"}
            </h5>
            <h1 className="text-[22px] sm:text-2xl md:text-[21px] xl:text-3xl 2xl:text-[38px] leading-6 md:leading-7 lg:leading-[30px] 2xl:leading-[44px] text-white font-semibold my-4">
              {sectionTitle}
            </h1>
            {subtitle && <p className="text-sm text-[#acacac] mb-2">{subtitle}</p>}
            <p className="text-sm xl:text-base font-Lora text-[#acacac] font-normal leading-[26px]">
              {descriptionText}
            </p>
            <div className="flex items-center mt-4 md:mt-3 lg:mt-4">
              <div>
                <h2 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 3xl:text-[70px] leading-[42px] text-[#C9A24D] font-medium">
                  {displayRoomsCount}+
                </h2>
                <p className="text-sm sm:text-base leading-[26px] text-[#acacac] font-Lora pt-5 xl:pt-7">
                  {luxuryRoomsLabel}
                </p>
              </div>
              <div className="ml-10 xl:ml-[60px] 2xl:ml-20 3xl:ml-[100px]">
                <h2 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 3xl:text-[70px] leading-[42px] text-[#C9A24D] font-medium">
                  {rating}
                </h2>
                <p className="text-sm sm:text-base leading-[26px] text-[#acacac] font-Lora pt-5 xl:pt-7">
                  {customerRatingsLabel}
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
