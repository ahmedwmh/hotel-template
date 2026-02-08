"use server";

import { prisma } from "@/lib/prisma";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations";
import { checkRoomAvailability } from "./availability";

export type CreateBookingResult =
  | { success: true; data: { id: string; reference: string; status: string } }
  | { success: false; error: string; code?: "VALIDATION" | "UNAVAILABLE" | "NOT_FOUND" };

function generateReference(): string {
  const now = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BK-${now}-${rnd}`;
}

/**
 * Create a booking: validate input, check room and availability, create Guest + Booking.
 * Returns success with id/reference or localized error (e.g. room unavailable).
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat().join(" ") || "Validation failed.";
    return { success: false, error: msg, code: "VALIDATION" };
  }

  const { guestName, guestEmail, guestPhone, roomId, checkIn, checkOut, totalGuests } =
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
    return {
      success: false,
      error: "Room not found or not available.",
      code: "NOT_FOUND",
    };
  }

  const guestCount = Math.max(1, Math.min(5, totalGuests));
  const rateTier = room.rates.find((r) => r.guestCount === guestCount);
  const ratePerNight = rateTier?.rate ?? room.rate ?? room.rates[0]?.rate;
  if (ratePerNight == null) {
    return {
      success: false,
      error: "Room rate not configured for this number of guests.",
      code: "NOT_FOUND",
    };
  }

  const available = await checkRoomAvailability(
    roomId,
    checkInDate,
    checkOutDate
  );
  if (!available) {
    return {
      success: false,
      error: "Room not available for these dates.",
      code: "UNAVAILABLE",
    };
  }

  const reference = generateReference();

  const guest = await prisma.guest.create({
    data: {
      name: guestName,
      email: guestEmail,
      phone: guestPhone ?? undefined,
    },
  });

  const booking = await prisma.booking.create({
    data: {
      guestId: guest.id,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalGuests: guestCount,
      rate: ratePerNight,
      reference,
      status: "PENDING",
    },
  });

  return {
    success: true,
    data: {
      id: booking.id,
      reference,
      status: booking.status,
    },
  };
}
