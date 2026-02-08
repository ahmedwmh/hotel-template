"use server";

import { prisma } from "@/lib/prisma";
import {
  createRoomSchema,
  updateRoomSchema,
  type CreateRoomInput,
  type UpdateRoomInput,
} from "@/lib/validations";

export type RoomListItem = {
  id: string;
  name: string;
  slug: string;
  capacity: number;
  quantity: number;
  rate: number;
  isActive: boolean;
  createdAt: Date;
  nameEn?: string | null;
  nameAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
};

/** أسعار الليلة حسب عدد الضيوف (1–5) */
export type RoomRatesMap = { 1: number; 2: number; 3: number; 4: number; 5: number };

export type RoomWithRates = RoomListItem & { rates: RoomRatesMap };

export type ListRoomsResult =
  | { success: true; data: RoomListItem[] }
  | { success: false; error: string };

export type MutateRoomResult =
  | { success: true; data: RoomListItem }
  | { success: false; error: string; code?: "VALIDATION" | "NOT_FOUND" | "HAS_BOOKINGS" };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function rateForOne(room: { rate: unknown; rates: { guestCount: number; rate: unknown }[] }): number {
  const tier = room.rates?.find((r) => r.guestCount === 1);
  if (tier) return Number(tier.rate);
  return room.rate != null ? Number(room.rate) : 0;
}

function ratesFromTiers(tiers: { guestCount: number; rate: unknown }[]): RoomRatesMap {
  const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const t of tiers) {
    if (t.guestCount >= 1 && t.guestCount <= 5) {
      const n = Number(t.rate);
      map[t.guestCount as 1 | 2 | 3 | 4 | 5] = Number.isFinite(n) ? n : 0;
    }
  }
  return map as RoomRatesMap;
}

export async function listRooms(activeOnly?: boolean): Promise<ListRoomsResult> {
  try {
    const rooms = await prisma.room.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: { rates: true },
      orderBy: { name: "asc" },
    });
    const data: RoomListItem[] = rooms.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      capacity: r.capacity,
      quantity: r.quantity,
      rate: rateForOne(r),
      isActive: r.isActive,
      createdAt: r.createdAt,
      nameEn: r.nameEn ?? undefined,
      nameAr: r.nameAr ?? undefined,
      descriptionEn: r.descriptionEn ?? undefined,
      descriptionAr: r.descriptionAr ?? undefined,
    }));
    return { success: true, data };
  } catch (e) {
    console.error("[admin-rooms] listRooms:", e);
    return { success: false, error: "Failed to list rooms." };
  }
}

export type GetRoomForEditResult =
  | { success: true; data: RoomWithRates }
  | { success: false; error: string };

export async function getRoomForEdit(id: string): Promise<GetRoomForEditResult> {
  try {
    const room = await prisma.room.findUnique({
      where: { id },
      include: { rates: { orderBy: { guestCount: "asc" } } },
    });
    if (!room) return { success: false, error: "Room not found." };
    const rates = ratesFromTiers(room.rates);
    return {
      success: true,
      data: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        capacity: room.capacity,
        quantity: room.quantity,
        rate: rateForOne(room),
        isActive: room.isActive,
        createdAt: room.createdAt,
        rates,
        nameEn: room.nameEn ?? undefined,
        nameAr: room.nameAr ?? undefined,
        descriptionEn: room.descriptionEn ?? undefined,
        descriptionAr: room.descriptionAr ?? undefined,
      },
    };
  } catch (e) {
    console.error("[admin-rooms] getRoomForEdit:", e);
    return { success: false, error: "Failed to load room." };
  }
}

export async function createRoom(
  input: Omit<CreateRoomInput, "slug"> & { slug?: string }
): Promise<MutateRoomResult> {
  const normalizedSlug = (input.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const parsed = createRoomSchema.safeParse({ ...input, slug: normalizedSlug || (input.slug ?? "").trim() });
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join(" ") || "Validation failed.";
    return { success: false, error: msg, code: "VALIDATION" };
  }

  try {
    const rates = parsed.data.rates;
    const slugValue = parsed.data.slug;
    const room = await prisma.room.create({
      data: {
        name: slugValue,
        slug: slugValue,
        capacity: parsed.data.capacity,
        quantity: parsed.data.quantity ?? 1,
        rate: rates[1],
        isActive: parsed.data.isActive ?? true,
        ...(parsed.data.nameEn != null && parsed.data.nameEn !== "" && { nameEn: parsed.data.nameEn }),
        ...(parsed.data.nameAr != null && parsed.data.nameAr !== "" && { nameAr: parsed.data.nameAr }),
        ...(parsed.data.descriptionEn != null && parsed.data.descriptionEn !== "" && { descriptionEn: parsed.data.descriptionEn }),
        ...(parsed.data.descriptionAr != null && parsed.data.descriptionAr !== "" && { descriptionAr: parsed.data.descriptionAr }),
      },
    });
    for (let guestCount = 1; guestCount <= 5; guestCount++) {
      await prisma.roomRate.create({
        data: {
          roomId: room.id,
          guestCount,
          rate: rates[guestCount as 1 | 2 | 3 | 4 | 5],
        },
      });
    }
    return {
      success: true,
      data: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        capacity: room.capacity,
        quantity: room.quantity,
        rate: rates[1],
        isActive: room.isActive,
        createdAt: room.createdAt,
      },
    };
  } catch (e: unknown) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002"
      ? "A room with this slug already exists."
      : "Failed to create room.";
    return { success: false, error: msg, code: "NOT_FOUND" };
  }
}

export async function updateRoom(
  id: string,
  input: UpdateRoomInput
): Promise<MutateRoomResult> {
  const parsed = updateRoomSchema.safeParse(input);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join(" ") || "Validation failed.";
    return { success: false, error: msg, code: "VALIDATION" };
  }

  const existing = await prisma.room.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Room not found.", code: "NOT_FOUND" };

  try {
    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(parsed.data.slug != null && { name: parsed.data.slug, slug: parsed.data.slug }),
        ...(parsed.data.capacity != null && { capacity: parsed.data.capacity }),
        ...(parsed.data.quantity != null && { quantity: parsed.data.quantity }),
        ...(parsed.data.rates != null && { rate: parsed.data.rates[1] }),
        ...(parsed.data.isActive != null && { isActive: parsed.data.isActive }),
        ...(parsed.data.nameEn !== undefined && { nameEn: parsed.data.nameEn || null }),
        ...(parsed.data.nameAr !== undefined && { nameAr: parsed.data.nameAr || null }),
        ...(parsed.data.descriptionEn !== undefined && { descriptionEn: parsed.data.descriptionEn || null }),
        ...(parsed.data.descriptionAr !== undefined && { descriptionAr: parsed.data.descriptionAr || null }),
      },
    });
    if (parsed.data.rates != null) {
      const rates = parsed.data.rates;
      for (let guestCount = 1; guestCount <= 5; guestCount++) {
        const rate = rates[guestCount as 1 | 2 | 3 | 4 | 5];
        await prisma.roomRate.upsert({
          where: { roomId_guestCount: { roomId: id, guestCount } },
          update: { rate },
          create: { roomId: id, guestCount, rate },
        });
      }
    }
    const withRates = await prisma.room.findUnique({
      where: { id },
      include: { rates: true },
    });
    return {
      success: true,
      data: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        capacity: room.capacity,
        quantity: room.quantity,
        rate: withRates ? rateForOne(withRates) : Number(room.rate ?? 0),
        isActive: room.isActive,
        createdAt: room.createdAt,
      },
    };
  } catch (e: unknown) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002"
      ? "A room with this slug already exists."
      : "Failed to update room.";
    return { success: false, error: msg, code: "NOT_FOUND" };
  }
}

export async function deleteOrDisableRoom(id: string): Promise<MutateRoomResult> {
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) return { success: false, error: "Room not found.", code: "NOT_FOUND" };

  const futureBookings = await prisma.booking.count({
    where: {
      roomId: id,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { gte: new Date() },
    },
  });

  if (futureBookings > 0) {
    return {
      success: false,
      error: `Cannot delete: room has ${futureBookings} future booking(s). Consider soft-disabling instead.`,
      code: "HAS_BOOKINGS",
    };
  }

  try {
    await prisma.room.delete({ where: { id } });
    const rate = room.rate != null ? Number(room.rate) : 0;
    return {
      success: true,
      data: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        capacity: room.capacity,
        quantity: room.quantity,
        rate,
        isActive: room.isActive,
        createdAt: room.createdAt,
      },
    };
  } catch (e) {
    return { success: false, error: "Failed to delete room.", code: "NOT_FOUND" };
  }
}

export async function softDisableRoom(id: string): Promise<MutateRoomResult> {
  return updateRoom(id, { isActive: false });
}
