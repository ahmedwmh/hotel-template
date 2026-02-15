import Link from "next/link";
import { RoomForm } from "@/Components/admin/RoomForm";

export default function NewRoomPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/rooms" className="hover:text-amber-400">Rooms</Link>
        <span>/</span>
        <span className="text-zinc-200">New</span>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-100">Add room</h1>
      <RoomForm />
    </div>
  );
}
