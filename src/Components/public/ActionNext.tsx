"use client";

import { useState } from "react";
import { BsPlay } from "react-icons/bs";
import FsLightbox from "fslightbox-react";
import type { Locale } from "@/lib/i18n";

const DEFAULT_TITLE_EN = "LUXURY BEST HOTEL IN NAJAF";
const DEFAULT_TITLE_AR = "أفضل فندق فاخر في النجف";
const DEFAULT_DESCRIPTION_EN =
  "At Najaf International Hotel, we believe that true hospitality is not measured by service alone, but by respect, genuine care, and the sense of peace throughout the stay.";
const DEFAULT_DESCRIPTION_AR =
  "في فندق النجف الدولي نؤمن بأن الضيافة الحقيقية لا تُقاس بالخدمة فقط بل بالاحترام والاهتمام والشعور بالطمأنينة طوال الإقامة.";
const DEFAULT_QUOTE_EN =
  "At Najaf International Hotel, we believe that true hospitality is not measured by service alone, but by respect, genuine care, and the sense of peace throughout the stay.";
const DEFAULT_QUOTE_AR =
  "في فندق النجف الدولي نؤمن بأن الضيافة الحقيقية لا تُقاس بالخدمة فقط بل بالاحترام والاهتمام والشعور بالطمأنينة طوال الإقامة.";
const DEFAULT_MANAGER_NAME_EN = "John D. Alexon";
const DEFAULT_MANAGER_NAME_AR = "جون د. أليكسون";
const DEFAULT_MANAGER_ROLE_EN = "Manager";
const DEFAULT_MANAGER_ROLE_AR = "المدير";
const DEFAULT_VIDEO_URL = "https://www.youtube.com/embed/fFDyoI73viQ";
const DEFAULT_POSTER = "/images/home-1/action-img.png";
const DEFAULT_AVATAR = "/images/home-1/call-do-action-img.png";

type ActionNextProps = {
  locale: Locale;
  title?: string;
  description?: string;
  quote?: string;
  managerName?: string;
  managerRole?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  managerAvatarUrl?: string;
};

export function ActionNext({
  locale,
  title,
  description,
  quote,
  managerName,
  managerRole,
  videoUrl,
  videoPosterUrl,
  managerAvatarUrl,
}: ActionNextProps) {
  const [toggler, setToggler] = useState(false);
  const isRtl = locale === "ar";

  const titleText =
    title?.trim() || (isRtl ? DEFAULT_TITLE_AR : DEFAULT_TITLE_EN);
  const descriptionText =
    description?.trim() ||
    (isRtl ? DEFAULT_DESCRIPTION_AR : DEFAULT_DESCRIPTION_EN);
  const quoteText =
    quote?.trim() || (isRtl ? DEFAULT_QUOTE_AR : DEFAULT_QUOTE_EN);
  const nameText =
    managerName?.trim() ||
    (isRtl ? DEFAULT_MANAGER_NAME_AR : DEFAULT_MANAGER_NAME_EN);
  const roleText =
    managerRole?.trim() ||
    (isRtl ? DEFAULT_MANAGER_ROLE_AR : DEFAULT_MANAGER_ROLE_EN);
  const managerLabel = isRtl ? "المدير" : "MANAGER";
  const videoSrc = videoUrl?.trim() || DEFAULT_VIDEO_URL;
  const posterSrc = videoPosterUrl?.trim() || DEFAULT_POSTER;
  const avatarSrc = managerAvatarUrl?.trim() || DEFAULT_AVATAR;

  return (
    <div className="bg-[#000]" dir={locale}>
      <section
        className="Container mt-[-90px] relative z-[1]"
        style={{
          maxWidth: "1330px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-0">
          <div
            className={`bg-[#f8f6f3] space-y-[14px] flex-1 font-Garamond px-5 sm:px-7 md:px-9 lg:pl-[70px] lg:pr-[70px] py-10 md:py-[96px] text-start ${isRtl ? "lg:order-2" : ""}`}
          >
            <h5 className="text-base text-[#C9A24D] leading-[26px] font-semibold">
              {managerLabel}
            </h5>
            <h1 className="text-[22px] sm:text-2xl md:text-[28px] xl:text-[32px] 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-[#1e1e1e] font-semibold">
              {titleText}
            </h1>
            <p className="text-sm sm:text-base font-Lora text-[#616161] font-normal leading-[26px] whitespace-pre-line">
              {descriptionText}
            </p>
            <p className="text-sm sm:text-base font-Lora italic leading-[26px] underline text-[#616161] font-normal whitespace-pre-line">
              &ldquo;{quoteText}&rdquo;
            </p>
            <div
              className={`flex items-center gap-6 pt-5 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <img
                src={avatarSrc}
                className="w-[65px] h-[65px] object-cover rounded-full shrink-0"
                alt=""
              />
              <div className="text-start">
                <h4 className="text-lg sm:text-[22px] leading-[26px] text-[#1e1e1e] font-semibold font-Garamond">
                  {nameText}
                </h4>
                <p className="pt-1 text-base leading-[26px] font-normal text-[#616161] font-Lora flex items-center gap-2">
                  <span className="w-5 h-[1px] shrink-0 bg-[#C9A24D]" />
                  {roleText}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`flex-1 h-[100%] w-full relative ${isRtl ? "lg:order-1" : ""}`}
          >
            <img
              src={posterSrc}
              className="h-full w-full md:h-[80%] lg:h-full 2xl:h-[99%] object-cover"
              alt=""
            />
            <button
              type="button"
              className="w-[70px] h-[70px] text-white absolute top-1/2 md:top-[50%] lg:top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#C9A24D] rounded-full flex items-center justify-center cursor-pointer z-[1] hover:bg-[#272727] transition-colors"
              onClick={() => setToggler(!toggler)}
              aria-label={isRtl ? "تشغيل الفيديو" : "Play video"}
            >
              <BsPlay className="w-8 h-8" />
            </button>
            <span className="top-[50%]  md:top-[50%] lg:top-[50%] left-[50%] lg:left-[50%] -translate-x-1/2 -translate-y-1/2 border w-[90px] h-[90px] rounded-full absolute border-white animate-pulse" />
          </div>
          <FsLightbox toggler={toggler} sources={[videoSrc]} />
        </div>
      </section>
    </div>
  );
}
