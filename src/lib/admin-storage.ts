/**
 * Client helpers for admin image storage (Supabase).
 * Upload is done via /api/admin/upload POST; delete via DELETE.
 */

/** Returns true if the image was deleted (or was not from our bucket). */
export async function deleteUploadedImage(imageUrl: string | null | undefined): Promise<boolean> {
  const url = typeof imageUrl === "string" ? imageUrl.trim() : "";
  if (!url) return true;

  try {
    const res = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.ok === true || data.error === "URL is not from uploads bucket")) return true;
    return false;
  } catch {
    return false;
  }
}
