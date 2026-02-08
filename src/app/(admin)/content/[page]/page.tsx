import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageById } from "@/lib/content-structure";
import { ContentBreadcrumb } from "@/Components/admin/ContentBreadcrumb";
import { ContentSectionGrid } from "@/Components/admin/ContentSectionGrid";

type Props = { params: Promise<{ page: string }> };

export default async function ContentPageSections({ params }: Props) {
  const { page: pageId } = await params;
  const page = getPageById(pageId);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div>
        <ContentBreadcrumb crumbs={[{ label: page.label }]} />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">{page.label}</h1>
            {page.description && (
              <p className="mt-1 text-sm text-zinc-400">{page.description}</p>
            )}
          </div>
          <Link
            href="/content"
            className="rounded-lg border border-zinc-600 bg-zinc-700/50 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
          >
            ← All pages
          </Link>
        </div>
      </div>

      <ContentSectionGrid page={page} sections={page.sections} />
    </div>
  );
}
