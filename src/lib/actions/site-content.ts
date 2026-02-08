"use server";

import type { GetSiteSettingResult, SetSiteSettingResult } from "@/lib/content-keys";
import { getAllContentKeys } from "@/lib/content-structure";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const CONTENT_KEY_SET = new Set(getAllContentKeys());

export async function getSiteSetting(
  key: string,
  locale?: string | null
): Promise<GetSiteSettingResult> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: {
        key_locale: { key, locale: locale ?? null },
      } as Prisma.SiteSettingWhereUniqueInput,
    });
    return { success: true, value: setting?.value ?? null };
  } catch (e) {
    console.error("[site-content] getSiteSetting:", e);
    return { success: false, error: "Failed to get setting." };
  }
}

export async function getSiteSettingsBatch(
  keys: { key: string; locale?: string | null }[]
): Promise<Record<string, string | null>> {
  const out: Record<string, string | null> = {};
  await Promise.all(
    keys.map(async ({ key, locale }) => {
      const res = await getSiteSetting(key, locale);
      if (res.success) out[`${key}:${locale ?? ""}`] = res.value;
    })
  );
  return out;
}

export async function setSiteSetting(
  key: string,
  value: string,
  locale?: string | null
): Promise<SetSiteSettingResult> {
  if (!CONTENT_KEY_SET.has(key)) {
    return { success: false, error: "Invalid key." };
  }

  try {
    await prisma.siteSetting.upsert({
      where: {
        key_locale: { key, locale: locale ?? null },
      } as Prisma.SiteSettingWhereUniqueInput,
      create: { key, value, locale: locale ?? null },
      update: { value },
    });
    return { success: true };
  } catch (e) {
    console.error("[site-content] setSiteSetting:", e);
    return { success: false, error: "Failed to save setting." };
  }
}
