"use client";

import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Locale } from "@/lib/i18n";
import type { PublicRoom } from "@/lib/room-rates";
import { hotelImages } from "@/lib/hotel-images";

const FALLBACK_OFFERS = [
  { nameEn: "Delux Family Rooms", nameAr: "غرف عائلية فاخرة", discount: "25%" },
  { nameEn: "Double Suite Rooms", nameAr: "غرف جناح مزدوجة", discount: "24%" },
  { nameEn: "Superior Bed Room", nameAr: "غرفة سرير فاخرة", discount: "26%" },
  { nameEn: "Junior Suite Room", nameAr: "جناح جونيور", discount: "22%" },
];

type OffersNextProps = {
  locale: Locale;
  rooms: PublicRoom[];
  title?: string;
};

export function OffersNext({
  locale,
  rooms,
  title,
}: OffersNextProps) {
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": { slides: { perView: 1, spacing: 20 } },
      "(min-width: 600px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width: 768px)": { slides: { perView: 3, spacing: 20 } },
      "(min-width: 1200px)": { slides: { perView: 4, spacing: 20 } },
    },
    loop: true,
    initial: 0,
  });

  const sectionTitle = title ?? (locale === "ar" ? "عروض النجف المميزة" : "ROYELLA'S LIMITED PERIOD BEST OFFERS");

  const items =
    rooms.length >= 4
      ? rooms.slice(0, 4).map((room, i) => ({
          id: room.id,
          name: room.name,
          discount: ["25%", "24%", "26%", "22%"][i % 4],
          image: hotelImages.offers[i % hotelImages.offers.length],
          href: `/${locale}/rooms/${room.id}`,
        }))
      : FALLBACK_OFFERS.map((o, i) => ({
          id: `f-${i}`,
          name: locale === "ar" ? o.nameAr : o.nameEn,
          discount: o.discount,
          image: hotelImages.offers[i % hotelImages.offers.length],
          href: `/${locale}/rooms`,
        }));

  return (
    <section className="bg-[#f8f6f3]">
      <div className="Container py-20 lg:py-[120px]" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
        <div className="flex items-center justify-between relative">
          <div className="md:w-[450px] lg:w-[450px] xl:w-[500px] font-Garamond">
            <h5 className="mb-3 text-base text-[#C9A24D] leading-[26px] font-medium">
              {locale === "ar" ? "عروض" : "OFFERS"}
            </h5>
            <h1 className="text-xl sm:text-3xl 2xl:text-[38px] leading-7 sm:leading-8 md:leading-[38px] lg:leading-[44px] text-[#1e1e1e] font-semibold">
              {sectionTitle}
            </h1>
          </div>
        </div>
        <hr className="text-[#e8e8e8] my-[40px]" />
        <div className="relative">
          <div className="mt-14 2xl:mt-[60px] keen-slider" ref={sliderRef}>
            {items.map((offer, idx) => (
              <div key={offer.id} className="keen-slider__slide">
                <div className="overflow-x-hidden group">
                  <div className="relative">
                    <img src={offer.image} className="w-full h-full object-cover min-h-[200px]" alt="" />
                  </div>
                  <div className="font-Garamond border border-t-0 border-white">
                    <div className="px-6 3xl:px-7 py-2 flex items-center justify-center text-white absolute top-[10px] left-[10px] border border-white group-hover:bg-[#C9A24D] transition-all duration-300">
                      <span className="text-[22px] leading-[26px] font-Garamond">
                        {offer.discount}
                      </span>
                    </div>
                    <div className="bg-white">
                      <div className="py-[30px] text-center">
                        <Link href={offer.href}>
                          <h2 className="text-[24px] leading-[26px] font-semibold text-[#1e1e1e] hover:underline hover:text-[#C9A24D] transition-colors">
                            {offer.name}
                          </h2>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
