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

const FACILITIES_ITEMS_JSON = JSON.stringify([
  { image: "/images/home-1/facilities-1.png", number: "01", categoryEn: "Services", categoryAr: "خدمات", titleEn: "24-Hour Reception", titleAr: "استقبال 24 ساعة", description: "Round-the-clock reception for your convenience." },
  { image: "/images/home-1/facilities-thumb-2.jpg", number: "02", categoryEn: "Services", categoryAr: "خدمات", titleEn: "Room Service", titleAr: "خدمة الغرف", description: "In-room dining and service at your request." },
  { image: "/images/home-1/facilities-thumb-3.jpg", number: "03", categoryEn: "Dining", categoryAr: "مطعم", titleEn: "Hotel Restaurant", titleAr: "مطعم الفندق", description: "Full-service hotel restaurant for breakfast, lunch and dinner." },
  { image: "/images/home-1/facilities-thumb-4.jpg", number: "04", categoryEn: "Dining", categoryAr: "مقهى", titleEn: "Elegant Coffee Shop", titleAr: "كوفي شوب أنيق", description: "A refined coffee shop for drinks and light bites." },
  { image: "/images/home-1/facilities-1.png", number: "05", categoryEn: "Lounge", categoryAr: "لاونج", titleEn: "Luxury Shisha Lounge", titleAr: "شيشه لاونج فاخر", description: "A luxury shisha lounge for relaxation." },
  { image: "/images/home-1/facilities-thumb-2.jpg", number: "06", categoryEn: "Amenities", categoryAr: "مرافق", titleEn: "Free Wi-Fi", titleAr: "واي فاي مجاني", description: "Complimentary high-speed Wi-Fi throughout the hotel." },
  { image: "/images/home-1/facilities-thumb-3.jpg", number: "07", categoryEn: "Amenities", categoryAr: "مرافق", titleEn: "Modern Elevators", titleAr: "مصاعد حديثة", description: "Modern elevators for easy access to all floors." },
]);

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
    { key: "contact_title", value: "Contact With Us", locale: "en" },
    { key: "contact_title", value: "تواصل معنا", locale: "ar" },
    { key: "contact_subtitle", value: "Contact Us", locale: "en" },
    { key: "contact_subtitle", value: "اتصل بنا", locale: "ar" },
    { key: "contact_description", value: "Get in touch for reservations, inquiries or feedback. We are here to help.", locale: "en" },
    { key: "contact_description", value: "تواصل معنا للحجوزات أو الاستفسارات. نحن هنا لمساعدتك.", locale: "ar" },
    { key: "contact_form_heading", value: "Get in Touch", locale: "en" },
    { key: "contact_form_heading", value: "تواصل معنا", locale: "ar" },
    { key: "contact_email", value: "info@najafhotel.com", locale: "en" },
    { key: "contact_email", value: "info@najafhotel.com", locale: "ar" },
    { key: "contact_phone", value: "+964 770 123 4567", locale: "en" },
    { key: "contact_phone", value: "+964 770 123 4567", locale: "ar" },
    { key: "about_title", value: "Luxury Best Hotel in Najaf", locale: "en" },
    { key: "about_title", value: "أفضل فندق فاخر في النجف", locale: "ar" },
    { key: "about_subtitle", value: "Luxury Hotel and Resort", locale: "en" },
    { key: "about_subtitle", value: "فندق ومنتجع فاخر", locale: "ar" },
    { key: "about_text", value: "Rapidiously myocardinate cross-platform intellectual capital after marketing model. Appropriately create interactive infrastructures after maintainable. Holisticly facilitate stand-alone inframe. Compellingly create premier experiences for our guests in the heart of Najaf.", locale: "en" },
    { key: "about_text", value: "نسعى لتقديم تجربة إقامة فاخرة وخدمة متميزة في قلب النجف. مرافق متكاملة وطاقم متخصص لراحتك. نلتزم بمعايير عالمية في الضيافة لضمان إقامة لا تُنسى لضيوفنا.", locale: "ar" },
    { key: "action_title", value: "LUXURY BEST HOTEL IN NAJAF", locale: "en" },
    { key: "action_title", value: "أفضل فندق فاخر في النجف", locale: "ar" },
    { key: "action_description", value: "At Najaf International Hotel, we believe that true hospitality is not measured by service alone, but by respect, genuine care, and the sense of peace throughout the stay.", locale: "en" },
    { key: "action_description", value: "في فندق النجف الدولي نؤمن بأن الضيافة الحقيقية لا تُقاس بالخدمة فقط بل بالاحترام والاهتمام والشعور بالطمأنينة طوال الإقامة.", locale: "ar" },
    { key: "action_quote", value: "At Najaf International Hotel, we believe that true hospitality is not measured by service alone, but by respect, genuine care, and the sense of peace throughout the stay.", locale: "en" },
    { key: "action_quote", value: "في فندق النجف الدولي نؤمن بأن الضيافة الحقيقية لا تُقاس بالخدمة فقط بل بالاحترام والاهتمام والشعور بالطمأنينة طوال الإقامة.", locale: "ar" },
    { key: "facilities_title", value: "ENJOY COMPLETE & BEST QUALITY FACILITIES", locale: "en" },
    { key: "facilities_title", value: "ENJOY COMPLETE & BEST QUALITY FACILITIES", locale: "ar" },
    { key: "facilities_subtitle", value: "24-Hour Reception – Room Service – Hotel Restaurant – Elegant Coffee Shop – Luxury Shisha Lounge – Free Wi-Fi – Modern Elevators", locale: "en" },
    { key: "facilities_subtitle", value: "استقبال 24 ساعة – خدمة الغرف – مطعم الفندق – كوفي شوب أنيق – شيشه لاونج فاخر – واي فاي مجاني – مصاعد حديثة", locale: "ar" },
    { key: "facilities_items", value: FACILITIES_ITEMS_JSON, locale: "en" },
    { key: "facilities_items", value: FACILITIES_ITEMS_JSON, locale: "ar" },
  ];

  const RESTAURANTS_LIST_JSON = JSON.stringify([
    {
      imageUrl: "https://placehold.co/800x600/1a1a1a/C9A24D?text=Zuwar+Restaurant",
      titleEn: "Zuwar Restaurant",
      titleAr: "مطعم زوّار",
      subtitleEn: "A destination of elegance… and an unmatched culinary journey.",
      subtitleAr: "عنوان الفخامة… وتجربة مذاق لا تُضاهى.",
      descriptionEn: "At Zuwar Restaurant, the finest standards of luxury hospitality come to life. We invite our guests on an exceptional voyage through carefully curated Eastern and international flavors — masterfully prepared and artistically presented.\n\nRefined interiors, a warm ambiance, and service devoted to perfection transform every moment into an indulgent experience worthy of our distinguished guests.\n\nAt Zuwar… we don't simply serve cuisine — we craft memories in luxury.",
      descriptionAr: "في مطعم زوّار تتجلّى أرقى معايير الضيافة الرفيعة، حيث نأخذ ضيوفنا في رحلةٍ استثنائية عبر نكهاتٍ مختارة من المطبخين الشرقي والعالمي، أُعدّت بإتقانٍ عالٍ ولمسةٍ فنيةٍ راقية.\n\nتصميم أنيق، أجواء دافئة، وخدمة تُجسّد معنى الاهتمام بالتفاصيل… لتتحوّل كل لحظة إلى تجربةٍ مترفة تليق بضيوفنا الكرام.\n\nفي زوّار… لا نقدّم طعاماً فحسب، بل نصنع ذكرياتٍ تُحاكى بالفخامة.",
    },
    {
      imageUrl: "https://placehold.co/800x600/1a1a1a/C9A24D?text=Beit+Al+Qahwa",
      titleEn: "Beit Al Qahwa Café",
      titleAr: "كافيه بيت القهوة",
      subtitleEn: "A sanctuary for connoisseurs… and a taste of serenity.",
      subtitleAr: "ملاذ الذوّاقة… وعنوان الصفاء.",
      descriptionEn: "At Beit Al Qahwa, we redefine the pleasure of quiet moments, where the aroma of premium coffee blends with an atmosphere of refined elegance. We offer a curated selection of the finest Arabic and international coffees, alongside hot and cold beverages and exquisite desserts — all crafted to satisfy the most discerning tastes.\n\nContemporary design with classic touches, paired with gracious service, transforms every visit into a luxurious escape.\n\nAt Beit Al Qahwa… every cup tells a story, and every gathering has a memorable flavor.",
      descriptionAr: "في بيت القهوة نُعيد اكتشاف متعة اللحظات الهادئة، حيث تمتزج رائحة القهوة الفاخرة بأجواءٍ دافئة تنبض بالأناقة. نقدّم تشكيلة مختارة من أفخر أنواع القهوة العربية والعالمية، إلى جانب المشروبات الساخنة والباردة والحلويات الراقية، المُحضّرة بعناية لتُرضي مختلف الأذواق.\n\nتصميم عصري بلمساتٍ كلاسيكية، وخدمة راقية تجعل من كل زيارة تجربة استرخاءٍ مترفة.\n\nفي بيت القهوة… لكل فنجان حكاية، ولكل لقاء نكهة لا تُنسى.",
    },
    {
      imageUrl: "https://placehold.co/800x600/1a1a1a/C9A24D?text=Jalsa+Shisha+Lounge",
      titleEn: "Jalsa Shisha Lounge",
      titleAr: "جلسة شيشة لاونج",
      subtitleEn: "An atmosphere of luxury… with a view to remember.",
      subtitleAr: "رفاهية الأجواء… وسحر الإطلالة.",
      descriptionEn: "At Jalsa Shisha Lounge, relaxation is elevated to a new level, where refined ambiance meets the stunning panoramic view of Bahr Al-Najaf. A serene setting, elegant seating, and exclusive privacy create the perfect escape.\n\nWe offer a premium selection of shisha flavors, complemented by a variety of hot and cold beverages — all served in a sophisticated environment designed for unforgettable moments.\n\nAt Jalsa Shisha Lounge… every puff is pleasure, and every moment overlooks luxury.",
      descriptionAr: "في \"جلسة شيشة لاونج\" نرتقي بتجربة الاسترخاء إلى مستوى آخر، حيث تلتقي فخامة المكان مع روعة الإطلالة المباشرة على بحر النجف، في أجواءٍ هادئة تنبض بالأناقة والخصوصية.\n\nنقدّم نخبة مختارة من أفخر نكهات الشيشة، إلى جانب تشكيلة مميزة من المشروبات الساخنة والباردة، ضمن جلساتٍ مريحة وتصميمٍ راقٍ يمنح ضيوفنا لحظاتٍ استثنائية لا تُنسى.\n\nفي جلسة شيشة لاونج… لكل نفسٍ متعة، ولكل لحظةٍ إطلالة تُحاكي الفخامة.",
    },
  ]);

  const settingsLocaleNull: { key: string; value: string }[] = [
    { key: "contact_map_embed", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.0!2d44.33!3d32.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzQ4LjAiTiA0NMKwMTknNDguMCJF!5e0!3m2!1sen!2s!4v1" },
    { key: "restaurants_list", value: RESTAURANTS_LIST_JSON },
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
  console.log("  Restaurants list: seeded (restaurants_list)");
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
