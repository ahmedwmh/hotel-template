"use server";

import { prisma } from "@/lib/prisma";
import type { BookingStatus, Prisma } from "@prisma/client";
import { updateBookingSchema, type UpdateBookingInput } from "@/lib/validations";
import { checkRoomAvailability } from "./availability";

export type BookingFilters = {
  status?: BookingStatus;
  dateFrom?: string; // ISO date
  dateTo?: string;   // ISO date
  guestSearch?: string;
};

export type BookingListItem = {
  id: string;
  reference: string | null;
  status: string;
  checkIn: Date;
  checkOut: Date;
  totalGuests: number;
  rate: number;
  contactedAt: Date | null;
  guest: { name: string; email: string; phone: string | null };
  room: { id: string; name: string; slug: string };
};

export type ListBookingsResult =
  | { success: true; data: BookingListItem[] }
  | { success: false; error: string };

export type UpdateBookingResult =
  | { success: true }
  | { success: false; error: string; code?: string };

const VALID_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "CHECKED_IN",
  "CHECKED_OUT",
];

export async function listBookings(
  filters: BookingFilters = {}
): Promise<ListBookingsResult> {
  try {
    const where: Prisma.BookingWhereInput = {};

    if (filters.status && VALID_STATUSES.includes(filters.status)) {
      where.status = filters.status;
    }

    if (filters.dateFrom) {
      const d = new Date(filters.dateFrom);
      d.setHours(0, 0, 0, 0);
      where.checkIn = { gte: d };
    }
    if (filters.dateTo) {
      const d = new Date(filters.dateTo);
      d.setHours(23, 59, 59, 999);
      where.checkOut = { lte: d };
    }

    if (filters.guestSearch?.trim()) {
      const q = filters.guestSearch.trim();
      where.guest = {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        guest: true,
        room: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { checkIn: "desc" },
    });

    const data: BookingListItem[] = bookings.map((b) => ({
      id: b.id,
      reference: b.reference,
      status: b.status,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalGuests: b.totalGuests,
      rate: Number(b.rate),
      contactedAt: b.contactedAt,
      guest: {
        name: b.guest.name,
        email: b.guest.email,
        phone: b.guest.phone,
      },
      room: {
        id: b.room.id,
        name: b.room.name,
        slug: b.room.slug,
      },
    }));

    return { success: true, data };
  } catch (e) {
    console.error("[admin-bookings] listBookings:", e);
    return { success: false, error: "Failed to list bookings." };
  }
}

/**
 * List bookings that overlap the given date range (for calendar view).
 * A booking overlaps if checkIn < rangeEnd && checkOut > rangeStart.
 */
export async function listBookingsInRange(
  rangeStart: Date,
  rangeEnd: Date
): Promise<ListBookingsResult> {
  try {
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      include: {
        guest: true,
        room: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { checkIn: "asc" },
    });

    const data: BookingListItem[] = bookings.map((b) => ({
      id: b.id,
      reference: b.reference,
      status: b.status,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalGuests: b.totalGuests,
      rate: Number(b.rate),
      contactedAt: b.contactedAt,
      guest: {
        name: b.guest.name,
        email: b.guest.email,
        phone: b.guest.phone,
      },
      room: {
        id: b.room.id,
        name: b.room.name,
        slug: b.room.slug,
      },
    }));

    return { success: true, data };
  } catch (e) {
    console.error("[admin-bookings] listBookingsInRange:", e);
    return { success: false, error: "Failed to load bookings." };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<UpdateBookingResult> {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Invalid status.", code: "VALIDATION" };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: "Booking not found or update failed.", code: "NOT_FOUND" };
  }
}

export async function markBookingContacted(bookingId: string): Promise<UpdateBookingResult> {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { contactedAt: new Date() },
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: "Booking not found or update failed.", code: "NOT_FOUND" };
  }
}

export type BookingDetail = {
  id: string;
  reference: string | null;
  status: string;
  checkIn: Date;
  checkOut: Date;
  totalGuests: number;
  rate: number;
  contactedAt: Date | null;
  guestId: string;
  guest: { name: string; email: string; phone: string | null };
  roomId: string;
  room: { id: string; name: string; slug: string };
};

export type GetBookingResult =
  | { success: true; data: BookingDetail }
  | { success: false; error: string };

export async function getBookingById(bookingId: string): Promise<GetBookingResult> {
  try {
    const b = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        guest: true,
        room: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!b) return { success: false, error: "Booking not found." };
    return {
      success: true,
      data: {
        id: b.id,
        reference: b.reference,
        status: b.status,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        totalGuests: b.totalGuests,
        rate: Number(b.rate),
        contactedAt: b.contactedAt,
        guestId: b.guestId,
        guest: { name: b.guest.name, email: b.guest.email, phone: b.guest.phone },
        roomId: b.roomId,
        room: { id: b.room.id, name: b.room.name, slug: b.room.slug },
      },
    };
  } catch (e) {
    console.error("[admin-bookings] getBookingById:", e);
    return { success: false, error: "Failed to load booking." };
  }
}

export type FullUpdateBookingResult =
  | { success: true }
  | { success: false; error: string; code?: "VALIDATION" | "UNAVAILABLE" | "NOT_FOUND" };

export async function updateBooking(
  bookingId: string,
  input: UpdateBookingInput
): Promise<FullUpdateBookingResult> {
  const parsed = updateBookingSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat().join(" ") || "Validation failed.";
    return { success: false, error: msg, code: "VALIDATION" };
  }

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { guest: true },
  });
  if (!existing) return { success: false, error: "Booking not found.", code: "NOT_FOUND" };

  const { guestName, guestEmail, guestPhone, roomId, checkIn, checkOut, totalGuests, status } =
    parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { rates: true },
  });
  if (!room || !room.isActive) {
    return { success: false, error: "Room not found or not available.", code: "NOT_FOUND" };
  }

  const guestCount = Math.max(1, Math.min(5, totalGuests));
  const rateTier = room.rates.find((r) => r.guestCount === guestCount);
  const ratePerNight = rateTier?.rate ?? room.rate ?? room.rates[0]?.rate;
  if (ratePerNight == null) {
    return { success: false, error: "Room rate not configured for this number of guests.", code: "NOT_FOUND" };
  }

  const available = await checkRoomAvailability(
    roomId,
    checkInDate,
    checkOutDate,
    bookingId
  );
  if (!available) {
    return { success: false, error: "Room not available for these dates.", code: "UNAVAILABLE" };
  }

  try {
    await prisma.guest.update({
      where: { id: existing.guestId },
      data: {
        name: guestName,
        email: guestEmail,
        phone: guestPhone ?? undefined,
      },
    });
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalGuests: guestCount,
        rate: ratePerNight,
        status: status as BookingStatus,
      },
    });
    return { success: true };
  } catch (e) {
    console.error("[admin-bookings] updateBooking:", e);
    return { success: false, error: "Update failed.", code: "NOT_FOUND" };
  }
}

export type DeleteBookingResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteBooking(bookingId: string): Promise<DeleteBookingResult> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { guest: true },
    });
    if (!booking) return { success: false, error: "Booking not found." };
    const otherCount = await prisma.booking.count({
      where: { guestId: booking.guestId, id: { not: bookingId } },
    });
    await prisma.booking.delete({ where: { id: bookingId } });
    if (otherCount === 0) {
      await prisma.guest.delete({ where: { id: booking.guestId } });
    }
    return { success: true };
  } catch (e) {
    console.error("[admin-bookings] deleteBooking:", e);
    return { success: false, error: "Failed to delete booking." };
  }
}
