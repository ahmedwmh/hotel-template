"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { Locale } from "@/lib/i18n";

export type BlogPostItem = {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  slug?: string;
};

const DEFAULT_POSTS_EN: BlogPostItem[] = [
  { id: "1", title: "Luxury Hotel for Traveling Spot USA, California", date: "August 10, 2023", category: "Interior", image: "/images/home-1/blog-1.jpg" },
  { id: "2", title: "Best Resort for Family Vacation in Kashmir", date: "August 12, 2023", category: "Travel", image: "/images/home-1/blog-2.jpg" },
  { id: "3", title: "Top 10 Hotels with Amazing Views", date: "August 15, 2023", category: "Tips", image: "/images/home-1/blog-3.jpg" },
];

const DEFAULT_POSTS_AR: BlogPostItem[] = [
  { id: "1", title: "فندق فاخر للسياحة في النجف", date: "10 أغسطس 2023", category: "داخلي", image: "/images/home-1/blog-1.jpg" },
  { id: "2", title: "أفضل منتجع لعطلة عائلية", date: "12 أغسطس 2023", category: "سفر", image: "/images/home-1/blog-2.jpg" },
  { id: "3", title: "أفضل 10 فنادق بإطلالات رائعة", date: "15 أغسطس 2023", category: "نصائح", image: "/images/home-1/blog-3.jpg" },
];

type LatestBlogNextProps = {
  locale: Locale;
  posts?: BlogPostItem[];
  title?: string;
  subtitle?: string;
  readMoreLabel?: string;
};

export function LatestBlogNext({
  locale,
  posts,
  title,
  subtitle = "Proactively morph optimal infomediaries rather than accurate expertise. Intrinsicly progressive resources rather than resource-leveling",
  readMoreLabel,
}: LatestBlogNextProps) {
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": { slides: { perView: 1, spacing: 20 } },
      "(min-width: 768px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width: 992px)": { slides: { perView: 3, spacing: 20 } },
    },
    loop: true,
    initial: 0,
  });

  const list = posts?.length ? posts : (locale === "ar" ? DEFAULT_POSTS_AR : DEFAULT_POSTS_EN);
  const sectionTitle = title ?? (locale === "ar" ? "أحدث المدونات" : "LATEST POST FROM BLOG");
  const readMore = readMoreLabel ?? (locale === "ar" ? "اقرأ المزيد" : "Read More");

  return (
    <div className="bg-[#272727]">
      <div className="bg-[url('/images/home-1/section-shape2.png')] bg-no-repeat bg-top bg-opacity-[0.07]">
        <section className="Container py-20 lg:py-[120px]" style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
          <div className="text-center mx-auto px-5 sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px]">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <hr className="w-[100px] h-[1px] text-[#3b3b3b]" />
              <img src="/images/logo/logo-s.svg" alt="" className="w-[50px] h-[50px]" />
              <hr className="w-[100px] h-[1px] text-[#3b3b3b]" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[44px] lg:leading-[52px] text-white font-Garamond font-semibold uppercase mb-[8px]">
              {sectionTitle}
            </h1>
            <p className="font-Lora leading-[26px] text-[#acacac] font-normal text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
          <div className="relative">
            <div className="mt-14 2xl:mt-[60px] keen-slider" ref={sliderRef}>
              {list.map((post) => (
                <div key={post.id} className="keen-slider__slide">
                  <div className="overflow-hidden 3xl:w-[410px] group">
                    <div className="relative">
                      <img src={post.image} className="w-full h-full object-cover min-h-[220px]" alt="" />
                    </div>
                    <div className="font-Garamond border border-[#424242] border-t-0">
                      <div className="py-6 px-[30px] lg:px-5 xl:px-[25px]">
                        <div className="flex items-center space-x-6">
                          <p className="text-sm lg:text-base leading-[26px] text-[#acacac] font-normal uppercase">
                            {post.date}
                          </p>
                          <p className="text-sm lg:text-base leading-[26px] text-[#acacac] font-normal uppercase">
                            {post.category}
                          </p>
                        </div>
                        <Link href={post.slug ? `/${locale}/blog/${post.slug}` : `/${locale}/about`}>
                          <h2 className="text-xl sm:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-white py-2 sm:py-3 md:py-4 hover:text-[#c19d68] transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>
                      </div>
                      <div className="border-t-[1px] border-[#424242] py-2 lg:py-3">
                        <Link
                          href={post.slug ? `/${locale}/blog/${post.slug}` : `/${locale}/about`}
                          className="px-[30px] flex items-center justify-between group/link"
                        >
                          <span className="text-sm sm:text-base uppercase text-white font-medium group-hover/link:text-[#c19d68]">
                            {readMore}
                          </span>
                          <BsArrowRight className="text-[#acacac] group-hover/link:text-[#c19d68]" size={24} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
