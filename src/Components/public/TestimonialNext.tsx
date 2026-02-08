"use client";

import { FaStar } from "react-icons/fa";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Locale } from "@/lib/i18n";
import { hotelImages } from "@/lib/hotel-images";

export type TestimonialItem = {
  quote: string;
  authorName: string;
  role?: string;
  avatar?: string;
};

const DEFAULT_TESTIMONIALS_EN: TestimonialItem[] = [
  {
    quote: "Professionally repurpose flexible testing procedures via molla in customer service. Dynamically reconceptualize value-added the systems before manufactured products. Enthusiastically envisioneer emerging best.",
    authorName: "John D. Alexon",
    role: "Guest",
    avatar: "/images/home-1/testi-author.png",
  },
  {
    quote: "Model. Appropriately create interactive infrastructures after main. Holisticly facilitate stand-alone inframe. Compellingly create premier open data through economically.",
    authorName: "Sarah M. Johnson",
    role: "Traveler",
    avatar: "/images/home-1/testi-author-2.png",
  },
];

const DEFAULT_TESTIMONIALS_AR: TestimonialItem[] = [
  {
    quote: "تجربة إقامة ممتازة وخدمة راقية. أنصح بشدة بفندق النجف.",
    authorName: "أحمد محمد",
    role: "زائر",
    avatar: "/images/home-1/testi-author.png",
  },
  {
    quote: "غرف مريحة وطاقم محترم. سنعود قريباً.",
    authorName: "فاطمة علي",
    role: "مسافرة",
    avatar: "/images/home-1/testi-author-2.png",
  },
];

type TestimonialNextProps = {
  locale: Locale;
  testimonials?: TestimonialItem[];
  title?: string;
  subtitle?: string;
};

export function TestimonialNext({
  locale,
  testimonials,
  title,
  subtitle = "Proactively morph optimal infomediaries rather than accurate expertise. Intrinsicly progressive resources rather than resource-leveling",
}: TestimonialNextProps) {
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 600px)": { slides: { perView: 1, spacing: 20 } },
      "(min-width: 768px)": { slides: { perView: 2, spacing: 20 } },
    },
    loop: true,
    initial: 0,
  });

  const list = testimonials?.length ? testimonials : (locale === "ar" ? DEFAULT_TESTIMONIALS_AR : DEFAULT_TESTIMONIALS_EN);
  const sectionTitle = title ?? (locale === "ar" ? "آراء العملاء" : "Customer's Testimonial");
  const sub = locale === "ar" ? "آراء حقيقية من ضيوفنا." : subtitle;

  return (
    <section
      className="bg-[rgba(30,30,30,0.5)] grid items-center justify-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `linear-gradient(rgba(30,30,30,0.5), rgba(30,30,30,0.5)), url(${hotelImages.testimonialBg})` }}
    >
      <div className="Container py-20 lg:py-[120px]" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
        <div className="text-center sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] mx-auto px-5">
          <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-5">
            <hr className="w-[100px] h-[1px] text-[#473f39]" />
            <img src="/images/logo/logo-c.svg" alt="" className="w-[50px] h-[50px]" />
            <hr className="w-[100px] h-[1px] text-[#473f39]" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] 2xl:leading-[52px] text-white mt-[20px] mb-[16px] font-Garamond font-semibold uppercase">
            {sectionTitle}
          </h1>
          <p className="font-Lora leading-7 lg:leading-[26px] text-white font-normal text-sm sm:text-base">
            {sub}
          </p>
        </div>
        <div className="mt-14 keen-slider" ref={sliderRef}>
          {list.map((t, i) => (
            <div key={i} className="keen-slider__slide px-2">
              <div className="bg-white p-5 md:p-10 relative">
                <img src="/images/home-1/testi-quote.png" alt="" className="absolute right-3 xl:right-10 -top-8 w-12 h-12 opacity-80" />
                <ul className="flex items-center text-[#C9A24D] space-x-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <li key={j}>
                      <FaStar size={16} />
                    </li>
                  ))}
                </ul>
                <p className="font-Lora text-sm sm:text-base leading-[26px] text-[#616161] font-normal xl:text-lg mt-[30px] italic mb-[45px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center space-x-6">
                  <img
                    src={t.avatar ?? "/images/home-1/testi-author.png"}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-[#1e1e1e] font-Garamond">{t.authorName}</h4>
                    <p className="text-sm text-[#616161] font-Lora">{t.role ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
