import { z } from "zod";

/** أسعار الليلة حسب عدد الضيوف (1–5). كل مفتاح = عدد الضيوف، القيمة = السعر. */
export const roomRatesSchema = z.object({
  1: z.coerce.number().min(0, "Rate for 1 guest must be ≥ 0"),
  2: z.coerce.number().min(0, "Rate for 2 guests must be ≥ 0"),
  3: z.coerce.number().min(0, "Rate for 3 guests must be ≥ 0"),
  4: z.coerce.number().min(0, "Rate for 4 guests must be ≥ 0"),
  5: z.coerce.number().min(0, "Rate for 5 guests must be ≥ 0"),
});

export const createRoomSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  rates: roomRatesSchema,
  isActive: z.boolean().default(true),
  nameEn: z.string().optional(),
  nameAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export type RoomRatesInput = z.infer<typeof roomRatesSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
