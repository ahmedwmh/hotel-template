import Link from "next/link";

type Crumb = { label: string; href?: string };

export function ContentBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-zinc-400">
      <Link href="/content" className="hover:text-amber-400">
        Content
      </Link>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-zinc-600">/</span>
          {c.href ? (
            <Link href={c.href} className="hover:text-amber-400">
              {c.label}
            </Link>
          ) : (
            <span className="text-zinc-200">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
