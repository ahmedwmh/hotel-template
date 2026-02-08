import Link from "next/link";

const links = [
  { href: "/bookings", label: "Bookings", desc: "View and manage reservations" },
  { href: "/rooms", label: "Rooms", desc: "CRUD room types and rates" },
  { href: "/availability", label: "Availability", desc: "Check room availability by date" },
  { href: "/reports", label: "Reports", desc: "Booking counts by period" },
  { href: "/content", label: "Content", desc: "Edit site content and settings" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-[400px]">
      <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-zinc-400">Welcome to the admin panel.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-5 shadow-sm transition-colors hover:border-amber-600/40 hover:bg-zinc-800"
          >
            <span className="block font-medium text-zinc-100 group-hover:text-amber-400">{label}</span>
            <span className="mt-1 block text-sm text-zinc-500">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
