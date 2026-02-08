import Link from "next/link";
import { getActiveRooms } from "@/lib/actions/rooms";
import { AdminBookingForm } from "@/Components/admin/AdminBookingForm";

export default async function NewBookingPage() {
  const rooms = await getActiveRooms();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/bookings" className="hover:text-amber-400">
            Bookings
          </Link>
          <span>/</span>
          <span className="text-zinc-200">New booking</span>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-100">Add booking</h1>
      <p className="text-sm text-zinc-400">
        Create a new reservation. Room availability is checked for the selected dates.
      </p>
      <AdminBookingForm rooms={rooms} />
    </div>
  );
}
