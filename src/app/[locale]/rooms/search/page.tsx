import Link from "next/link";
import { getActiveRooms } from "@/lib/actions/rooms";
import { checkRoomAvailability } from "@/lib/actions/availability";
import type { Locale } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default async function RoomsSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { locale } = await params;
  const { checkIn, checkOut, guests } = await searchParams;
  const rooms = await getActiveRooms();

  let results = rooms;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const guestCount = guests ? parseInt(guests, 10) : 0;
    const available: typeof rooms = [];
    for (const room of rooms) {
      const ok = await checkRoomAvailability(room.id, start, end);
      if (ok && (guestCount === 0 || room.capacity >= guestCount)) {
        available.push(room);
      }
    }
    results = available;
  } else if (guests) {
    const n = parseInt(guests, 10);
    if (!Number.isNaN(n)) results = rooms.filter((r) => r.capacity >= n);
  }

  return (
    <main className="min-h-screen">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-semibold">
          Najaf Hotel
        </Link>
        <nav className="flex gap-4">
          <Link href={`/${locale}`}>{locale === "ar" ? "الرئيسية" : "Home"}</Link>
          <Link href={`/${locale}/rooms`}>{locale === "ar" ? "الغرف" : "Rooms"}</Link>
          <Link href={`/${locale}/book`}>{locale === "ar" ? "احجز" : "Book"}</Link>
          <Link href={locale === "ar" ? "/en" : "/ar"}>
            {locale === "ar" ? "English" : "العربية"}
          </Link>
        </nav>
      </header>

      <section className="px-6 py-12">
        <h1 className="text-2xl font-semibold mb-6">
          {locale === "ar" ? "نتائج البحث" : "Search results"}
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((room) => (
            <Card key={room.id}>
              <CardHeader className="font-medium">
                <Link href={`/${locale}/rooms/${room.id}`} className="hover:text-[#C9A24D] transition-colors">
                  {room.name}
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  {locale === "ar" ? "السعة: " : "Capacity: "}
                  {room.capacity}
                </p>
                <p>
                  {locale === "ar" ? "السعر: " : "Rate: "}
                  {room.rate} / {locale === "ar" ? "ليلة" : "night"}
                </p>
                <div className="flex gap-2 mt-2">
                <Link href={`/${locale}/rooms/${room.id}`}>
                  <Button variant="outline" size="sm">
                    {locale === "ar" ? "التفاصيل" : "Details"}
                  </Button>
                </Link>
                <Link href={`/${locale}/book?room=${room.id}${checkIn ? `&checkIn=${checkIn}` : ""}${checkOut ? `&checkOut=${checkOut}` : ""}`}>
                  <Button variant="default" size="sm">
                    {locale === "ar" ? "احجز" : "Book"}
                  </Button>
                </Link>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {results.length === 0 && (
          <p className="text-gray-600">
            {locale === "ar"
              ? "لا توجد غرف تطابق البحث."
              : "No rooms match your search."}
          </p>
        )}
      </section>
    </main>
  );
}
