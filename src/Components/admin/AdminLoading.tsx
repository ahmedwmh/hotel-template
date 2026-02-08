/**
 * Loading fallback for admin pages. Shown while a page segment is loading.
 * Admin-only; matches dark theme (zinc/amber).
 */
export function AdminLoading() {
  return (
    <div className="flex min-h-[320px] flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-700/80" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-zinc-700/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border border-zinc-700/80 bg-zinc-800/80"
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 py-8">
        <span
          className="inline-block h-2 w-2 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-amber-500"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="inline-block h-2 w-2 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-amber-500"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="inline-block h-2 w-2 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-amber-500"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
