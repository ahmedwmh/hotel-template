"use server";

import { prisma } from "@/lib/prisma";

export type ReportPeriod = "month" | "3months" | "year";

export type BookingCounts = {
  month: number;
  threeMonths: number;
  year: number;
};

export async function getBookingCounts(): Promise<BookingCounts> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfThreeMonthsAgo = new Date(now);
  startOfThreeMonthsAgo.setMonth(startOfThreeMonthsAgo.getMonth() - 3);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [month, threeMonths, year] = await Promise.all([
    prisma.booking.count({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.booking.count({
      where: {
        createdAt: { gte: startOfThreeMonthsAgo },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.booking.count({
      where: {
        createdAt: { gte: startOfYear },
        status: { not: "CANCELLED" },
      },
    }),
  ]);

  return { month, threeMonths, year };
}
