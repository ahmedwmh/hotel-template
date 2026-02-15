import { listRooms } from "@/lib/actions/admin-rooms";
import { AvailabilityCalendar } from "@/Components/admin/AvailabilityCalendar";
import { AvailabilityChecker } from "@/Components/admin/AvailabilityChecker";

export default async function AvailabilityPage() {
  const roomsResult = await listRooms(true);
  const rooms = roomsResult.success ? roomsResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Availability</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Confirmed bookings only. When you confirm a booking in Bookings, it appears here. Click an event to edit or cancel.
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
          <p className="text-zinc-400">No active rooms. Add rooms first.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6">
            <AvailabilityCalendar rooms={rooms} />
          </div>
          <details className="rounded-xl border border-zinc-700/80 bg-zinc-800/60">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100">
              Check specific dates
            </summary>
            <div className="border-t border-zinc-700/80 p-4">
              <AvailabilityChecker rooms={rooms} />
            </div>
          </details>
        </>
      )}
    </div>
  );
}
