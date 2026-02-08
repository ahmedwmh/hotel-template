"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { BiPhoneCall } from "react-icons/bi";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/Components/HeroSection/style.css";
import type { Locale } from "@/lib/i18n";
import { hotelImages } from "@/lib/hotel-images";
import type { HeroSlide } from "@/lib/hero-slides";

const DEFAULT_SLIDES: HeroSlide[] = [
  { imageUrl: hotelImages.hero[0], title1: "THE BEST LUXURY HOTEL", title2: "IN NAJAF" },
  { imageUrl: hotelImages.hero[1], title1: "THE BEST LUXURY HOTEL", title2: "& RESORT" },
  { imageUrl: hotelImages.hero[2], title1: "COMFORT & ELEGANCE", title2: "IN THE HEART OF NAJAF" },
];

const DEFAULT_PHONE = "+964 592 104 371 964";

export function HeroSectionNext({
  locale,
  slides: slidesProp,
  contactPhone,
}: {
  locale: Locale;
  slides?: HeroSlide[];
  contactPhone?: string | null;
}) {
  const slides = slidesProp?.length ? slidesProp : DEFAULT_SLIDES;
  const discoverLabel = locale === "ar" ? "اكتشف المزيد" : "Discover More";
  const phone = (contactPhone || DEFAULT_PHONE).trim();
  const telHref = "tel:" + phone.replace(/\s+/g, "");

  return (
    <div className="">
      <Swiper
        centeredSlides
        navigation
        speed={3000}
        autoplay={{ delay: 10000, disableOnInteraction: true }}
        pagination={{ clickable: true }}
        modules={[Navigation, Autoplay, Pagination]}
        className="mySwiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="w-full h-[700px] md:h-[800px] xl:h-[850px] grid items-center justify-center text-white relative pb-[150px] lg:pb-16 xl:pb-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(30,30,30,0.4), rgba(30,30,30,0.4)), url(${slide.imageUrl})`,
              }}
            >
              <div className="font-Garamond 2xl:w-[720px] text-center">
                <div className="flex space-x-2 items-center justify-center mb-5 lg:mb-6">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <FaStar key={j} className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] text-[#c19d68]" />
                  ))}
                </div>
                <h4 className="text-base mb-4">
                  {locale === "ar" ? "فندق ومنتجع فاخر" : "LUXURY HOTEL AND RESORT"}
                </h4>
                <div className="mb-7 md:mb-8 lg:mb-9 xl:mb-10">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl font-semibold leading-[40px] md:leading-[50px] 3xl:leading-[70px]">
                    {slide.title1}
                  </h1>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl font-semibold leading-[40px] lg:leading-[50px] 2xl:leading-[60px]">
                    {slide.title2}
                  </h1>
                </div>
                <Link href={`/${locale}/about`}>
                  <button
                    type="button"
                    className="w-[185px] h-[48px] lg:h-[56px] bg-[#c19d68] text-base font-Garamond font-medium uppercase text-white hover:bg-[#272727] transition-colors"
                  >
                    {discoverLabel}
                  </button>
                </Link>
              </div>
              <div className="min-w-[200px] min-h-[72px] py-3 px-4 border border-white hidden md:flex items-center justify-center absolute left-3 top-1/2 -rotate-90 origin-center -translate-x-1/2 -translate-y-1/2 overflow-visible whitespace-nowrap bg-[#1e1e1e]/80 backdrop-blur-sm">
                <BiPhoneCall className="w-5 h-5 mr-2 shrink-0 text-[#c19d68]" aria-hidden />
                <a href={telHref} className="text-white font-Lora text-sm md:text-base hover:text-[#c19d68] transition-colors">
                  {phone}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
