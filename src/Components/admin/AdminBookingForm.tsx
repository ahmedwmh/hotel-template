"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookingSchema,
  updateBookingSchema,
  type CreateBookingInput,
  type UpdateBookingInput,
} from "@/lib/validations";
import { createBooking } from "@/lib/actions/bookings";
import {
  updateBooking,
  type BookingDetail,
} from "@/lib/actions/admin-bookings";
import type { PublicRoom } from "@/lib/room-rates";
import { rateForGuests } from "@/lib/room-rates";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { BookingAlert } from "@/Components/ui/BookingAlert";
import { HiOutlineCalendar, HiChevronDown } from "react-icons/hi2";

function toDateOnly(d: Date): string {
  return new Date(d).toISOString().slice(0, 10);
}

function todayDateOnly(): string {
  return toDateOnly(new Date());
}

const STATUS_OPTIONS: { value: UpdateBookingInput["status"]; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "CHECKED_IN", label: "Checked in" },
  { value: "CHECKED_OUT", label: "Checked out" },
];

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

type AdminBookingFormProps = {
  rooms: PublicRoom[];
  booking?: BookingDetail;
};

export function AdminBookingForm({ rooms, booking }: AdminBookingFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<"UNAVAILABLE" | "VALIDATION" | "NOT_FOUND" | null>(null);
  const isEdit = !!booking;

  const createDefaults: CreateBookingInput = {
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    totalGuests: 1,
  };

  const editDefaults: UpdateBookingInput = booking
    ? {
        guestName: booking.guest.name,
        guestEmail: booking.guest.email,
        guestPhone: booking.guest.phone ?? "",
        roomId: booking.roomId,
        checkIn: toDateOnly(booking.checkIn),
        checkOut: toDateOnly(booking.checkOut),
        totalGuests: booking.totalGuests,
        status: booking.status as UpdateBookingInput["status"],
      }
    : { ...createDefaults, status: "PENDING" };

  const form = useForm<UpdateBookingInput>({
    resolver: zodResolver(updateBookingSchema),
    defaultValues: editDefaults,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const roomId = watch("roomId");
  const checkIn = watch("checkIn");
  const totalGuests = watch("totalGuests") ?? 1;
  const selectedRoom = rooms.find((r) => r.id === roomId);

  const roomOptions: { value: string; label: string }[] = [
    { value: "", label: "— Select room —" },
    ...rooms.map((r) => ({
      value: r.id,
      label: `${r.name} — ${rateForGuests(r, totalGuests)} / night`,
    })),
  ];

  const guestOptions: { value: string; label: string }[] = Array.from(
    { length: 5 },
    (_, i) => {
      const n = i + 1;
      return { value: String(n), label: n === 1 ? "1 guest" : `${n} guests` };
    }
  );

  async function onSubmit(data: UpdateBookingInput) {
    setServerError(null);
    setErrorCode(null);
    if (isEdit) {
      const res = await updateBooking(booking!.id, data);
      if (res.success) {
        router.push("/bookings");
        router.refresh();
        return;
      }
      setServerError(res.error);
      setErrorCode(res.code ?? null);
      return;
    }
    const { status: _s, ...createData } = data;
    const result = await createBooking(createData);
    if (result.success) {
      router.push("/bookings");
      router.refresh();
      return;
    }
    setServerError(result.error);
    setErrorCode(result.code ?? null);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6 rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6"
    >
      <div className="flex items-center justify-between border-b border-zinc-700/80 pb-4">
        <h2 className="text-lg font-semibold text-zinc-100">
          {isEdit ? "Edit booking" : "New booking"}
        </h2>
        {booking?.reference && (
          <span className="rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300">
            {booking.reference}
          </span>
        )}
      </div>

      {errors.checkOut && (
        <BookingAlert
          variant="invalid_dates"
          title="Invalid dates"
          description="Check-out must be after check-in. Please correct your dates."
        />
      )}
      {serverError && !errors.checkOut && (
        <BookingAlert
          variant={errorCode === "UNAVAILABLE" ? "unavailable" : "error"}
          title={
            errorCode === "UNAVAILABLE"
              ? "These dates are not available"
              : "Something went wrong"
          }
          description={
            errorCode === "UNAVAILABLE"
              ? "The room is already booked for some or all of these nights. Please choose different dates."
              : serverError
          }
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="guestName" className="text-zinc-300">
            Guest name
          </Label>
          <Input
            id="guestName"
            {...register("guestName")}
            className={inputClass}
            placeholder="Full name"
          />
          {errors.guestName && (
            <p className="mt-1 text-sm text-red-400">{errors.guestName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="guestEmail" className="text-zinc-300">
            Email
          </Label>
          <Input
            id="guestEmail"
            type="email"
            {...register("guestEmail")}
            className={inputClass}
            placeholder="guest@example.com"
          />
          {errors.guestEmail && (
            <p className="mt-1 text-sm text-red-400">{errors.guestEmail.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="guestPhone" className="text-zinc-300">
          Phone (optional)
        </Label>
        <Input
          id="guestPhone"
          type="tel"
          {...register("guestPhone")}
          className={inputClass}
          placeholder="+980..."
        />
        {errors.guestPhone && (
          <p className="mt-1 text-sm text-red-400">{errors.guestPhone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="roomId" className="text-zinc-300">
          Room
        </Label>
        <div className="relative mt-1">
          <select
            id="roomId"
            {...register("roomId", {
              onChange: (e) => setValue("roomId", e.target.value, { shouldValidate: true }),
            })}
            className={`${inputClass} appearance-none pr-10`}
          >
            {roomOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <HiChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
        </div>
        {errors.roomId && (
          <p className="mt-1 text-sm text-red-400">{errors.roomId.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="checkIn" className="text-zinc-300">
            Check-in
          </Label>
          <div className="relative mt-1">
            <HiOutlineCalendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <Input
              id="checkIn"
              type="date"
              {...register("checkIn", {
                onChange: (e) => {
                  const val = e.target.value;
                  if (val && watch("checkOut") && watch("checkOut") < val) {
                    setValue("checkOut", "", { shouldValidate: true });
                  }
                },
              })}
              min={isEdit ? undefined : todayDateOnly()}
              className={`${inputClass} pl-10`}
            />
          </div>
          {errors.checkIn && (
            <p className="mt-1 text-sm text-red-400">{errors.checkIn.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="checkOut" className="text-zinc-300">
            Check-out
          </Label>
          <div className="relative mt-1">
            <HiOutlineCalendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <Input
              id="checkOut"
              type="date"
              {...register("checkOut")}
              min={checkIn || (isEdit ? undefined : todayDateOnly())}
              className={`${inputClass} pl-10`}
            />
          </div>
          {errors.checkOut && (
            <p className="mt-1 text-sm text-red-400">{errors.checkOut.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="totalGuests" className="text-zinc-300">
            Total guests
          </Label>
          <div className="relative mt-1">
            <select
              id="totalGuests"
              {...register("totalGuests", {
                valueAsNumber: true,
                onChange: (e) =>
                  setValue("totalGuests", Number(e.target.value), { shouldValidate: true }),
              })}
              className={`${inputClass} appearance-none pr-10`}
            >
              {guestOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <HiChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
          </div>
          {errors.totalGuests && (
            <p className="mt-1 text-sm text-red-400">{errors.totalGuests.message}</p>
          )}
        </div>

        {isEdit && (
          <div>
            <Label htmlFor="status" className="text-zinc-300">
              Status
            </Label>
            <div className="relative mt-1">
              <select
                id="status"
                {...register("status")}
                className={`${inputClass} appearance-none pr-10`}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <HiChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                aria-hidden
              />
            </div>
          </div>
        )}
      </div>

      {selectedRoom && (
        <p className="rounded-lg bg-zinc-700/50 px-3 py-2 text-sm text-zinc-300">
          <span className="font-medium text-zinc-200">{selectedRoom.name}</span>
          {" · "}
          {rateForGuests(selectedRoom, totalGuests)} / night for {totalGuests}{" "}
          {totalGuests === 1 ? "guest" : "guests"}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-zinc-700/80 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create booking"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/bookings")}
          className="rounded-lg border-zinc-600 bg-zinc-700/50 px-5 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
