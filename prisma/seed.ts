import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** أسعار حسب عدد الضيوف: السعر الأساسي للفرد + 25 لكل ضيف إضافي (1–5) */
const RATE_INCREMENT_PER_GUEST = 25;
const MAX_GUEST_TIERS = 5;

/** قائمة الغرف المعتمدة — عند تشغيل السييد تُحدَّث الغرف المطابقة (حسب slug) وتُضاف الجديدة */
const ROOMS = [
  { name: "Presidential Suite", slug: "presidential-suite", capacity: 4, quantity: 2, baseRate: 599 },
  { name: "Executive King Suite", slug: "executive-king-suite", capacity: 3, quantity: 3, baseRate: 399 },
  { name: "Deluxe Family Suite", slug: "deluxe-family-suite", capacity: 5, quantity: 10, baseRate: 349 },
  { name: "Superior King Room", slug: "superior-king-room", capacity: 2, quantity: 15, baseRate: 249 },
  { name: "Junior Suite", slug: "junior-suite", capacity: 2, quantity: 5, baseRate: 299 },
  { name: "Deluxe Twin Room", slug: "deluxe-twin-room", capacity: 2, quantity: 12, baseRate: 199 },
  { name: "Grand Luxury Suite", slug: "grand-luxury-suite", capacity: 4, quantity: 4, baseRate: 499 },
  { name: "Premium Pool View Room", slug: "premium-pool-view-room", capacity: 2, quantity: 8, baseRate: 279 },
] as const;

function toDecimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@najafhotel.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
    },
  });

  console.log("Admin user created/updated");
  console.log("  Email:", adminEmail);
  console.log("  Login: /login");
}

async function seedRooms() {
  for (const r of ROOMS) {
    const room = await prisma.room.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        capacity: r.capacity,
        quantity: r.quantity,
        rate: toDecimal(r.baseRate),
        isActive: true,
        nameEn: r.name,
      },
      create: {
        name: r.name,
        slug: r.slug,
        capacity: r.capacity,
        quantity: r.quantity,
        rate: toDecimal(r.baseRate),
        isActive: true,
        nameEn: r.name,
      },
    });

    for (let guestCount = 1; guestCount <= MAX_GUEST_TIERS; guestCount++) {
      const rate = r.baseRate + (guestCount - 1) * RATE_INCREMENT_PER_GUEST;
      await prisma.roomRate.upsert({
        where: {
          roomId_guestCount: { roomId: room.id, guestCount },
        },
        update: { rate: toDecimal(rate) },
        create: { roomId: room.id, guestCount, rate: toDecimal(rate) },
      });
    }
  }

  console.log(`Rooms: ${ROOMS.length} types updated/created with rates for 1–${MAX_GUEST_TIERS} guests`);
}

async function seedSiteSettings() {
  const settingsWithLocale: { key: string; value: string; locale: string }[] = [
    { key: "hero_title", value: "Welcome to Najaf Hotel", locale: "en" },
    { key: "hero_title", value: "مرحباً بكم في فندق النجف", locale: "ar" },
    { key: "hero_subtitle", value: "Luxury and comfort in the heart of Najaf", locale: "en" },
    { key: "hero_subtitle", value: "رفاهية وراحة في قلب النجف", locale: "ar" },
    { key: "contact_address", value: "Najaf, Iraq", locale: "en" },
    { key: "contact_address", value: "النجف، العراق", locale: "ar" },
  ];

  const settingsLocaleNull: { key: string; value: string }[] = [
    { key: "contact_email", value: "info@najafhotel.com" },
    { key: "contact_phone", value: "+964 770 123 4567" },
  ];

  for (const { key, value, locale } of settingsWithLocale) {
    await prisma.siteSetting.upsert({
      where: { key_locale: { key, locale } },
      update: { value },
      create: { key, value, locale },
    });
  }

  for (const { key, value } of settingsLocaleNull) {
    const existing = await prisma.siteSetting.findFirst({
      where: { key, locale: null },
    });
    if (existing) {
      await prisma.siteSetting.update({ where: { id: existing.id }, data: { value } });
    } else {
      await prisma.siteSetting.create({ data: { key, value, locale: null } });
    }
  }

  console.log("Site settings: upserted", settingsWithLocale.length + settingsLocaleNull.length, "entries");
}

async function main() {
  await seedAdmin();
  await seedRooms();
  await seedSiteSettings();
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
