import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/** Server-only Supabase client. Prefer service role for uploads; falls back to anon key. */
export function getSupabaseServer() {
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  const key = serviceKey || anonKey;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is required");
  return createClient(url, key);
}

export function getUploadBucket(): string {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) throw new Error("BUCKET_NAME is required for uploads");
  return bucket;
}

/**
 * Returns the storage object path if the URL is from our Supabase bucket public URL; otherwise null.
 * Used to safely delete only our own uploaded files.
 */
export function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.BUCKET_NAME;
  if (!baseUrl || !bucket) return null;
  const prefix = `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/`;
  if (!publicUrl.startsWith(prefix)) return null;
  const path = publicUrl.slice(prefix.length).split("?")[0];
  return path && path.length > 0 ? path : null;
}
