/**
 * Simple hero / carousel for the public home page.
 * Content can be driven by SiteSetting (e.g. hero_slides) once T035 is implemented.
 */
export function HeroCarousel({
  title,
  subtitle,
  locale,
}: {
  title: string;
  subtitle?: string;
  locale: string;
}) {
  return (
    <section className="bg-gray-100 py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </section>
  );
}
