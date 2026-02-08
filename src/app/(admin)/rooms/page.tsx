import Link from "next/link";
import { listRooms } from "@/lib/actions/admin-rooms";
import { RoomsTable } from "@/Components/admin/RoomsTable";
import { Button } from "@/Components/ui/button";

export default async function AdminRoomsPage() {
  const result = await listRooms(false);
  const rooms = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Rooms</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage room types and rates.</p>
        </div>
        <Link href="/rooms/new">
          <Button className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 sm:w-auto">
            Add room
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 shadow-sm overflow-hidden">
        {result.success ? (
          <RoomsTable rooms={rooms} />
        ) : (
          <div className="p-6 text-zinc-400">{result.error}</div>
        )}
      </div>
    </div>
  );
}
