import { z } from "zod";

const dateString = z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
  message: "Invalid date",
});

const bookingBaseSchema = z.object({
  guestName: z.string().min(1, "Name is required"),
  guestEmail: z.string().email("Invalid email"),
  guestPhone: z.string().optional(),
  roomId: z.string().min(1, "Room is required"),
  checkIn: dateString,
  checkOut: dateString,
  totalGuests: z.coerce.number().int().min(1, "At least 1 guest").max(5, "Maximum 5 guests"),
});

const checkOutAfterCheckIn = (data: { checkIn: string; checkOut: string }) =>
  new Date(data.checkOut) > new Date(data.checkIn);

export const createBookingSchema = bookingBaseSchema.refine(checkOutAfterCheckIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = bookingBaseSchema
  .extend({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT"]),
  })
  .refine(checkOutAfterCheckIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
