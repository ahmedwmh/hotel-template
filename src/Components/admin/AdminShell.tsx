"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bookings", label: "Bookings" },
  { href: "/rooms", label: "Rooms" },
  { href: "/availability", label: "Availability" },
  { href: "/reports", label: "Reports" },
  { href: "/content", label: "Content" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="admin-dark flex min-h-screen bg-zinc-900">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-zinc-700/80 bg-zinc-800/95 shadow-xl
          transition-transform duration-200 ease-out lg:relative lg:translate-x-0 lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b border-zinc-700/80 px-4 lg:justify-center">
          <span className="text-lg font-semibold text-zinc-100">Admin</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-2 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 lg:hidden"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {nav.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-amber-600/20 text-amber-400"
                    : "text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-100"}
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-700/80 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-700/50 px-3 py-2.5 text-left text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-zinc-700/80 bg-zinc-800/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded p-2 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
