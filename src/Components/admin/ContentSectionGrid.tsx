"use client";

import Link from "next/link";
import type { ContentPage, ContentSection } from "@/lib/content-structure";

const sectionIcons: Record<string, string> = {
  carousel: "🖼️",
  rooms: "🛏️",
  "hotel-resort": "🏨",
  "hotel-facilities": "🏋️",
  action: "▶️",
  facilities: "✨",
  offers: "🏷️",
  testimonials: "💬",
  "latest-blog": "📝",
  "about-main": "📄",
  "contact-info": "📧",
};

export function ContentSectionGrid({
  page,
  sections,
}: {
  page: ContentPage;
  sections: ContentSection[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`/content/${page.id}/${section.id}`}
          className="group flex flex-col rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-5 shadow-sm transition-all hover:border-amber-600/40 hover:bg-zinc-800 hover:shadow-md"
        >
          <span className="text-2xl" role="img" aria-hidden>
            {sectionIcons[section.id] ?? "📄"}
          </span>
          <h2 className="mt-2 text-base font-semibold text-zinc-100 group-hover:text-amber-400">
            {section.label}
          </h2>
          {section.description && (
            <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{section.description}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
            Edit
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
