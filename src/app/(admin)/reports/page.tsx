import { getBookingCounts } from "@/lib/actions/admin-reports";

export default async function ReportsPage() {
  const counts = await getBookingCounts();
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-zinc-400">Booking counts by period (excluding cancelled).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-400">This month</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{counts.month}</p>
          <p className="mt-1 text-xs text-zinc-500">{currentMonth} {currentYear}</p>
        </div>
        <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-400">Last 3 months</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{counts.threeMonths}</p>
          <p className="mt-1 text-xs text-zinc-500">Rolling 3 months</p>
        </div>
        <div className="rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-400">This year</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{counts.year}</p>
          <p className="mt-1 text-xs text-zinc-500">{currentYear}</p>
        </div>
      </div>
    </div>
  );
}
