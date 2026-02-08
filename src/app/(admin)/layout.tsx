import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminShell } from "@/Components/admin/AdminShell";

/** Admin pages depend on DB and auth. Render on request, not at build. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  console.log("[auth/layout] Admin layout:", { hasSession: !!session, email: session?.email ?? "none" });
  if (!session) {
    console.log("[auth/layout] No session, redirecting to /login");
    redirect("/login");
  }
  return <AdminShell>{children}</AdminShell>;
}
