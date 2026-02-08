"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "CHECKED_IN", label: "Checked in" },
  { value: "CHECKED_OUT", label: "Checked out" },
];

export function BookingsFilters({
  defaultStatus,
  defaultDateFrom,
  defaultDateTo,
  defaultGuestSearch,
}: {
  defaultStatus: string;
  defaultDateFrom: string;
  defaultDateTo: string;
  defaultGuestSearch: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(defaultStatus);
  const [dateFrom, setDateFrom] = useState(defaultDateFrom);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [guestSearch, setGuestSearch] = useState(defaultGuestSearch);

  const apply = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (guestSearch.trim()) params.set("guestSearch", guestSearch.trim());
    router.push(`/bookings?${params.toString()}`);
  }, [router, status, dateFrom, dateTo, guestSearch]);

  const clear = useCallback(() => {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setGuestSearch("");
    router.push("/bookings");
  }, [router]);

  const inputClass =
    "h-9 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-700/80 bg-zinc-800/60 p-4">
      <div className="min-w-[140px]">
        <label className="mb-1 block text-xs font-medium text-zinc-400">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">From date</label>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">To date</label>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="min-w-[180px] flex-1">
        <label className="mb-1 block text-xs font-medium text-zinc-400">Guest (name/email)</label>
        <Input
          type="search"
          placeholder="Search..."
          value={guestSearch}
          onChange={(e) => setGuestSearch(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={apply}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
        >
          Apply
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={clear}
          className="rounded-lg border-zinc-600 bg-zinc-700/50 text-zinc-200 hover:bg-zinc-700"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
