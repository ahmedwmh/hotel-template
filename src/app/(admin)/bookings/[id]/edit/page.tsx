import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/actions/admin-bookings";
import { getActiveRooms } from "@/lib/actions/rooms";
import { AdminBookingForm } from "@/Components/admin/AdminBookingForm";

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [bookingResult, rooms] = await Promise.all([
    getBookingById(id),
    getActiveRooms(),
  ]);

  if (!bookingResult.success || !bookingResult.data) notFound();
  const booking = bookingResult.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/bookings" className="hover:text-amber-400">
          Bookings
        </Link>
        <span>/</span>
        <span className="text-zinc-200">
          {booking.reference ?? booking.guest.name}
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-100">Edit booking</h1>
      <p className="text-sm text-zinc-400">
        Update guest, room, dates, or status. Availability is checked when changing room or dates.
      </p>
      <AdminBookingForm rooms={rooms} booking={booking} />
    </div>
  );
}
