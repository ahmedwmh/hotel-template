"use client";

import Link from "next/link";
import { HiArrowLongRight, HiArrowLongLeft } from "react-icons/hi2";
import type { Locale } from "@/lib/i18n";
import type { FacilityItem } from "@/lib/facilities-items";

const FACILITY_ITEMS = [
  {
    image: "/images/home-1/facilities-1.png",
    number: "01",
    categoryEn: "Fitness",
    categoryAr: "لياقة",
    titleEn: "Gym Training Grounds",
    titleAr: "صالة رياضية",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures.",
  },
  {
    image: "/images/home-1/facilities-thumb-2.jpg",
    number: "02",
    categoryEn: "Fitness",
    categoryAr: "لياقة",
    titleEn: "Indoor Swimming Pool",
    titleAr: "مسبح داخلي",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures.",
  },
  {
    image: "/images/home-1/facilities-thumb-3.jpg",
    number: "03",
    categoryEn: "FOODS",
    categoryAr: "مطعم",
    titleEn: "The Restaurant Center",
    titleAr: "المطعم",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures.",
  },
  {
    image: "/images/home-1/facilities-thumb-4.jpg",
    number: "04",
    categoryEn: "EXPERIENCE",
    categoryAr: "تجربة",
    titleEn: "Gym Training Grounds",
    titleAr: "صالة رياضية",
    description: "Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures.",
  },
];

type FacilitiesNextProps = {
  locale: Locale;
  facilityItems?: FacilityItem[];
  facilitiesTitle?: string;
  facilitiesHeading?: string;
  viewMoreLabel?: string;
};

export function FacilitiesNext({
  locale,
  facilityItems,
  facilitiesTitle = "FACILITIES",
  facilitiesHeading = "ENJOY COMPLETE & BEST QUALITY FACILITIES",
  viewMoreLabel,
}: FacilitiesNextProps) {
  const items = facilityItems?.length ? facilityItems : FACILITY_ITEMS;
  const viewMore = viewMoreLabel ?? (locale === "ar" ? "عرض المزيد" : "View more item");
  const isRtl = locale === "ar";

  return (
    <div className="bg-[#212121]" dir={locale}>
      <section className="Container py-[120px] md:py-0 md:pb-[120px] lg:py-[120px]" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
        {/* Header: title and View more button — LTR: title left, button right; RTL: title right, button left */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-5 mb-12 px-3 sm:px-5 ${isRtl ? "md:flex-row-reverse" : ""}`}>
          <div className="md:max-w-[450px] font-Garamond text-start">
            <h5 className="text-base text-[#c19d68] leading-[26px] font-medium mb-[14px]">
              {facilitiesTitle}
            </h5>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-white font-semibold">
              {facilitiesHeading}
            </h1>
          </div>
          <div className="shrink-0">
            <Link href={`/${locale}/contact`}>
              <button type="button" className="border border-white w-[145px] sm:w-[155px] lg:w-[170px] h-[48px] text-white uppercase text-sm sm:text-base font-medium font-Garamond hover:bg-[#c19d68] hover:border-[#c19d68] transition-colors whitespace-nowrap">
                {viewMore}
              </button>
            </Link>
          </div>
        </div>
        <div>
          {items.map((item, idx) => (
            <div key={idx}>
              <hr className="text-[#383838] mb-10 mt-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className={`relative w-full ${idx % 2 === 1 ? "md:order-2" : ""}`}>
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <div className={`hidden md:block absolute -top-0 ${isRtl ? "-left-[12%] xl:-left-[5%]" : "-right-[12%] xl:-right-[5%]"}`}>
                   
                  </div>
                </div>
                <div className={`font-Garamond mt-3 md:mt-0 text-start ${idx % 2 === 1 ? "md:order-1 md:mr-[60px] lg:mr-[107px]" : "md:ml-[60px] lg:ml-[107px]"} ${isRtl ? (idx % 2 === 1 ? "md:ml-[60px] lg:ml-[107px] md:mr-0" : "md:mr-[60px] lg:mr-[107px] md:ml-0") : ""}`}>
                  <h4 className="text-base font-semibold text-[#c19d68] leading-[26px] pb-[6px] uppercase mt-2 md:mt-0">
                    {locale === "ar" ? item.categoryAr : item.categoryEn}
                  </h4>
                  <h2 className="text-2xl md:text-3xl 2xl:text-[32px] leading-[26px] font-semibold text-white">
                    <Link href={`/${locale}/about`} className="hover:text-[#c19d68] transition-colors">
                      {locale === "ar" ? item.titleAr : item.titleEn}
                    </Link>
                  </h2>
                  <p className="font-Lora text-sm sm:text-base text-[#acacac] leading-[26px] font-normal my-10 lg:mt-[46px] lg:mb-[40px]">
                    {item.description}
                  </p>
                  <Link href={`/${locale}/contact`} className="inline-flex items-center gap-1 text-[#acacac] hover:text-[#c19d68] transition-colors">
                    {isRtl ? <HiArrowLongLeft size={30} /> : <HiArrowLongRight size={30} />}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
