"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoLanguageOutline } from "react-icons/io5";
import type { Locale } from "@/lib/i18n";

const navLinks = (locale: Locale) => [
  { href: `/${locale}`, label: locale === "ar" ? "الرئيسية" : "Home" },
  { href: `/${locale}/about`, label: locale === "ar" ? "من نحن" : "About Us" },
  { href: `/${locale}/rooms`, label: locale === "ar" ? "الغرف" : "Rooms" },
  { href: `/${locale}/restaurants`, label: locale === "ar" ? "مطاعم" : "Restaurants" },
  { href: `/${locale}/contact`, label: locale === "ar" ? "اتصل بنا" : "Contact Us" },
];

const brandName = (locale: Locale) =>
  locale === "ar" ? "فندق النجف الدولي" : "Najaf International Hotel";

const DEFAULT_LOGO = "/images/logo/logo-s.svg";

export function PublicNavbar({
  locale,
  logoUrl = DEFAULT_LOGO,
}: {
  locale: Locale;
  logoUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const links = navLinks(locale);
  const isRtl = locale === "ar";
  const name = brandName(locale);
  const src = logoUrl || DEFAULT_LOGO;

  return (
    <nav
      className="w-full font-Lora z-10 lg:px-5 lg:py-2 transition-all duration-300 bg-[#000]"
      dir={locale}
    >
      <div className="lg:px-10 max-w-[1330px] mx-auto">
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${isRtl ? "lg:flex-row-reverse" : ""}`}>
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-0 shrink-0 ${isRtl ? "flex-row-reverse" : ""} lg:p-4`}
            aria-label={name}
          >
            <img
              src={src}
              alt={name}
              className="hidden lg:block w-20 h-20  object-contain"
            />
            {/* <span className="hidden lg:block  text-lg  text-white whitespace-nowrap">
              {name}
            </span> */}
          </Link>
          <div className="px-3 w-full lg:hidden flex justify-between items-center h-[70px] p-3 bg-[#000] text-white">
            <Link href={`/${locale}`} className={`flex items-center gap-2 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`} aria-label={name}>
              <img
                src={src}
                alt=""
                className="h-9 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* موبايل: زر اللغة ثم الهامبرجر في أقصى اليمين */}
              <Link
                href={locale === "ar" ? "/en" : "/ar"}
                className="flex items-center gap-1 rounded-full border border-[#C9A24D] bg-[#C9A24D]/10 px-2 py-1.5 text-xs font-medium text-[#C9A24D] transition-all active:scale-[0.98] hover:bg-[#C9A24D] hover:text-[#000] whitespace-nowrap"
                aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
              >
                <IoLanguageOutline className="w-3.5 h-3.5 shrink-0" aria-hidden />
                <span>{locale === "ar" ? "English" : "العربية"}</span>
              </Link>
              <button
                type="button"
                className="focus:outline-none shrink-0 text-white"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <IoMdClose className="w-6 h-6" />
                ) : (
                  <FaBars className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <ul
            className={`${
              isOpen ? "flex" : "hidden"
            } lg:flex flex-col lg:flex-row w-full lg:w-auto lg:flex-1 justify-center items-stretch lg:items-center gap-0 lg:gap-6 text-sm text-white uppercase font-normal bg-[#000] lg:bg-transparent py-3 lg:py-0 text-start`}
          >
            {links.map(({ href, label }) => (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className="text-white px-3 py-2 w-full lg:w-auto block text-start hover:text-[#C9A24D] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="hidden lg:flex lg:items-center lg:gap-4 shrink-0 ms-4">
              <Link
                href={`/${locale}/book`}
                className="border border-white inline-block px-4 py-2 text-white text-sm font-medium hover:bg-white hover:text-[#000] transition-colors whitespace-nowrap"
              >
                {locale === "ar" ? "احجز الآن" : "Booking Online"}
              </Link>
              <Link
                href={locale === "ar" ? "/en" : "/ar"}
                className="px-2 py-2 text-white hover:text-[#C9A24D] transition-colors whitespace-nowrap"
              >
                {locale === "ar" ? "English" : "العربية"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
