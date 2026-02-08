"use client";

import { useState } from "react";
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
  updateBookingStatus,
  markBookingContacted,
  deleteBooking,
  type BookingListItem,
} from "@/lib/actions/admin-bookings";
import type { BookingStatus } from "@prisma/client";

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "CHECKED_IN", label: "Checked in" },
  { value: "CHECKED_OUT", label: "Checked out" },
];

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BookingsTable({ bookings }: { bookings: BookingListItem[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(bookingId: string, status: BookingStatus) {
    setUpdatingId(bookingId);
    setError(null);
    try {
      const res = await updateBookingStatus(bookingId, status);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error);
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleMarkContacted(bookingId: string) {
    setUpdatingId(bookingId);
    setError(null);
    try {
      const res = await markBookingContacted(bookingId);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error);
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(bookingId: string) {
    setDeletingId(bookingId);
    setError(null);
    const res = await deleteBooking(bookingId);
    setDeleteConfirmId(null);
    setDeletingId(null);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        No bookings match your filters.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="border-b border-zinc-700/80 bg-red-900/20 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700/80 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Guest</TableHead>
              <TableHead className="text-zinc-400">Room</TableHead>
              <TableHead className="text-zinc-400">Guests</TableHead>
              <TableHead className="text-zinc-400">Rate/night</TableHead>
              <TableHead className="text-zinc-400">Check-in</TableHead>
              <TableHead className="text-zinc-400">Check-out</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Contacted</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow
                key={b.id}
                className="border-zinc-700/80 text-zinc-200 hover:bg-zinc-800/50"
              >
                <TableCell>
                  <div className="font-medium text-zinc-100">{b.guest.name}</div>
                  <div className="text-xs text-zinc-500">{b.guest.email}</div>
                  {b.guest.phone && (
                    <div className="text-xs text-zinc-500">{b.guest.phone}</div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-zinc-200">{b.room.name}</span>
                  {b.reference && (
                    <div className="text-xs text-zinc-500">{b.reference}</div>
                  )}
                </TableCell>
                <TableCell className="text-zinc-300">{b.totalGuests}</TableCell>
                <TableCell className="text-zinc-300">{b.rate.toFixed(2)}</TableCell>
                <TableCell className="text-zinc-300">{formatDate(b.checkIn)}</TableCell>
                <TableCell className="text-zinc-300">{formatDate(b.checkOut)}</TableCell>
                <TableCell className="min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b.id, e.target.value as BookingStatus)
                      }
                      disabled={updatingId === b.id}
                      className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none disabled:opacity-70 disabled:cursor-wait min-w-[120px]"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === b.id && (
                      <span className="flex shrink-0 items-center gap-1.5 text-amber-400" aria-live="polite">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                        <span className="text-xs font-medium">Updating…</span>
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {b.contactedAt ? (
                    <span className="text-xs text-emerald-400">
                      {formatDate(b.contactedAt)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingId === b.id}
                      onClick={() => handleMarkContacted(b.id)}
                      className="rounded px-2 py-1 text-sm text-amber-400 hover:bg-amber-600/20 hover:text-amber-300 disabled:opacity-50"
                    >
                      Mark contacted
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/bookings/${b.id}/edit`}
                      className="rounded-lg border border-zinc-600 bg-zinc-700/50 px-2.5 py-1.5 text-sm text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(b.id)}
                      disabled={!!deletingId}
                      className="rounded-lg border border-red-900/60 bg-red-900/20 px-2.5 py-1.5 text-sm text-red-300 hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                    >
                      Delete
                    </button>
                    <Link
                      href={`/bookings?guestSearch=${encodeURIComponent(b.guest.email)}`}
                      className="text-sm text-zinc-500 hover:text-amber-400 hover:underline"
                    >
                      Filter
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-xl">
            <h2 id="delete-dialog-title" className="text-lg font-semibold text-zinc-100">
              Delete this booking?
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              The reservation will be removed. The guest will also be deleted if they have no other bookings.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={!!deletingId}
                className="flex-1 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={!!deletingId}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {deletingId === deleteConfirmId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
