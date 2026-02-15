import { getActiveRooms } from "@/lib/actions/rooms";
import { getSiteSettingsBatch } from "@/lib/actions/site-content";
import { parseHeroSlides } from "@/lib/hero-slides";
import { parseFacilitiesItems } from "@/lib/facilities-items";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { PublicLayout } from "@/Components/public/PublicLayout";
import { HeroSectionNext } from "@/Components/public/HeroSectionNext";
import { RoomsSectionNext } from "@/Components/public/RoomsSectionNext";
import { HotelAndResortNext } from "@/Components/public/HotelAndResortNext";
import { HotelAndFacilitiesNext } from "@/Components/public/HotelAndFacilitiesNext";
import { ActionNext } from "@/Components/public/ActionNext";
import { FacilitiesNext } from "@/Components/public/FacilitiesNext";

function get(batch: Record<string, string | null>, key: string, locale: string | null): string | null {
  return batch[`${key}:${locale ?? ""}`] ?? null;
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const homeBatchKeys = [
    { key: "hero_slides", locale: null },
    { key: "contact_phone", locale: null },
    { key: "facilities_items", locale },
    { key: "facilities_title", locale },
    { key: "facilities_subtitle", locale },
    { key: "hotel_facilities_title", locale },
    { key: "hotel_facilities_subtitle", locale },
    { key: "hotel_resort_image", locale: null },
    { key: "hotel_resort_subtitle", locale },
    { key: "hotel_resort_title", locale },
    { key: "hotel_resort_description", locale },
    { key: "hotel_resort_rooms_count", locale: null },
    { key: "hotel_resort_rating", locale: null },
    { key: "hotel_resort_rooms_label", locale },
    { key: "hotel_resort_ratings_label", locale },
    { key: "hotel_resort_more_label", locale },
    { key: "action_title", locale },
    { key: "action_description", locale },
    { key: "action_quote", locale },
    { key: "action_video_url", locale: null },
    { key: "action_video_poster", locale: null },
  ];
  const [rooms, roomsCount, batch] = await Promise.all([
    getActiveRooms(),
    prisma.room.count({ where: { isActive: true } }),
    getSiteSettingsBatch(homeBatchKeys),
  ]);
  const heroSlides = get(batch, "hero_slides", null)
    ? parseHeroSlides(get(batch, "hero_slides", null)!)
    : undefined;
  const facilitiesItems = get(batch, "facilities_items", locale)
    ? parseFacilitiesItems(get(batch, "facilities_items", locale)!)
    : undefined;
  const facilitiesTitle: string | undefined =
    (get(batch, "hotel_facilities_subtitle", locale)?.trim() || get(batch, "facilities_title", locale)) ?? undefined;
  const facilitiesHeading: string | undefined =
    (get(batch, "hotel_facilities_title", locale)?.trim() || get(batch, "facilities_subtitle", locale)) ?? undefined;
  const contactPhone = get(batch, "contact_phone", null) ?? undefined;
  const hotelResortImage = get(batch, "hotel_resort_image", null)?.trim() ?? undefined;
  const hotelResortSubtitle = get(batch, "hotel_resort_subtitle", locale)?.trim() ?? undefined;
  const hotelResortTitle = get(batch, "hotel_resort_title", locale)?.trim() ?? undefined;
  const hotelResortDescription = get(batch, "hotel_resort_description", locale)?.trim() ?? undefined;
  const hotelResortRoomsCountRaw = get(batch, "hotel_resort_rooms_count", null)?.trim() ?? undefined;
  const hotelResortRoomsCountParsed = hotelResortRoomsCountRaw != null && hotelResortRoomsCountRaw !== "" ? parseInt(hotelResortRoomsCountRaw, 10) : undefined;
  const hotelResortRoomsCount = Number.isFinite(hotelResortRoomsCountParsed) ? hotelResortRoomsCountParsed : undefined;
  const hotelResortRating = get(batch, "hotel_resort_rating", null)?.trim() ?? undefined;
  const hotelResortRoomsLabel = get(batch, "hotel_resort_rooms_label", locale)?.trim() ?? undefined;
  const hotelResortRatingsLabel = get(batch, "hotel_resort_ratings_label", locale)?.trim() ?? undefined;
  const hotelResortMoreLabel = get(batch, "hotel_resort_more_label", locale)?.trim() ?? undefined;
  const actionTitle: string | undefined = get(batch, "action_title", locale) ?? undefined;
  const actionDescription: string | undefined = get(batch, "action_description", locale) ?? undefined;
  const actionQuote: string | undefined = get(batch, "action_quote", locale) ?? undefined;
  const actionVideoUrl: string | undefined = get(batch, "action_video_url", null) ?? undefined;
  const actionVideoPoster: string | undefined = get(batch, "action_video_poster", null) ?? undefined;

  return (
    <PublicLayout locale={locale}>
      <HeroSectionNext locale={locale} slides={heroSlides} contactPhone={contactPhone} />
      <RoomsSectionNext rooms={rooms} locale={locale} />
      <HotelAndResortNext
        locale={locale}
        roomsCount={roomsCount}
        imageUrl={hotelResortImage}
        subtitle={hotelResortSubtitle}
        title={hotelResortTitle}
        description={hotelResortDescription}
        roomsCountOverride={Number.isFinite(hotelResortRoomsCount) ? hotelResortRoomsCount : undefined}
        rating={hotelResortRating}
        luxuryRoomsLabel={hotelResortRoomsLabel}
        customerRatingsLabel={hotelResortRatingsLabel}
        moreAboutLabel={hotelResortMoreLabel}
      />
      <HotelAndFacilitiesNext locale={locale} />
      <ActionNext
        locale={locale}
        title={actionTitle != null ? actionTitle : undefined}
        description={actionDescription != null ? actionDescription : undefined}
        quote={actionQuote != null ? actionQuote : undefined}
        videoUrl={actionVideoUrl != null ? actionVideoUrl : undefined}
        videoPosterUrl={actionVideoPoster != null ? actionVideoPoster : undefined}
      />
      <FacilitiesNext
        locale={locale}
        facilityItems={facilitiesItems}
        facilitiesTitle={facilitiesTitle}
        facilitiesHeading={facilitiesHeading}
      />
    </PublicLayout>
  );
}
