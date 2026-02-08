import { getActiveRooms } from "@/lib/actions/rooms";
import { getSiteSetting } from "@/lib/actions/site-content";
import { parseHeroSlides } from "@/lib/hero-slides";
import { parseFacilitiesItems } from "@/lib/facilities-items";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { HeroSectionNext } from "@/Components/public/HeroSectionNext";
import { RoomsSectionNext } from "@/Components/public/RoomsSectionNext";
import { HotelAndResortNext } from "@/Components/public/HotelAndResortNext";
import { HotelAndFacilitiesNext } from "@/Components/public/HotelAndFacilitiesNext";
import { ActionNext } from "@/Components/public/ActionNext";
import { FacilitiesNext } from "@/Components/public/FacilitiesNext";
import { PublicFooter } from "@/Components/public/PublicFooter";

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
    getSiteSetting("hero_slides", locale),
    getSiteSetting("contact_phone", null),
    getSiteSetting("facilities_items", locale),
    getSiteSetting("facilities_title", locale),
    getSiteSetting("facilities_subtitle", locale),
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
  const facilitiesTitle: string | undefined = facilitiesTitleRes.success ? (facilitiesTitleRes.value ?? undefined) : undefined;
  const facilitiesHeading: string | undefined = facilitiesSubtitleRes.success ? (facilitiesSubtitleRes.value ?? undefined) : undefined;
  const contactPhone = contactPhoneRes.success && contactPhoneRes.value ? contactPhoneRes.value : undefined;
  const actionTitle: string | undefined = actionTitleRes.success ? (actionTitleRes.value ?? undefined) : undefined;
  const actionDescription: string | undefined = actionDescriptionRes.success ? (actionDescriptionRes.value ?? undefined) : undefined;
  const actionQuote: string | undefined = actionQuoteRes.success ? (actionQuoteRes.value ?? undefined) : undefined;
  const actionManagerName: string | undefined = actionManagerNameRes.success ? (actionManagerNameRes.value ?? undefined) : undefined;
  const actionManagerRole: string | undefined = actionManagerRoleRes.success ? (actionManagerRoleRes.value ?? undefined) : undefined;
  const actionVideoUrl: string | undefined = actionVideoUrlRes.success ? (actionVideoUrlRes.value ?? undefined) : undefined;
  const actionVideoPoster: string | undefined = actionVideoPosterRes.success ? (actionVideoPosterRes.value ?? undefined) : undefined;
  const actionManagerAvatar: string | undefined = actionManagerAvatarRes.success ? (actionManagerAvatarRes.value ?? undefined) : undefined;

  return (
    <main className="min-h-screen">
      <PublicNavbar locale={locale} />
      <HeroSectionNext locale={locale} slides={heroSlides} contactPhone={contactPhone} />
      <RoomsSectionNext rooms={rooms} locale={locale} />
      <HotelAndResortNext locale={locale} roomsCount={roomsCount} />
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
      <PublicFooter locale={locale} />
    </main>
  );
}
