"use client";

/**
 * Shared loading fallback for route segments.
 * Elegant, hotel-style loader: gold accent, Garamond, decorative lines.
 */
export function PublicLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#f8f6f3] dark:bg-zinc-900 px-4 py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Decorative lines + spinning ring (matches hotel identity) */}
        <div className="flex items-center justify-center gap-2">
          <hr className="w-16 sm:w-24 h-px border-0 bg-[#C9A24D]/60 dark:bg-amber-500/60" />
          <div className="relative flex h-14 w-14 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full border-2 border-[#C9A24D]/20 dark:border-amber-500/20"
              aria-hidden
            />
            <span
              className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#C9A24D] dark:border-t-amber-400"
              style={{ animationDuration: "0.9s" }}
              aria-hidden
            />
            <span className="font-Garamond text-xl font-semibold text-[#C9A24D] dark:text-amber-400">
              N
            </span>
          </div>
          <hr className="w-16 sm:w-24 h-px border-0 bg-[#C9A24D]/60 dark:bg-amber-500/60" />
        </div>

        {/* Loading label */}
        <p className="font-Garamond text-lg font-medium tracking-wide text-[#616161] dark:text-zinc-400">
          Loading…
        </p>

        {/* Subtle progress bar */}
        
      </div>
    </div>
  );
}
