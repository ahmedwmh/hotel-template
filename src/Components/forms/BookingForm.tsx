"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations";
import { createBooking } from "@/lib/actions/bookings";
import type { PublicRoom } from "@/lib/room-rates";
import { rateForGuests } from "@/lib/room-rates";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select } from "@/Components/ui/select";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { BookingAlert } from "@/Components/ui/BookingAlert";
import { HiOutlineCalendar, HiChevronDown } from "react-icons/hi2";

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function todayDateOnly(): string {
  return toDateOnly(new Date());
}

type BookingFormProps = {
  rooms: PublicRoom[];
  locale: string;
  messages: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    room: string;
    totalGuests: string;
    submit: string;
    loading: string;
    roomUnavailable: string;
    unavailableTitle: string;
    unavailableDescription: string;
    invalidDatesTitle: string;
    invalidDatesDescription: string;
    errorTitle: string;
    success: string;
  };
  defaultRoomId?: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
};

export function BookingForm({
  rooms,
  locale,
  messages,
  defaultRoomId,
  defaultCheckIn,
  defaultCheckOut,
}: BookingFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [errorVariant, setErrorVariant] = useState<"unavailable" | "error">("error");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomId: defaultRoomId ?? "",
      checkIn: defaultCheckIn ?? "",
      checkOut: defaultCheckOut ?? "",
      totalGuests: 1,
    },
  });

  const roomId = watch("roomId");
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const totalGuests = watch("totalGuests");
  const selectedRoom = rooms.find((r) => r.id === roomId);
  const maxGuestsGlobal = 5;
  const maxGuestsForRoom = selectedRoom ? Math.min(selectedRoom.capacity, maxGuestsGlobal) : maxGuestsGlobal;
  const guests = Math.min(totalGuests ?? 1, maxGuestsForRoom);
  const roomDisplayName = (r: PublicRoom) =>
    locale === "ar" ? (r.nameAr || r.name) : (r.nameEn || r.name);
  const roomOptions: { value: string; label: string }[] = [
    { value: "", label: `— ${messages.room} —` },
    ...rooms.map((r) => ({
      value: r.id,
      label: `${roomDisplayName(r)} — ${rateForGuests(r, guests)} / night`,
    })),
  ];
  const ratePerNight = selectedRoom ? rateForGuests(selectedRoom, guests) : null;
  const nights =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = ratePerNight && nights > 0 ? (parseFloat(ratePerNight) * nights).toFixed(2) : null;

  const guestLabel = (n: number) =>
    n === 1
      ? locale === "ar"
        ? "ضيف واحد"
        : "1 guest"
      : locale === "ar"
        ? `${n} ضيوف`
        : `${n} guests`;

  const guestOptions: { value: string; label: string }[] = Array.from(
    { length: maxGuestsForRoom },
    (_, i) => {
      const n = i + 1;
      return { value: String(n), label: guestLabel(n) };
    }
  );

  async function onSubmit(data: CreateBookingInput) {
    setServerError(null);
    const guestCount = selectedRoom
      ? Math.min(Math.max(1, data.totalGuests ?? 1), Math.min(selectedRoom.capacity, maxGuestsGlobal))
      : Math.max(1, Math.min(maxGuestsGlobal, data.totalGuests ?? 1));
    const result = await createBooking({ ...data, totalGuests: guestCount });
    if (result.success) {
      router.push(
        `/${locale}/book/confirmation?reference=${encodeURIComponent(result.data.reference)}`
      );
      router.refresh();
      return;
    }
    setErrorVariant(result.code === "UNAVAILABLE" ? "unavailable" : "error");
    setServerError(
      result.code === "UNAVAILABLE" ? messages.roomUnavailable : result.error
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 text-[#1e1e1e] dark:text-zinc-100">
      {selectedRoom && (
        <Card className="border-[#e8e8e8] dark:border-zinc-600 overflow-hidden bg-white dark:bg-zinc-800">
          <div className="relative h-40 bg-[#f8f6f3] dark:bg-zinc-700 flex items-center justify-center">
            <img
              src="/images/home-1/room-1.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="relative z-10 px-5 py-2 bg-[#C9A24D] text-white text-base font-Garamond font-medium">
              <span>{rateForGuests(selectedRoom, guests)}</span>
              <span className="mx-2">|</span>
              <span>{locale === "ar" ? "لليلة" : "per night"}</span>
              <span className="mx-2">·</span>
              <span>{guests} {guests === 1 ? (locale === "ar" ? "ضيف" : "guest") : locale === "ar" ? "ضيوف" : "guests"}</span>
            </div>
          </div>
          <CardHeader className="font-Garamond font-medium text-lg text-[#1e1e1e] dark:text-white">
            {selectedRoom.name}
          </CardHeader>
          <CardContent className="space-y-1 text-[#616161] dark:text-zinc-400 text-sm">
            <p>{locale === "ar" ? "السعة:" : "Capacity:"} {selectedRoom.capacity} {locale === "ar" ? "ضيوف" : "guests"}</p>
            <p className="text-base font-semibold text-[#1e1e1e] dark:text-zinc-200 mt-2">
              {locale === "ar" ? "السعر:" : "Rate:"} {rateForGuests(selectedRoom, guests)} / {locale === "ar" ? "ليلة" : "night"} ({guests} {guests === 1 ? (locale === "ar" ? "ضيف" : "guest") : locale === "ar" ? "ضيوف" : "guests"})
            </p>
          </CardContent>
        </Card>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.checkOut && (
        <BookingAlert
          variant="invalid_dates"
          title={messages.invalidDatesTitle}
          description={messages.invalidDatesDescription}
        />
      )}
      {serverError && !errors.checkOut && (
        <BookingAlert
          variant={errorVariant}
          title={
            errorVariant === "unavailable"
              ? messages.unavailableTitle
              : messages.errorTitle
          }
          description={
            errorVariant === "unavailable"
              ? messages.unavailableDescription
              : serverError
          }
        />
      )}
      <div>
        <Label htmlFor="guestName" className="text-[#1e1e1e] dark:text-zinc-200">{messages.guestName}</Label>
        <Input
          id="guestName"
          className="mt-1 border-[#e8e8e8] dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          {...register("guestName")}
        />
        {errors.guestName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guestName.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="guestEmail" className="text-[#1e1e1e] dark:text-zinc-200">{messages.guestEmail}</Label>
        <Input
          id="guestEmail"
          type="email"
          className="mt-1 border-[#e8e8e8] dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          {...register("guestEmail")}
        />
        {errors.guestEmail && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guestEmail.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="guestPhone" className="text-[#1e1e1e] dark:text-zinc-200">{messages.guestPhone}</Label>
        <Input
          id="guestPhone"
          type="tel"
          className="mt-1 border-[#e8e8e8] dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          {...register("guestPhone")}
        />
        {errors.guestPhone && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guestPhone.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="roomId" className="text-[#1e1e1e] dark:text-zinc-200">{messages.room}</Label>
          <Select
            id="roomId"
            options={roomOptions}
            value={roomId}
            onChange={(e) => {
              const newRoomId = e.target.value;
              setValue("roomId", newRoomId, { shouldValidate: true });
              const newRoom = rooms.find((r) => r.id === newRoomId);
              if (newRoom) {
                const maxForNewRoom = Math.min(newRoom.capacity, maxGuestsGlobal);
                const current = totalGuests ?? 1;
                if (current > maxForNewRoom) {
                  setValue("totalGuests", maxForNewRoom, { shouldValidate: true });
                }
              }
            }}
            className="mt-1 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
          {errors.roomId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roomId.message}</p>
          )}
        </div>
        <div>
          <Label className="text-[#1e1e1e] dark:text-zinc-200" htmlFor="totalGuests">
            {messages.totalGuests}
          </Label>
          <div className="mt-1 relative">
            <Select
              id="totalGuests"
              options={guestOptions}
              value={String(guests)}
              onChange={(e) => {
                const n = Number(e.target.value);
                setValue("totalGuests", n, { shouldValidate: true });
              }}
              className="h-12 pl-4 pr-10 text-base appearance-none cursor-pointer border border-[#e8e8e8] dark:border-zinc-600 bg-white dark:bg-zinc-800 text-[#1e1e1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D] focus:border-[#C9A24D] dark:focus:ring-[#C9A24D] rounded-md font-Lora w-full"
            />
            <HiChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161] dark:text-zinc-400 pointer-events-none"
              aria-hidden
            />
          </div>
          {errors.totalGuests && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalGuests.message}</p>
          )}
        </div>
      </div>

      {selectedRoom && ratePerNight && (
        <div className="rounded-xl border-2 border-[#C9A24D]/50 dark:border-amber-500/50 bg-[#f8f6f3] dark:bg-zinc-800 px-5 py-4">
          <p className="text-lg font-semibold text-[#1e1e1e] dark:text-zinc-100">
            {locale === "ar" ? "السعر: " : "Price: "}
            <span className="text-[#C9A24D] dark:text-amber-400">{ratePerNight}</span>
            <span className="text-[#616161] dark:text-zinc-400 font-normal text-base">
              {" "}
              / {locale === "ar" ? "ليلة" : "night"}
              {" · "}
              {guests} {guests === 1 ? (locale === "ar" ? "ضيف" : "guest") : locale === "ar" ? "ضيوف" : "guests"}
            </span>
          </p>
          {nights > 0 && totalPrice && (
            <p className="text-base font-medium text-[#1e1e1e] dark:text-zinc-200 mt-2">
              {nights} {locale === "ar" ? (nights === 1 ? "ليلة" : "ليالي") : nights === 1 ? "night" : "nights"} = <span className="text-[#C9A24D] dark:text-amber-400">{totalPrice}</span> {locale === "ar" ? "الإجمالي" : "total"}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="checkIn" className="text-[#1e1e1e] dark:text-zinc-200">{messages.checkIn}</Label>
          <div className="mt-1 relative">
            <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161] pointer-events-none" />
            <Input
              id="checkIn"
              type="date"
              min={todayDateOnly()}
              className="pl-10 h-12 text-base border-[#e8e8e8] dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              {...register("checkIn", {
                onChange: (e) => {
                  const val = e.target.value;
                  if (val && watch("checkOut") && watch("checkOut") < val) {
                    setValue("checkOut", "", { shouldValidate: true });
                  }
                },
              })}
            />
          </div>
          {errors.checkIn && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.checkIn.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="checkOut" className="text-[#1e1e1e] dark:text-zinc-200">{messages.checkOut}</Label>
          <div className="mt-1 relative">
            <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161] dark:text-zinc-400 pointer-events-none" />
            <Input
              id="checkOut"
              type="date"
              min={checkIn || todayDateOnly()}
              className="pl-10 h-12 text-base border-[#e8e8e8] dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              {...register("checkOut")}
            />
          </div>
          {errors.checkOut && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.checkOut.message}</p>
          )}
        </div>
      </div>

      {selectedRoom && (
        <p className="text-sm text-[#616161] dark:text-zinc-400">
          {locale === "ar" ? "سعة الغرفة:" : "Room capacity:"} {selectedRoom.capacity} · {locale === "ar" ? "حتى" : "Up to"} {maxGuestsForRoom} {locale === "ar" ? "ضيوف" : "guests"}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-[#C9A24D] hover:bg-[#B8923F] text-white font-Garamond font-medium uppercase px-8 py-3 h-12 border-0 focus-visible:ring-[#C9A24D]"
      >
        {isSubmitting ? messages.loading : messages.submit}
      </Button>
    </form>
    </div>
  );
}
