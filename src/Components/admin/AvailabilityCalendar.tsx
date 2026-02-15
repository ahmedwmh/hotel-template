"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import {
  listBookingsInRange,
  updateBookingStatus,
} from "@/lib/actions/admin-bookings";
import type { BookingListItem } from "@/lib/actions/admin-bookings";
import type { RoomListItem } from "@/lib/actions/admin-rooms";
import "./AvailabilityCalendar.css";

const ROOM_PALETTE = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#ca8a04",
  "#db2777",
  "#65a30d",
  "#4f46e5",
];

function bookingToEvent(
  b: BookingListItem,
  roomIdToColor: Record<string, string>
): { id: string; title: string; start: Date; end: Date; backgroundColor: string; borderColor: string; extendedProps: { bookingId: string } } {
  const color = roomIdToColor[b.room.id] ?? "#64748b";
  return {
    id: b.id,
    title: `${b.room.name} · ${b.guest.name}`,
    start: new Date(b.checkIn),
    end: new Date(b.checkOut),
    backgroundColor: color,
    borderColor: color,
    extendedProps: { bookingId: b.id },
  };
}

type AvailabilityCalendarProps = {
  rooms: RoomListItem[];
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AvailabilityCalendar({ rooms }: AvailabilityCalendarProps) {
  const router = useRouter();
  const [rawBookings, setRawBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomFilter, setRoomFilter] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roomIdToColor = useMemo(() => {
    const map: Record<string, string> = {};
    rooms.forEach((r, i) => {
      map[r.id] = ROOM_PALETTE[i % ROOM_PALETTE.length];
    });
    return map;
  }, [rooms]);

  const events = useMemo(() => {
    let list = rawBookings;
    if (roomFilter) {
      list = list.filter((b) => b.room.id === roomFilter);
    }
    return list.map((b) => bookingToEvent(b, roomIdToColor));
  }, [rawBookings, roomFilter, roomIdToColor]);

  const handleDatesSet = useCallback(async (arg: DatesSetArg) => {
    setLoading(true);
    const result = await listBookingsInRange(arg.start, arg.end, { confirmedOnly: true });
    if (result.success) {
      setRawBookings(result.data);
    } else {
      setRawBookings([]);
    }
    setLoading(false);
  }, []);

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const id = arg.event.extendedProps.bookingId as string;
    if (!id) return;
    const booking = rawBookings.find((b) => b.id === id) ?? null;
    setSelectedBooking(booking);
    setShowViewDetails(false);
    setError(null);
  }, [rawBookings]);

  const handleClosePanel = useCallback(() => {
    setSelectedBooking(null);
    setShowViewDetails(false);
    setError(null);
  }, []);

  const handleCancelBooking = useCallback(
    async (bookingId: string) => {
      setCancellingId(bookingId);
      setError(null);
      try {
        const res = await updateBookingStatus(bookingId, "CANCELLED");
        if (res.success) {
          setSelectedBooking(null);
          router.refresh();
        } else {
          setError(res.error);
        }
      } finally {
        setCancellingId(null);
      }
    },
    [router]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-zinc-300">Room</label>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="h-9 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/bookings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
        >
          + Add booking
        </Link>
      </div>

      {selectedBooking && (
        <div className="rounded-xl border border-zinc-600 bg-zinc-800 p-4 shadow-lg">
          {showViewDetails ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-zinc-100">Guest & booking details</h3>
                <button
                  type="button"
                  onClick={() => setShowViewDetails(false)}
                  className="rounded-lg border border-zinc-500 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-700"
                >
                  Back
                </button>
              </div>
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-zinc-500">Name</dt>
                  <dd className="mt-0.5 font-medium text-zinc-100">{selectedBooking.guest.name}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="mt-0.5 text-zinc-200">{selectedBooking.guest.email}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Phone</dt>
                  <dd className="mt-0.5 text-zinc-200">{selectedBooking.guest.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Room</dt>
                  <dd className="mt-0.5 text-zinc-200">{selectedBooking.room.name}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Check-in</dt>
                  <dd className="mt-0.5 text-zinc-200">{formatDate(selectedBooking.checkIn)}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Check-out</dt>
                  <dd className="mt-0.5 text-zinc-200">{formatDate(selectedBooking.checkOut)}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Guests</dt>
                  <dd className="mt-0.5 text-zinc-200">{selectedBooking.totalGuests}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Rate (per night)</dt>
                  <dd className="mt-0.5 text-zinc-200">{selectedBooking.rate}</dd>
                </div>
                {selectedBooking.reference && (
                  <div>
                    <dt className="text-zinc-500">Reference</dt>
                    <dd className="mt-0.5 font-mono text-zinc-200">{selectedBooking.reference}</dd>
                  </div>
                )}
              </dl>
            </>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-zinc-100">
                  {selectedBooking.room.name} · {selectedBooking.guest.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {formatDate(selectedBooking.checkIn)} – {formatDate(selectedBooking.checkOut)} · {selectedBooking.totalGuests} guest
                  {selectedBooking.totalGuests !== 1 ? "s" : ""}
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowViewDetails(true)}
                  className="inline-flex items-center rounded-lg border border-zinc-500 bg-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-100 hover:bg-zinc-600"
                >
                  View
                </button>
                <Link
                  href={`/bookings/${selectedBooking.id}/edit`}
                  className="inline-flex items-center rounded-lg border border-zinc-500 bg-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-100 hover:bg-zinc-600"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={cancellingId === selectedBooking.id}
                  className="inline-flex items-center rounded-lg border border-red-500/80 bg-red-600/20 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-600/40 disabled:opacity-50"
                >
                  {cancellingId === selectedBooking.id ? "Cancelling…" : "Cancel booking"}
                </button>
                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="inline-flex items-center rounded-lg border border-zinc-500 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="availability-calendar-dark rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-4 shadow-sm">
        {loading && (
          <div className="absolute left-0 right-0 z-10 flex h-[520px] items-center justify-center bg-zinc-800/90 text-zinc-400">
            Loading…
          </div>
        )}
        <div className={loading ? "relative opacity-70" : ""}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            datesSet={handleDatesSet}
            eventClick={handleEventClick}
            height={520}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{
              today: "Today",
              month: "Month",
            }}
            firstDay={1}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-4 py-3 text-sm text-zinc-400">
        <span className="font-medium text-zinc-300 w-full sm:w-auto">Rooms:</span>
        {rooms.map((r) => (
          <span key={r.id} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: roomIdToColor[r.id] ?? "#64748b" }}
            />
            {r.name}
          </span>
        ))}
      </div>
    </div>
  );
}
