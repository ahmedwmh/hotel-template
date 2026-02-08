import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getSupabaseServer, getUploadBucket } from "@/lib/supabase-server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function safeName(original: string): string {
  const ext = original.includes(".") ? original.slice(original.lastIndexOf(".")).toLowerCase() : ".jpg";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
  const base = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  return base + safeExt;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const part = formData.get("file");
    const folder = (formData.get("folder") as string) || "uploads";

    if (!part || typeof part !== "object" || !("arrayBuffer" in part)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = part as Blob;
    const contentType = blob.type || "image/jpeg";
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid type. Use JPEG, PNG, WebP or GIF." },
        { status: 400 }
      );
    }
    if (blob.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const name = safeName(typeof (part as { name?: string }).name === "string" ? (part as { name: string }).name : "image.jpg");
    const path = `${folder.replace(/^\/+|\/+$/g, "")}/${name}`;

    const supabase = getSupabaseServer();
    const bucket = getUploadBucket();

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.error("[admin/upload] Supabase storage error:", error);
      return NextResponse.json(
        { error: error.message || "Upload failed" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e) {
    console.error("[admin/upload]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
