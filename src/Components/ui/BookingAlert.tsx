"use client";

import { HiOutlineCalendarDays, HiOutlineExclamationTriangle } from "react-icons/hi2";

export type BookingAlertVariant = "unavailable" | "invalid_dates" | "error";

type BookingAlertProps = {
  variant: BookingAlertVariant;
  title: string;
  description?: string;
  className?: string;
};

/**
 * Clear, simple alert for booking forms: unavailable dates, invalid date range, or generic error.
 */
export function BookingAlert({ variant, title, description, className = "" }: BookingAlertProps) {
  const isUnavailable = variant === "unavailable";
  const isInvalidDates = variant === "invalid_dates";

  const wrapperClass = isUnavailable
    ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
    : isInvalidDates
      ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
      : "border-red-400/50 bg-red-900/20 text-red-200";

  const iconClass = isUnavailable || isInvalidDates ? "text-amber-400" : "text-red-400";

  const Icon = isUnavailable || isInvalidDates ? HiOutlineCalendarDays : HiOutlineExclamationTriangle;

  return (
    <div
      role="alert"
      className={`flex gap-4 rounded-xl border p-4 ${wrapperClass} ${className}`}
    >
      <span className={`flex shrink-0 ${iconClass}`} aria-hidden>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
    </div>
  );
}
