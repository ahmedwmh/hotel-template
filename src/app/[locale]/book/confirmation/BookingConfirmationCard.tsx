"use client";

import Link from "next/link";
import { useState } from "react";
import { HiOutlineClipboardDocument } from "react-icons/hi2";

type Props = {
  successMessage: string;
  reference: string | null;
  refLabel: string;
  saveRefLabel: string;
  copyLabel: string;
  copiedLabel: string;
  backHomeHref: string;
  backHomeLabel: string;
  viewRoomsHref: string;
  viewRoomsLabel: string;
  bookAgainHref: string;
  bookAgainLabel: string;
};

export function BookingConfirmationCard({
  successMessage,
  reference,
  refLabel,
  saveRefLabel,
  copyLabel,
  copiedLabel,
  backHomeHref,
  backHomeLabel,
  viewRoomsHref,
  viewRoomsLabel,
  bookAgainHref,
  bookAgainLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <p className="text-zinc-300 font-Lora text-center text-lg leading-relaxed mb-6">
          {successMessage}
        </p>

        {reference && (
          <div className="mb-8">
            <p className="text-sm font-medium text-zinc-400 mb-2">{refLabel}</p>
            <div className="flex items-center gap-2 rounded-xl bg-zinc-800/80 border border-zinc-700/80 px-4 py-3">
              <code className="flex-1 font-mono text-lg font-semibold text-[#C9A24D] tracking-wide">
                {reference}
              </code>
              <button
                type="button"
                onClick={copyReference}
                className="shrink-0 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-[#C9A24D] transition-colors"
                title={copied ? copiedLabel : copyLabel}
              >
                <HiOutlineClipboardDocument className="w-5 h-5" />
                <span>{copied ? copiedLabel : copyLabel}</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">{saveRefLabel}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={backHomeHref}
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A24D] px-6 py-3.5 font-Garamond font-semibold text-[#1e1e1e] hover:bg-[#B8923F] transition-colors"
          >
            {backHomeLabel}
          </Link>
          <Link
            href={viewRoomsHref}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-600 bg-transparent px-6 py-3.5 font-Garamond font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            {viewRoomsLabel}
          </Link>
          <Link
            href={bookAgainHref}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-600 bg-transparent px-6 py-3.5 font-Garamond font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            {bookAgainLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
