"use client";

/**
 * Shared loading fallback for route segments.
 * Hotel-style: gold (#C9A24D), black background, Garamond, decorative lines.
 * Use fullScreen=false when inside a layout that already has Navbar/Footer.
 */
type PublicLoadingProps = {
  /** When true (default), wrapper uses min-h-screen. When false, only the spinner block. */
  fullScreen?: boolean;
};

export function PublicLoading({ fullScreen = true }: PublicLoadingProps) {
  const content = (
    <div className="flex flex-col items-center gap-8" aria-busy="true" aria-live="polite">
      {/* Decorative lines + spinning ring (hotel identity) */}
      <div className="flex items-center justify-center gap-2">
        <hr className="w-16 sm:w-24 h-px shrink-0 border-0 bg-[#C9A24D]/70" />
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-[#C9A24D]/30" aria-hidden />
          <span
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#C9A24D]"
            style={{ animationDuration: "0.9s" }}
            aria-hidden
          />
          <span className="font-Garamond text-xl font-semibold text-[#C9A24D]">N</span>
        </div>
        <hr className="w-16 sm:w-24 h-px shrink-0 border-0 bg-[#C9A24D]/70" />
      </div>
      <p className="font-Garamond text-lg font-medium tracking-wide text-[#C9A24D]/90">
        Loading…
      </p>
    </div>
  );

  if (!fullScreen) {
    return <div className="flex flex-col items-center justify-center px-4 py-16">{content}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#000] px-4 py-16">
      {content}
    </div>
  );
}
