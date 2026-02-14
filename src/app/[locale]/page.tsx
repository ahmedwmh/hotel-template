import { getActiveRooms } from "@/lib/actions/rooms";
import { getSiteSetting } from "@/lib/actions/site-content";
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

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [
    rooms,
    roomsCount,
    heroSlidesRes,
    contactPhoneRes,
    facilitiesItemsRes,
    facilitiesTitleRes,
    facilitiesSubtitleRes,
    hotelFacilitiesTitleRes,
    hotelFacilitiesSubtitleRes,
    hotelResortImageRes,
    hotelResortSubtitleRes,
    hotelResortTitleRes,
    hotelResortDescriptionRes,
    hotelResortRoomsCountRes,
    hotelResortRatingRes,
    hotelResortRoomsLabelRes,
    hotelResortRatingsLabelRes,
    hotelResortMoreLabelRes,
    actionTitleRes,
    actionDescriptionRes,
    actionQuoteRes,
    actionManagerNameRes,
    actionManagerRoleRes,
    actionVideoUrlRes,
    actionVideoPosterRes,
    actionManagerAvatarRes,
  ] = await Promise.all([
    getActiveRooms(),
    prisma.room.count({ where: { isActive: true } }),
    getSiteSetting("hero_slides", null),
    getSiteSetting("contact_phone", null),
    getSiteSetting("facilities_items", locale),
    getSiteSetting("facilities_title", locale),
    getSiteSetting("facilities_subtitle", locale),
    getSiteSetting("hotel_facilities_title", locale),
    getSiteSetting("hotel_facilities_subtitle", locale),
    getSiteSetting("hotel_resort_image", null),
    getSiteSetting("hotel_resort_subtitle", locale),
    getSiteSetting("hotel_resort_title", locale),
    getSiteSetting("hotel_resort_description", locale),
    getSiteSetting("hotel_resort_rooms_count", null),
    getSiteSetting("hotel_resort_rating", null),
    getSiteSetting("hotel_resort_rooms_label", locale),
    getSiteSetting("hotel_resort_ratings_label", locale),
    getSiteSetting("hotel_resort_more_label", locale),
    getSiteSetting("action_title", locale),
    getSiteSetting("action_description", locale),
    getSiteSetting("action_quote", locale),
    getSiteSetting("action_manager_name", locale),
    getSiteSetting("action_manager_role", locale),
    getSiteSetting("action_video_url", null),
    getSiteSetting("action_video_poster", null),
    getSiteSetting("action_manager_avatar", null),
  ]);
  const heroSlides = heroSlidesRes.success && heroSlidesRes.value
    ? parseHeroSlides(heroSlidesRes.value)
    : undefined;
  const facilitiesItems =
    facilitiesItemsRes.success && facilitiesItemsRes.value
      ? parseFacilitiesItems(facilitiesItemsRes.value)
      : undefined;
  const facilitiesTitle: string | undefined =
    (hotelFacilitiesSubtitleRes.success && hotelFacilitiesSubtitleRes.value?.trim()) ? hotelFacilitiesSubtitleRes.value?.trim() ?? undefined
    : (facilitiesTitleRes.success ? (facilitiesTitleRes.value ?? undefined) : undefined);
  const facilitiesHeading: string | undefined =
    (hotelFacilitiesTitleRes.success && hotelFacilitiesTitleRes.value?.trim()) ? hotelFacilitiesTitleRes.value?.trim() ?? undefined
    : (facilitiesSubtitleRes.success ? (facilitiesSubtitleRes.value ?? undefined) : undefined);
  const contactPhone = contactPhoneRes.success && contactPhoneRes.value ? contactPhoneRes.value : undefined;
  const hotelResortImage = hotelResortImageRes.success && hotelResortImageRes.value?.trim() ? hotelResortImageRes.value.trim() : undefined;
  const hotelResortSubtitle = hotelResortSubtitleRes.success ? (hotelResortSubtitleRes.value?.trim() ?? undefined) : undefined;
  const hotelResortTitle = hotelResortTitleRes.success ? (hotelResortTitleRes.value?.trim() ?? undefined) : undefined;
  const hotelResortDescription = hotelResortDescriptionRes.success ? (hotelResortDescriptionRes.value?.trim() ?? undefined) : undefined;
  const hotelResortRoomsCountRaw = hotelResortRoomsCountRes.success ? (hotelResortRoomsCountRes.value?.trim() ?? undefined) : undefined;
  const hotelResortRoomsCountParsed = hotelResortRoomsCountRaw != null && hotelResortRoomsCountRaw !== "" ? parseInt(hotelResortRoomsCountRaw, 10) : undefined;
  const hotelResortRoomsCount = Number.isFinite(hotelResortRoomsCountParsed) ? hotelResortRoomsCountParsed : undefined;
  const hotelResortRating = hotelResortRatingRes.success && hotelResortRatingRes.value?.trim() ? hotelResortRatingRes.value.trim() : undefined;
  const hotelResortRoomsLabel = hotelResortRoomsLabelRes.success ? (hotelResortRoomsLabelRes.value?.trim() ?? undefined) : undefined;
  const hotelResortRatingsLabel = hotelResortRatingsLabelRes.success ? (hotelResortRatingsLabelRes.value?.trim() ?? undefined) : undefined;
  const hotelResortMoreLabel = hotelResortMoreLabelRes.success ? (hotelResortMoreLabelRes.value?.trim() ?? undefined) : undefined;
  const actionTitle: string | undefined = actionTitleRes.success ? (actionTitleRes.value ?? undefined) : undefined;
  const actionDescription: string | undefined = actionDescriptionRes.success ? (actionDescriptionRes.value ?? undefined) : undefined;
  const actionQuote: string | undefined = actionQuoteRes.success ? (actionQuoteRes.value ?? undefined) : undefined;
  const actionManagerName: string | undefined = actionManagerNameRes.success ? (actionManagerNameRes.value ?? undefined) : undefined;
  const actionManagerRole: string | undefined = actionManagerRoleRes.success ? (actionManagerRoleRes.value ?? undefined) : undefined;
  const actionVideoUrl: string | undefined = actionVideoUrlRes.success ? (actionVideoUrlRes.value ?? undefined) : undefined;
  const actionVideoPoster: string | undefined = actionVideoPosterRes.success ? (actionVideoPosterRes.value ?? undefined) : undefined;
  const actionManagerAvatar: string | undefined = actionManagerAvatarRes.success ? (actionManagerAvatarRes.value ?? undefined) : undefined;

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
        managerName={actionManagerName != null ? actionManagerName : undefined}
        managerRole={actionManagerRole != null ? actionManagerRole : undefined}
        videoUrl={actionVideoUrl != null ? actionVideoUrl : undefined}
        videoPosterUrl={actionVideoPoster != null ? actionVideoPoster : undefined}
        managerAvatarUrl={actionManagerAvatar != null ? actionManagerAvatar : undefined}
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
