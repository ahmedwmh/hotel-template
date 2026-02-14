import { PublicNavbar } from "@/Components/public/PublicNavbar";
import { PublicFooter } from "@/Components/public/PublicFooter";
import { PublicLoading } from "@/Components/public/PublicLoading";

export default function RestaurantsLoading() {
  return (
    <main className="min-h-screen flex flex-col bg-[#000]">
      <PublicNavbar locale="en" />
      <div className="flex-1 flex items-center justify-center bg-[#000]">
        <PublicLoading fullScreen={false} />
      </div>
      <PublicFooter locale="en" />
    </main>
  );
}
