"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Locale } from "@/lib/i18n";
import type { PublicRoom } from "@/lib/room-rates";
import { hotelImages } from "@/lib/hotel-images";

function getRoomImage(index: number) {
  return hotelImages.rooms[index % hotelImages.rooms.length];
}

export function RoomsSectionNext({
  rooms,
  locale,
}: {
  rooms: PublicRoom[];
  locale: Locale;
}) {
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": { slides: { perView: 1, spacing: 20 } },
      "(min-width: 768px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width: 992px)": { slides: { perView: 3, spacing: 20 } },
    },
    loop: true,
    initial: 0,
  });

  const sectionTitle = locale === "ar" ? "غرف وأجنحة فندق النجف" : "Najaf Hotel Rooms & Suites";
  const sectionSubtitle =
    locale === "ar"
      ? "إقامة مريحة مع خدمة ممتازة في قلب النجف."
      : "Proactively morph optimal infomediaries rather than accurate expertise.";
  const viewDetailsLabel = locale === "ar" ? "عرض التفاصيل" : "View Details";
  const nightLabel = locale === "ar" ? "ليلة" : "Night";
  const roomDisplayName = (r: PublicRoom) =>
    locale === "ar" ? (r.nameAr || r.name) : (r.nameEn || r.name);

  return (
    <div className="bg-zinc-900">
      <div className="py-20 2xl:py-[120px] w-full">
        <div className="Container" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
          <div className="text-center sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] mx-auto px-5">
            <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-[20px]">
              <hr className="w-[100px] h-[1px] border-0 bg-[#c19d68]" />
              <img src="/images/logo/logo-s.svg" alt="" className="w-[60px] h-[70px] object-contain" />
              <hr className="w-[100px] h-[1px] border-0 bg-[#c19d68]" />
            </div>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[38px] leading-7 sm:leading-8 md:leading-9 lg:leading-[42px] 2xl:leading-[52px] text-white mb-[6] font-Garamond font-semibold uppercase">
              {sectionTitle}
            </h1>
            <p className="font-Lora leading-[26px] text-zinc-400 font-normal text-sm sm:text-base mt-[15px] lg:mt-0">
              {sectionSubtitle}
            </p>
          </div>

          <div className="relative mt-14 2xl:mt-[60px]">
            <div className="keen-slider" ref={sliderRef}>
              {rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <div key={room.id} className="keen-slider__slide">
                    <Link
                      href={`/${locale}/rooms/${room.id}`}
                      className="overflow-x-hidden 3xl:w-[410px] group relative block cursor-pointer"
                    >
                      <div className="relative">
                        <div className="overflow-hidden">
                          <img
                            src={getRoomImage(index)}
                            alt={roomDisplayName(room)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300 min-h-[240px]"
                          />
                        </div>
                        <div className="flex items-center justify-center text-[15px] leading-[38px] bg-[#1e1e1e] absolute bottom-0 -left-40 px-5 text-white group-hover:left-0 transition-all duration-300 hover:bg-[#c19d68]">
                          {viewDetailsLabel}
                          <BsArrowRight className="w-4 h-4 ml-2 text-white" />
                        </div>
                      </div>
                      <div className="font-Garamond">
                        <div className="px-5 3xl:px-6 py-2 inline-flex bg-[#c19d68] text-sm items-center justify-center text-white font-Lora font-normal leading-[26px] absolute top-[10px] right-[10px]">
                          <span>{room.rate}</span>
                          <span className="mx-2">|</span>
                          <span>{nightLabel}</span>
                        </div>
                        <div className="border border-zinc-600 border-t-0 bg-zinc-800/50">
                          <div className="py-6 px-[30px]">
                            <h4 className="text-sm leading-[26px] text-[#c19d68] uppercase font-semibold">
                              {locale === "ar" ? "غرفة" : "Room"}
                            </h4>
                            <h2 className="text-2xl lg:text-[28px] leading-[26px] font-semibold text-white py-4 group-hover:text-[#c19d68] transition-colors">
                              {roomDisplayName(room)}
                            </h2>
                            <p className="text-sm font-normal text-zinc-400 font-Lora">
                              {room.capacity} {locale === "ar" ? "ضيوف" : "guests"}
                            </p>
                          </div>
                          <div className="border-t border-zinc-600 py-5">
                            <div className="px-[30px] flex items-center justify-between">
                              <span className="font-Lora text-base flex items-center">
                                <img src="/images/home-1/room-bottom-icon.png" alt="" className="opacity-80" />
                                <span className="ml-[10px] text-zinc-400">
                                  {room.capacity} {locale === "ar" ? "سرير" : "Guests"}
                                </span>
                              </span>
                              <ul className="flex items-center text-[#c19d68] space-x-[5px]">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <li key={i}>
                                    <FaStar className="w-4 h-4" />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="keen-slider__slide flex items-center justify-center min-h-[300px] text-zinc-400">
                  {locale === "ar" ? "لا توجد غرف متاحة حالياً." : "No rooms available at the moment."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
