"use client";

import Link from "next/link";
import { IoIosCall } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { BiEnvelope } from "react-icons/bi";
import type { Locale } from "@/lib/i18n";
import { hotelImages } from "@/lib/hotel-images";

const DEFAULT_LOGO = "/images/logo/logo-s.svg";

export function PublicFooter({
  locale,
  logoUrl = DEFAULT_LOGO,
  contactEmail = "",
  contactPhone = "",
  contactPhone2 = "",
  contactAddress = "",
}: {
  locale: Locale;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPhone2?: string;
  contactAddress?: string;
}) {
  const src = logoUrl || DEFAULT_LOGO;
  const usefulLinksLabel = locale === "ar" ? "روابط مفيدة" : "Useful Links";
  const aboutLabel = locale === "ar" ? "عن الفندق" : "About Hotel";
  const roomsLabel = locale === "ar" ? "الغرف والأجنحة" : "Rooms & Suites";
  const reservationsLabel = locale === "ar" ? "الحجوزات" : "Reservations";
  const contactLabel = locale === "ar" ? "اتصل بنا" : "Contact Us";
  const contactInfoLabel = locale === "ar" ? "معلومات الاتصال" : "CONTACT INFO";
  const galleryLabel = locale === "ar" ? "معرض الصور" : "GALLERY";
  const copyright = locale === "ar"
    ? `© ${new Date().getFullYear()} فندق النجف. جميع الحقوق محفوظة.`
    : `© ${new Date().getFullYear()} Najaf Hotel. All Rights Reserved.`;

  return (
    <>
      <footer className="pt-16 md:pt-20 lg:pt-[13rem] 2xl:pt-56 bg-[#000]">
        <div className="bg-[#000]">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 2xl:grid-cols-12 gap-5 lg:gap-3 xl:gap-5 2xl:gap-[30px] pt-14 lg:pt-[100px] px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-[30px]"
            style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
          >
            <div className="lg:mt-[-195px] lg:col-span-3 2xl:col-span-4 bg-[#000]">
              <div className="py-6 md:py-7 lg:py-[50px] px-10 lg:px-5 xl:px-8 2xl:px-9">
                <img src={src} alt="Najaf Hotel" className="h-12 w-auto object-contain" />
                <div className="py-8 2xl:py-[50px]">
                  <h2 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-[#C9A24D] before:absolute before:left-0 before:top-10">
                    {contactInfoLabel}
                  </h2>
                  <div className="space-y-4 pt-[30px] pb-2 2xl:pb-[30px]">
                    {contactPhone ? (
                      <p className="flex items-center text-[#acacac] font-Lora font-normal text-sm sm:text-base leading-[26px] mt-2">
                        <IoIosCall className="text-[#C9A24D] w-5 h-5 mr-3 2xl:mr-4 shrink-0" size={14} />
                        <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:text-[#C9A24D] transition-colors">
                          {contactPhone}
                        </a>
                      </p>
                    ) : null}
                    {contactPhone2 ? (
                      <p className="flex items-center text-[#acacac] font-Lora font-normal text-sm sm:text-base leading-[26px]">
                        <IoIosCall className="text-[#C9A24D] w-5 h-5 mr-3 2xl:mr-4 shrink-0" size={14} />
                        <a href={`tel:${contactPhone2.replace(/\s/g, "")}`} className="hover:text-[#C9A24D] transition-colors">
                          {contactPhone2}
                        </a>
                      </p>
                    ) : null}
                    {contactEmail ? (
                      <p className="flex items-center text-[#acacac] font-Lora font-normal text-sm sm:text-base leading-[26px]">
                        <BiEnvelope className="text-[#C9A24D] w-5 h-5 mr-3 2xl:mr-4 shrink-0" size={14} />
                        <a href={`mailto:${contactEmail}`} className="hover:text-[#C9A24D] transition-colors">
                          {contactEmail}
                        </a>
                      </p>
                    ) : null}
                    {contactAddress ? (
                      <p className="flex items-center text-[#acacac] font-Lora font-normal text-sm sm:text-base leading-[26px]">
                        <IoLocationSharp className="text-[#C9A24D] w-5 h-5 mr-3 2xl:mr-4 shrink-0" size={14} />
                        {contactAddress}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-0 pb-8 overflow-x-hidden lg:col-span-2 2xl:col-span-2 ml-2">
              <h2 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-[#C9A24D] before:absolute before:left-0 before:top-10 uppercase">
                {usefulLinksLabel}
              </h2>
              <div className="pt-[30px] pb-0 lg:py-[30px]">
                <ul className="text-[#acacac] font-Lora font-normal text-sm sm:text-base leading-[26px] list-none">
                  <li className="leading-[44px] hover:text-[#C9A24D] transition-colors">
                    <Link href={`/${locale}/about`}>{aboutLabel}</Link>
                  </li>
                  <li className="leading-[44px] hover:text-[#C9A24D] transition-colors">
                    <Link href={`/${locale}/rooms`}>{roomsLabel}</Link>
                  </li>
                  <li className="leading-[44px] hover:text-[#C9A24D] transition-colors">
                    <Link href={`/${locale}/book`}>{reservationsLabel}</Link>
                  </li>
                  <li className="leading-[44px] hover:text-[#C9A24D] transition-colors">
                    <Link href={`/${locale}/contact`}>{contactLabel}</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-0 pb-8 lg:col-span-3 2xl:col-span-3">
              <h2 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-[#C9A24D] before:absolute before:left-0 before:top-10 uppercase">
                {galleryLabel}
              </h2>
              <div className="grid grid-cols-3 gap-2 mt-[45px] w-[250px] sm:w-[300px] lg:w-full content-center">
                {hotelImages.gallery.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-full h-auto object-cover" />
                ))}
              </div>
            </div>
          </div>
          <div className="text-center py-5 2xl:py-7 bg-[#000] text-sm md:text-base text-[#acacac] font-Lora font-normal">
            {copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
