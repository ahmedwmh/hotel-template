"use client";

import type { Locale } from "@/lib/i18n";

const FACILITIES = [
  { icon: "/images/home-1/feature-1.png", labelEn: "Room Services", labelAr: "خدمة الغرف" },
  { icon: "/images/home-1/feature-2.png", labelEn: "Wi-Fi Internet", labelAr: "واي فاي" },
  { icon: "/images/home-1/feature-3.png", labelEn: "Smart Key", labelAr: "مفتاح ذكي" },
  { icon: "/images/home-1/feature-4.png", labelEn: "Breakfast", labelAr: "إفطار" },
  { icon: "/images/home-1/feature-5.png", labelEn: "Swimming Pool", labelAr: "مسبح" },
  { icon: "/images/home-1/feature-1.png", labelEn: "Room Service", labelAr: "خدمة الغرف" },
];

type HotelAndFacilitiesNextProps = {
  locale: Locale;
  title?: string;
  subtitle?: string;
};

export function HotelAndFacilitiesNext({
  locale,
  title,
  subtitle = "Proactively morph optimal infomediaries rather than accurate expertise. Intrinsicly progressive resources rather than resource-leveling",
}: HotelAndFacilitiesNextProps) {
  const sectionTitle = title ?? (locale === "ar" ? "مرافق الفندق" : "HOTEL'S FACILITIES");
  const sub = locale === "ar" ? "مرافق متكاملة لراحتك." : subtitle;
  const isRtl = locale === "ar";

  return (
    <section className="bg-[#1e1e1e] z-[1]" dir={locale}>
      <div className="py-[110px] bg-[url('/images/home-1/section-shape2.png')] bg-no-repeat bg-top bg-opacity-[0.07]">
        <div className="Container" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
          <div className={`text-center mx-auto px-5 sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] ${isRtl ? "text-right" : "text-left"}`}>
            <div className="flex items-center justify-center gap-2 mb-4 lg:mb-5">
              <hr className="w-[100px] h-[1px] bg-[#3b3b3b] shrink-0" />
              <img src="/images/logo/logo-s.svg" alt="" className="w-[50px] h-[50px] shrink-0" />
              <hr className="w-[100px] h-[1px] bg-[#3b3b3b] shrink-0" />
            </div>
            <h1 className="text-2xl md:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px] 2xl:leading-[52px] text-white mb-[6px] font-Garamond font-semibold uppercase">
              {sectionTitle}
            </h1>
            <p className="font-Lora leading-[26px] text-[#acacac] font-normal text-sm sm:text-base max-w-2xl mx-auto">
              {sub}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-6 gap-4 xl:gap-[26px] pt-[60px] pb-[110px] px-8 lg:px-10 xl:px-28 2xl:px-0 justify-items-center">
            {FACILITIES.map((f, i) => (
              <div
                key={i}
                className="h-[200px] w-[191px] pt-[37px] pb-[27px] border border-[#343434] text-center transition-all duration-500 hover:border-[#c19d68] group"
              >
                <img src={f.icon} alt="" className="mx-auto" />
                <h4 className="text-[22px] leading-[52px] font-Garamond text-white font-medium mt-[45px]">
                  {locale === "ar" ? f.labelAr : f.labelEn}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
