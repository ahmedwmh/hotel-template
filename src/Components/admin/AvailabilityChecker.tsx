"use client";

import { useState } from "react";
import { checkRoomAvailability } from "@/lib/actions/availability";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import type { RoomListItem } from "@/lib/actions/admin-rooms";

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export function AvailabilityChecker({ rooms }: { rooms: RoomListItem[] }) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  async function handleCheck() {
    if (!roomId || !checkIn || !checkOut) {
      setResult(null);
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const available = await checkRoomAvailability(
        roomId,
        new Date(checkIn),
        new Date(checkOut)
      );
      setResult(available);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const room = rooms.find((r) => r.id === roomId);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="text-zinc-300">Room</Label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={inputClass}
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-zinc-300">Check-in</Label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label className="text-zinc-300">Check-out</Label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleCheck}
            disabled={loading || !roomId || !checkIn || !checkOut}
            className="w-full rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-500 disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Checking…" : "Check"}
          </Button>
        </div>
      </div>

      {result !== null && (
        <div
          className={`rounded-lg border p-4 ${
            result
              ? "border-emerald-600/50 bg-emerald-900/20 text-emerald-300"
              : "border-red-600/50 bg-red-900/20 text-red-300"
          }`}
        >
          {result ? (
            <p className="font-medium">
              {room?.name ?? "Room"} is <strong>available</strong> for the selected dates.
            </p>
          ) : (
            <p className="font-medium">
              {room?.name ?? "Room"} is <strong>not available</strong> for the selected dates (already booked or overlapping stay).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
