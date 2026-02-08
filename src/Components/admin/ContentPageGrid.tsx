"use client";

import Link from "next/link";
import type { ContentPage } from "@/lib/content-structure";

const pageIcons: Record<string, string> = {
  home: "🏠",
  about: "ℹ️",
  contact: "📧",
};

export function ContentPageGrid({ pages }: { pages: ContentPage[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <Link
          key={page.id}
          href={`/content/${page.id}`}
          className="group flex flex-col rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6 shadow-sm transition-all hover:border-amber-600/40 hover:bg-zinc-800 hover:shadow-md"
        >
          <span className="text-3xl" role="img" aria-hidden>
            {pageIcons[page.id] ?? "📄"}
          </span>
          <h2 className="mt-3 text-lg font-semibold text-zinc-100 group-hover:text-amber-400">
            {page.label}
          </h2>
          {page.description && (
            <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{page.description}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
            Edit sections
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
