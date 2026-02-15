import Link from "next/link";
import { getRoomForEdit } from "@/lib/actions/admin-rooms";
import { RoomForm } from "@/Components/admin/RoomForm";
import { notFound } from "next/navigation";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getRoomForEdit(id);
  if (!result.success) {
    if (result.error === "Room not found.") notFound();
    return <div className="p-4 text-zinc-400">{result.error}</div>;
  }
  const room = result.data;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/rooms" className="hover:text-amber-400">Rooms</Link>
        <span>/</span>
        <span className="text-zinc-200">{room.name}</span>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-100">Edit room</h1>
      <RoomForm room={room} />
    </div>
  );
}
