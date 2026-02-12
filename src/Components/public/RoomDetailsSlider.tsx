"use client";

import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { hotelImages } from "@/lib/hotel-images";

const FALLBACK_IMAGES = hotelImages.roomDetails;

type RoomDetailsSliderProps = {
  /** Room images from DB; when provided, these are used instead of fallback. */
  images?: string[];
};

export function RoomDetailsSlider({ images }: RoomDetailsSliderProps) {
  const list = images != null && images.length > 0 ? images : FALLBACK_IMAGES;
  const [imageIndex, setImageIndex] = useState(0);

  const prev = () =>
    setImageIndex((i) => (i - 1 + list.length) % list.length);
  const next = () =>
    setImageIndex((i) => (i + 1) % list.length);

  return (
    <div className="overflow-hidden relative group">
      <img
        src={list[imageIndex]}
        alt=""
        className="w-full h-full object-cover transition-all duration-500"
      />
      <button
        type="button"
        onClick={prev}
        className="w-10 h-10 lg:w-12 lg:h-12 bg-white hover:bg-[#C9A24D] grid items-center justify-center absolute bottom-[45%] left-0 lg:left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer border-0"
        aria-label="Previous image"
      >
        <BsArrowLeft size={20} className="text-[#1e1e1e] hover:text-white" />
      </button>
      <button
        type="button"
        onClick={next}
        className="w-10 h-10 lg:w-12 lg:h-12 bg-white hover:bg-[#C9A24D] grid items-center justify-center absolute bottom-[45%] right-0 lg:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer border-0"
        aria-label="Next image"
      >
        <BsArrowRight size={20} className="text-[#1e1e1e] hover:text-white" />
      </button>
    </div>
  );
}
