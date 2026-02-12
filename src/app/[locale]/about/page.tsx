import { getSiteSetting } from "@/lib/actions/site-content";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { hotelImages } from "@/lib/hotel-images";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_TITLE_EN = "About Us";
const DEFAULT_TITLE_AR = "من نحن";
const DEFAULT_SUBTITLE_EN = "Luxury Hotel and Resort";
const DEFAULT_SUBTITLE_AR = "فندق ومنتجع فاخر";
const DEFAULT_TEXT_EN =
  "Rapidiously myocardinate cross-platform intellectual capital after marketing model. Appropriately create interactive infrastructures. Holisticly facilitate stand-alone experiences for our guests in the heart of Najaf.";
const DEFAULT_TEXT_AR =
  "نسعى لتقديم تجربة إقامة فاخرة وخدمة متميزة في قلب النجف. مرافق متكاملة وطاقم متخصص لراحتك.";
const DEFAULT_ABOUT_IMAGE = "/images/inner/about-thumb.jpg";

const LOCATION_TITLE = { en: "Hotel Location", ar: "موقع الفندق" };
const LOCATION_INTRO_EN =
  "Our hotel enjoys a prime location in the heart of Holy Najaf, within close proximity to the most significant religious landmarks and commercial centers, offering guests a stay that blends spirituality with convenience.";
const LOCATION_INTRO_AR =
  "يتميّز فندقنا بموقعٍ استراتيجي في قلب مدينة النجف الأشرف، على بُعد خطوات قليلة من أهم المعالم الدينية والتجارية، مما يمنح ضيوفنا تجربة إقامة مريحة تجمع بين الروحانية وسهولة التنقّل.";

const RELIGIOUS_HEADING = { en: "Nearby Religious Landmarks", ar: "الأماكن الدينية القريبة" };
const RELIGIOUS_PLACES = [
  { en: "Imam Ali Shrine – 200 meters", ar: "مرقد الإمام علي عليه السلام – 200 متر" },
  { en: "Kufa Mosque – 9 km", ar: "مسجد الكوفة – 9 كم" },
  { en: "Al-Sahla Mosque – 11 km", ar: "مسجد السهلة – 11 كم" },
  { en: "Kumayl ibn Ziyad Mosque – 3 km", ar: "مسجد كميل بن زياد – 3 كم" },
];

const SHOPPING_HEADING = { en: "Nearby Shopping Areas", ar: "المناطق التجارية القريبة" };
const SHOPPING_PLACES = [
  { en: "Al Furat Mall – 5 km", ar: "مول الفرات – 5 كم" },
  { en: "Najaf City Mall – 3 km", ar: "نجف سيتي مول – 3 كم" },
];

const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.0!2d44.33!3d32.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAxJzQ4LjAiTiA0NMKwMTknNDguMCJF!5e0!3m2!1sen!2s!4v1";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [titleRes, subtitleRes, textRes, imageRes, mapRes] = await Promise.all([
    getSiteSetting("about_title", locale),
    getSiteSetting("about_subtitle", locale),
    getSiteSetting("about_text", locale),
    getSiteSetting("about_image", null),
    getSiteSetting("contact_map_embed", null),
  ]);

  const title =
    (titleRes.success ? titleRes.value : null)?.trim() ||
    (isAr ? DEFAULT_TITLE_AR : DEFAULT_TITLE_EN);
  const subtitle =
    (subtitleRes.success ? subtitleRes.value : null)?.trim() ||
    (isAr ? DEFAULT_SUBTITLE_AR : DEFAULT_SUBTITLE_EN);
  const text =
    (textRes.success ? textRes.value : null)?.trim() ||
    (isAr ? DEFAULT_TEXT_AR : DEFAULT_TEXT_EN);
  const aboutImage =
    (imageRes.success ? imageRes.value : null)?.trim() || DEFAULT_ABOUT_IMAGE;
  const mapEmbed = (mapRes.success ? mapRes.value : null)?.trim() || DEFAULT_MAP_EMBED;

  const locationTitle = isAr ? LOCATION_TITLE.ar : LOCATION_TITLE.en;
  const locationIntro = isAr ? LOCATION_INTRO_AR : LOCATION_INTRO_EN;
  const religiousHeading = isAr ? RELIGIOUS_HEADING.ar : RELIGIOUS_HEADING.en;
  const shoppingHeading = isAr ? SHOPPING_HEADING.ar : SHOPPING_HEADING.en;

  const moreLabel = isAr ? "المزيد" : "More About";
  const pageTitle = isAr ? "من نحن" : "About Us";

  return (
    <main className="min-h-screen">
      <PublicNavbar locale={locale} />

      {/* Breadcrumb / Header */}
      <section
        className="bg-no-repeat bg-cover min-h-[280px] lg:min-h-[320px] bg-center grid items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,0.5), rgba(30,30,30,0.5)), url(${hotelImages.breadcrumb})`,
          backgroundSize: "cover",
        }}
      >
        <div className="text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <hr className="w-[100px] h-[1px] bg-[#C9A24D]" />
            <Image
              src="/images/logo/logo-s.svg"
              alt=""
              width={50}
              height={50}
            />
            <hr className="w-[100px] h-[1px] bg-[#C9A24D]" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-tight text-white font-semibold font-Garamond uppercase">
            {pageTitle}
          </h1>
          <p className="mt-3 text-base lg:text-lg text-[#acacac] font-Lora max-w-xl mx-auto">
            {title}
          </p>
        </div>
      </section>

      {/* About content */}
      <section className="py-16 2xl:py-24 bg-[#000]">
        <div
          className="Container px-4 md:px-6 lg:px-8"
          style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Image */}
            <div
              className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden ${isAr ? "lg:order-2" : ""}`}
            >
              <Image
                src={aboutImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div
              className={`space-y-4 font-Garamond ${isAr ? "lg:order-1 text-right" : ""}`}
            >
              <p className="text-base text-[#C9A24D] leading-[26px] font-medium">
                {subtitle}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-[38px] leading-tight text-white font-semibold">
                {title}
              </h2>
              <div className="font-Lora text-sm sm:text-base text-zinc-400 font-normal leading-[26px] whitespace-pre-line">
                {text}
              </div>
              <div className="pt-4">
                <Link
                  href={`/${locale}/rooms`}
                  className="inline-block bg-[#C9A24D] text-white px-8 py-3 font-medium hover:bg-[#272727] transition-colors"
                >
                  {moreLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location section */}
      <section className="py-16 2xl:py-24 bg-[#000]" dir={locale}>
        <div
          className="Container px-4 md:px-6 lg:px-8"
          style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className={`space-y-6 font-Garamond ${isAr ? "lg:order-2 text-right" : ""}`}>
              <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-[38px] leading-tight text-white font-semibold">
                {locationTitle}
              </h2>
              <p className="font-Lora text-sm sm:text-base text-zinc-400 font-normal leading-[26px]">
                {locationIntro}
              </p>
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg text-[#C9A24D] font-semibold">
                  {religiousHeading}
                </h3>
                <ul className="font-Lora text-sm sm:text-base text-zinc-400 space-y-2 list-none pl-0">
                  {RELIGIOUS_PLACES.map((place, i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="text-[#C9A24D] shrink-0" aria-hidden>•</span>
                      <span>{isAr ? place.ar : place.en}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="text-base sm:text-lg text-[#C9A24D] font-semibold pt-2">
                  {shoppingHeading}
                </h3>
                <ul className="font-Lora text-sm sm:text-base text-zinc-400 space-y-2 list-none pl-0">
                  {SHOPPING_PLACES.map((place, i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="text-[#C9A24D] shrink-0" aria-hidden>•</span>
                      <span>{isAr ? place.ar : place.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={`w-full aspect-video min-h-[280px] rounded-lg overflow-hidden bg-zinc-800 ${isAr ? "lg:order-1" : ""}`}>
              <iframe
                title={locationTitle}
                src={mapEmbed}
                className="w-full h-full min-h-[280px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
