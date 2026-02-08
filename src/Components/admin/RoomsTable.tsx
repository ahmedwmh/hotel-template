"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  deleteOrDisableRoom,
  softDisableRoom,
  type RoomListItem,
} from "@/lib/actions/admin-rooms";

export function RoomsTable({ rooms }: { rooms: RoomListItem[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this room permanently? This will fail if it has future bookings.")) return;
    const res = await deleteOrDisableRoom(id);
    if (res.success) router.refresh();
    else alert(res.error);
  }

  async function handleDisable(id: string) {
    if (!confirm("Disable this room? It will be hidden from the public site and booking form.")) return;
    const res = await softDisableRoom(id);
    if (res.success) router.refresh();
    else alert(res.error);
  }

  if (rooms.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        No rooms yet.{" "}
        <Link href="/rooms/new" className="text-amber-400 hover:underline">
          Add a room
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700/80 hover:bg-zinc-800/50">
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Slug</TableHead>
            <TableHead className="text-zinc-400">Capacity</TableHead>
            <TableHead className="text-zinc-400">Qty</TableHead>
            <TableHead className="text-zinc-400">Rate</TableHead>
            <TableHead className="text-zinc-400">Active</TableHead>
            <TableHead className="text-zinc-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((r) => (
            <TableRow
              key={r.id}
              className="border-zinc-700/80 text-zinc-200 hover:bg-zinc-800/50"
            >
              <TableCell className="font-medium text-zinc-100">{r.name}</TableCell>
              <TableCell className="text-zinc-400">{r.slug}</TableCell>
              <TableCell>{r.capacity}</TableCell>
              <TableCell>{r.quantity}</TableCell>
              <TableCell>{Number(r.rate).toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={
                    r.isActive
                      ? "text-emerald-400"
                      : "text-zinc-500"
                  }
                >
                  {r.isActive ? "Yes" : "No"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/rooms/${r.id}/edit`}
                    className="rounded px-2 py-1 text-sm text-amber-400 hover:bg-amber-600/20"
                  >
                    Edit
                  </Link>
                  {r.isActive && (
                    <button
                      type="button"
                      onClick={() => handleDisable(r.id)}
                      className="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                    >
                      Disable
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
