import { CONTENT_PAGES } from "@/lib/content-structure";
import { ContentBreadcrumb } from "@/Components/admin/ContentBreadcrumb";
import { ContentPageGrid } from "@/Components/admin/ContentPageGrid";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <ContentBreadcrumb crumbs={[]} />
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">Content</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Choose a page to edit its sections. Each page contains blocks you can edit (hero, rooms, contact, etc.).
        </p>
      </div>

      <ContentPageGrid pages={CONTENT_PAGES} />
    </div>
  );
}
