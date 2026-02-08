"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import type { PublicRoom } from "@/lib/room-rates";

type RoomCardProps = {
  room: PublicRoom;
  imageSrc: string;
  locale: string;
  roomLabel: string;
  guestsLabel: string;
  nightLabel: string;
  viewDetailsLabel: string;
  bookLabel: string;
  isAr: boolean;
};

export function RoomCard({
  room,
  imageSrc,
  locale,
  roomLabel,
  guestsLabel,
  nightLabel,
  viewDetailsLabel,
  bookLabel,
  isAr,
}: RoomCardProps) {
  const router = useRouter();
  const roomHref = `/${locale}/rooms/${room.id}`;
  const bookHref = `/${locale}/book?room=${room.id}`;
  const displayName = isAr ? (room.nameAr || room.name) : (room.nameEn || room.name);

  return (
    <Link
      href={roomHref}
      className="overflow-hidden group relative font-Garamond bg-zinc-800 border border-zinc-600 transition-shadow hover:shadow-lg hover:shadow-black/20 block cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={displayName}
          className="w-full h-[260px] lg:h-[280px] object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 inline-flex items-center justify-center bg-[#c19d68] text-white text-sm font-Lora font-normal leading-[26px] px-3 py-1.5">
          <span>{room.rate}</span>
          <span className="mx-2">|</span>
          <span>{nightLabel}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-[15px] leading-[38px] bg-zinc-900/90 absolute bottom-0 -left-full w-full py-2 text-white group-hover:left-0 transition-all duration-300 hover:bg-[#c19d68]">
          {viewDetailsLabel}
          <BsArrowRight className="w-4 h-4" />
        </div>
      </div>
      <div className="border-t-0 border border-zinc-600">
        <div className="py-5 px-5 lg:px-6">
          <p className="text-sm leading-[26px] text-[#c19d68] uppercase font-semibold">
            {roomLabel}
          </p>
          <h2 className="text-xl lg:text-2xl leading-[26px] font-semibold text-white py-3 group-hover:text-[#c19d68] transition-colors">
            {displayName}
          </h2>
          <p className="text-sm font-normal text-zinc-400 font-Lora">
            {room.capacity} {guestsLabel}
          </p>
        </div>
        <div className="border-t border-zinc-600 py-4 px-5 lg:px-6 flex items-center justify-between">
          <span className="font-Lora text-sm text-zinc-400">
            {room.capacity} {isAr ? "سرير" : "Guests"}
          </span>
          <ul className="flex items-center text-[#c19d68] gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <FaStar className="w-4 h-4" />
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 lg:p-6 pt-0 flex gap-3">
          <span className="flex-1 flex items-center justify-center gap-2 h-12 border border-zinc-500 text-white font-Garamond font-medium text-sm uppercase group-hover:bg-zinc-600 group-hover:border-zinc-500 transition-colors pointer-events-none">
            {viewDetailsLabel}
            <BsArrowRight className="w-4 h-4" />
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(bookHref);
            }}
            className="flex-1 flex items-center justify-center h-12 bg-[#c19d68] text-white font-Garamond font-medium text-sm uppercase hover:bg-[#a88652] transition-colors"
          >
            {bookLabel}
          </button>
        </div>
      </div>
    </Link>
  );
}
