"use server";

import { prisma } from "@/lib/prisma";
import type { PublicRoom } from "@/lib/room-rates";

/**
 * Fetch active rooms for public site with rates per guest count (1–5).
 */
export async function getActiveRooms(): Promise<PublicRoom[]> {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    include: {
      rates: { orderBy: { guestCount: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rooms.map((r) => toPublicRoom(r));
}

/**
 * Fetch a single active room by id with rates per guest count.
 */
export async function getRoomById(id: string): Promise<PublicRoom | null> {
  const room = await prisma.room.findFirst({
    where: { id, isActive: true },
    include: {
      rates: { orderBy: { guestCount: "asc" } },
    },
  });
  if (!room) return null;
  return toPublicRoom(room);
}

/** Prisma Decimal can be object; convert to number reliably for JSON/client. */
function decimalToNum(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const obj = v as { toNumber?: () => number };
  if (typeof obj.toNumber === "function") return obj.toNumber();
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

function parseRoomImages(json: string | null | undefined): string[] {
  if (!json || json.trim() === "") return [];
  try {
    const arr = JSON.parse(json) as unknown;
    return Array.isArray(arr) ? arr.filter((u): u is string => typeof u === "string" && u.length > 0) : [];
  } catch {
    return [];
  }
}

function toPublicRoom(
  r: {
    id: string;
    name: string;
    slug: string;
    capacity: number;
    rate?: unknown;
    rates: { guestCount: number; rate: unknown }[];
    nameEn?: string | null;
    nameAr?: string | null;
    descriptionEn?: string | null;
    descriptionAr?: string | null;
    images?: string | null;
  }
): PublicRoom {
  const rates: Record<number, string> = {};
  for (const tier of r.rates) {
    const num = decimalToNum(tier.rate);
    rates[tier.guestCount] = Number.isFinite(num) ? num.toFixed(2) : "0";
  }
  const fallbackNum = r.rate != null ? decimalToNum(r.rate) : (r.rates[0] ? decimalToNum(r.rates[0].rate) : 0);
  const fallbackOne = Number.isFinite(fallbackNum) ? fallbackNum.toFixed(2) : "0";
  for (let g = 1; g <= 5; g++) {
    if (rates[g] == null) rates[g] = fallbackOne;
  }
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    capacity: r.capacity,
    rates,
    rate: rates[1] ?? fallbackOne,
    nameEn: r.nameEn ?? undefined,
    nameAr: r.nameAr ?? undefined,
    descriptionEn: r.descriptionEn ?? undefined,
    descriptionAr: r.descriptionAr ?? undefined,
    images: parseRoomImages(r.images),
  };
}
