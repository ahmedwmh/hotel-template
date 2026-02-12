import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { PublicLoading } from "@/Components/public/PublicLoading";

export default function RestaurantsLoading() {
  return (
    <main className="min-h-screen">
      <PublicNavbar locale="en" />
      <PublicLoading />
      <PublicFooter locale="en" />
    </main>
  );
}
