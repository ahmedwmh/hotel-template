/** Rate per guest count: 1 -> "99.00", 2 -> "129.00", ... */
export type RatesByGuests = Record<number, string>;

export type PublicRoom = {
  id: string;
  name: string;
  slug: string;
  capacity: number;
  rates: RatesByGuests;
  rate: string;
  nameEn?: string | null;
  nameAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
};

/**
 * Get rate string for a room and guest count. Safe to use on client.
 */
const MAX_GUESTS = 5;

export function rateForGuests(room: PublicRoom, guestCount: number): string {
  const n = Math.max(1, Math.min(MAX_GUESTS, Math.floor(guestCount)));
  const raw = room.rates[n] ?? room.rate;
  const num = parseFloat(String(raw));
  return Number.isFinite(num) ? num.toFixed(2) : "0";
}
