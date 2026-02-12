import { getSiteSetting } from "@/lib/actions/site-content";
import { parseRestaurantsList } from "@/lib/restaurants-items";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { hotelImages } from "@/lib/hotel-images";
import Image from "next/image";

export default async function RestaurantsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const res = await getSiteSetting("restaurants_list", null);
  const venues = parseRestaurantsList(res.success ? res.value : null);

  const pageTitle = isAr ? "مطاعم وأماكن الاستمتاع" : "Restaurants & Venues";
  const pageSubtitle = isAr
    ? "تجارب طعام ومشروبات فاخرة في قلب النجف"
    : "Dining and relaxation in the heart of Najaf";

  return (
    <main className="min-h-screen" dir={locale}>
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
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* Venues */}
      <section className="py-16 2xl:py-24 bg-[#000]">
        <div
          className="Container px-4 md:px-6 lg:px-8"
          style={{ maxWidth: "1330px", marginLeft: "auto", marginRight: "auto" }}
        >
          {venues.length > 0 ? (
            <div className="space-y-20">
              {venues.map((venue, index) => {
                const title = isAr ? venue.titleAr : venue.titleEn;
                const subtitle = isAr ? venue.subtitleAr : venue.subtitleEn;
                const description = isAr ? venue.descriptionAr : venue.descriptionEn;
                const paragraphs = description
                  ? description.split("\n").filter(Boolean)
                  : [];
                const imageUrl = venue.imageUrl || "https://placehold.co/800x600/1a1a1a/C9A24D?text=Venue";

                return (
                  <article
                    key={index}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start ${
                      index % 2 === 1 && !isAr ? "lg:grid-flow-dense" : ""
                    }`}
                  >
                    <div
                      className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-zinc-800 ${
                        index % 2 === 1 && !isAr ? "lg:col-start-2" : ""
                      } ${index % 2 === 1 && isAr ? "lg:col-start-1" : ""}`}
                    >
                      <Image
                        src={imageUrl}
                        alt={title || "Venue"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized={imageUrl.startsWith("https://placehold.co")}
                      />
                    </div>
                    <div
                      className={`space-y-4 font-Garamond ${index % 2 === 1 && !isAr ? "lg:col-start-1 lg:row-start-1" : ""} ${index % 2 === 1 && isAr ? "lg:col-start-2" : ""} ${isAr ? "text-right" : ""}`}
                    >
                      <p className="text-base text-[#C9A24D] leading-[26px] font-medium">
                        {subtitle}
                      </p>
                      <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-[38px] leading-tight text-white font-semibold">
                        {title}
                      </h2>
                      <div className="font-Lora text-sm sm:text-base text-zinc-400 font-normal leading-[26px] space-y-3">
                        {paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 font-Lora text-lg">
                {isAr ? "قريباً… مطاعم وأماكن الاستمتاع." : "Coming soon… Restaurants & venues."}
              </p>
            </div>
          )}
        </div>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
