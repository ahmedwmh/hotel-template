"use server";

import type { GetSiteSettingResult, SetSiteSettingResult } from "@/lib/content-keys";
import { getAllContentKeys } from "@/lib/content-structure";
import { prisma } from "@/lib/prisma";

const CONTENT_KEY_SET = new Set(getAllContentKeys());

export async function getSiteSetting(
  key: string,
  locale?: string | null
): Promise<GetSiteSettingResult> {
  try {
    const loc = locale ?? null;
    if (loc === null) {
      const setting = await prisma.siteSetting.findFirst({
        where: { key, locale: null },
      });
      return { success: true, value: setting?.value ?? null };
    }
    const setting = await prisma.siteSetting.findUnique({
      where: { key_locale: { key, locale: loc } },
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
    const loc = locale ?? null;
    if (loc === null) {
      const existing = await prisma.siteSetting.findFirst({
        where: { key, locale: null },
      });
      if (existing) {
        await prisma.siteSetting.update({ where: { id: existing.id }, data: { value } });
      } else {
        await prisma.siteSetting.create({ data: { key, value, locale: null } });
      }
      return { success: true };
    }
    await prisma.siteSetting.upsert({
      where: { key_locale: { key, locale: loc } },
      create: { key, value, locale: loc },
      update: { value },
    });
    return { success: true };
  } catch (e) {
    console.error("[site-content] setSiteSetting:", e);
    return { success: false, error: "Failed to save setting." };
  }
}
