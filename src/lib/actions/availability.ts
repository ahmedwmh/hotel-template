"use server";

import { prisma } from "@/lib/prisma";

const AVAILABLE_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN"] as const;

/**
 * Check if a room type has availability for the given date range.
 * A room type has quantity N; we count overlapping bookings (same status logic).
 * Available if overlapping count < room.quantity.
 * Pass excludeBookingId when updating a booking so the current booking is not counted.
 */
export async function checkRoomAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { quantity: true },
  });
  if (!room) return false;

  const quantity = room.quantity ?? 1;

  const overlapping = await prisma.booking.count({
    where: {
      roomId,
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      status: { in: [...AVAILABLE_STATUSES] },
      OR: [
        {
          checkIn: { lt: end },
          checkOut: { gt: start },
        },
      ],
    },
  });

  return overlapping < quantity;
}
