import { Suspense } from "react";
import Link from "next/link";
import { listBookings } from "@/lib/actions/admin-bookings";
import { BookingsTable } from "@/Components/admin/BookingsTable";
import { BookingsFilters } from "@/Components/admin/BookingsFilters";

type SearchParams = { status?: string; dateFrom?: string; dateTo?: string; guestSearch?: string };

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT" | undefined;
  const result = await listBookings({
    status: status && ["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT"].includes(params.status ?? "")
      ? status
      : undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
    guestSearch: params.guestSearch || undefined,
  });

  const bookings = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-zinc-400">View, add, edit, and manage reservations.</p>
        </div>
        <Link
          href="/bookings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-500 transition-colors"
        >
          <span className="inline-block size-5 rounded-full border-2 border-current" aria-hidden>+</span>
          Add booking
        </Link>
      </div>

      <Suspense fallback={<div className="h-24 rounded-xl border border-zinc-700/80 bg-zinc-800/60 animate-pulse" />}>
        <BookingsFilters
          defaultStatus={params.status ?? ""}
          defaultDateFrom={params.dateFrom ?? ""}
          defaultDateTo={params.dateTo ?? ""}
          defaultGuestSearch={params.guestSearch ?? ""}
        />
      </Suspense>

      <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 shadow-sm overflow-hidden">
        {result.success ? (
          <BookingsTable bookings={bookings} />
        ) : (
          <div className="p-6 text-zinc-400">{result.error}</div>
        )}
      </div>
    </div>
  );
}
