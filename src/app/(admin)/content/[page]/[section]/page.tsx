import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageById, getSectionById } from "@/lib/content-structure";
import { getSiteSetting } from "@/lib/actions/site-content";
import { ContentBreadcrumb } from "@/Components/admin/ContentBreadcrumb";
import { ContentEditor } from "@/Components/admin/ContentEditor";
import { CarouselSectionEditor } from "@/Components/admin/CarouselSectionEditor";
import { TestimonialsSectionEditor } from "@/Components/admin/TestimonialsSectionEditor";
import { BlogSectionEditor } from "@/Components/admin/BlogSectionEditor";
import { FacilitiesSectionEditor } from "@/Components/admin/FacilitiesSectionEditor";
import { RestaurantsSectionEditor } from "@/Components/admin/RestaurantsSectionEditor";

type Props = { params: Promise<{ page: string; section: string }> };

export default async function ContentSectionEditPage({ params }: Props) {
  const { page: pageId, section: sectionId } = await params;
  const page = getPageById(pageId);
  const section = getSectionById(pageId, sectionId);
  if (!page || !section) notFound();

  const locales = ["en", "ar"] as const;
  const initial: Record<string, string> = {};

  for (const keyDef of section.keys) {
    if (keyDef.locale) {
      for (const loc of locales) {
        const res = await getSiteSetting(keyDef.key, loc);
        if (res.success && res.value != null) initial[`${keyDef.key}:${loc}`] = res.value;
      }
    } else {
      const res = await getSiteSetting(keyDef.key, null);
      if (res.success && res.value != null) initial[`${keyDef.key}:`] = res.value;
    }
  }

  const isCarousel = pageId === "home" && sectionId === "carousel";
  const isTestimonials = pageId === "home" && sectionId === "testimonials";
  const isLatestBlog = pageId === "home" && sectionId === "latest-blog";
  const isFacilities = pageId === "home" && sectionId === "facilities";
  const isRestaurants = pageId === "restaurants" && sectionId === "list";

  const keys = section.keys.map((k) => ({
    key: k.key,
    label: k.label,
    locale: k.locale,
    type: k.type,
  }));

  return (
    <div className="space-y-6">
      <div>
        <ContentBreadcrumb
          crumbs={[
            { label: page.label, href: `/content/${page.id}` },
            { label: section.label },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">{section.label}</h1>
            {section.description && (
              <p className="mt-1 text-sm text-zinc-400">{section.description}</p>
            )}
          </div>
          <Link
            href={`/content/${page.id}`}
            className="rounded-lg border border-zinc-600 bg-zinc-700/50 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
          >
            ← {page.label} sections
          </Link>
        </div>
      </div>

      {isCarousel && <CarouselSectionEditor initialValues={initial} />}
      {isTestimonials && <TestimonialsSectionEditor initialValues={initial} />}
      {isLatestBlog && <BlogSectionEditor initialValues={initial} />}
      {isFacilities && <FacilitiesSectionEditor initialValues={initial} />}
      {isRestaurants && <RestaurantsSectionEditor initialValues={initial} />}
      {!isCarousel && !isTestimonials && !isLatestBlog && !isFacilities && !isRestaurants && (
        <ContentEditor
          keys={keys}
          initialValues={initial}
          showTextareaForType={true}
        />
      )}
    </div>
  );
}
