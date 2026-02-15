"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema, type CreateRoomInput } from "@/lib/validations";
import { createRoom, updateRoom, type RoomWithRates } from "@/lib/actions/admin-rooms";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { MultiImageUpload } from "@/Components/admin/MultiImageUpload";

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

const DEFAULT_RATES = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as const;

export function RoomForm({ room }: { room?: RoomWithRates }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: room
      ? {
          slug: room.slug,
          capacity: room.capacity,
          quantity: room.quantity,
          rates: room.rates,
          isActive: room.isActive,
          nameEn: room.nameEn ?? "",
          nameAr: room.nameAr ?? "",
          descriptionEn: room.descriptionEn ?? "",
          descriptionAr: room.descriptionAr ?? "",
          images: room.images ?? [],
        }
      : {
          slug: "",
          capacity: 2,
          quantity: 1,
          rates: { ...DEFAULT_RATES },
          isActive: true,
          nameEn: "",
          nameAr: "",
          descriptionEn: "",
          descriptionAr: "",
          images: [],
        },
  });

  const nameEnValue = watch("nameEn");
  const imagesList = watch("images") ?? [];
  const isEdit = !!room;

  function slugFromName(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setError(null);
        const images = (data.images ?? []).filter((u): u is string => typeof u === "string" && u.trim() !== "" && /^https?:\/\//i.test(u));
        const payload = { ...data, images };
        const res = isEdit
          ? await updateRoom(room!.id, payload)
          : await createRoom(payload);
        if (res.success) {
          router.push("/rooms");
          router.refresh();
        } else {
          setError(res.error);
        }
      })}
      className="w-full space-y-6 rounded-xl border border-zinc-700/80 bg-zinc-800/80 p-6"
    >
      {error && (
        <div className="rounded-lg bg-red-900/20 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="nameEn" className="text-zinc-300">Name (English)</Label>
          <Input
            id="nameEn"
            {...register("nameEn")}
            className={inputClass}
            placeholder="e.g. Executive King Suite"
          />
        </div>
        <div>
          <Label htmlFor="nameAr" className="text-zinc-300">Name (Arabic)</Label>
          <Input
            id="nameAr"
            {...register("nameAr")}
            className={inputClass}
            placeholder="مثال: جناح الملك التنفيذي"
            dir="rtl"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="slug" className="text-zinc-300">Slug</Label>
        <div className="flex gap-2">
          <Input
            id="slug"
            {...register("slug")}
            className={inputClass}
            placeholder="e.g. executive-king-suite"
          />
          {!isEdit && (
            <button
              type="button"
              onClick={() => setValue("slug", slugFromName(nameEnValue || ""), { shouldValidate: true })}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 whitespace-nowrap"
            >
              From Name (EN)
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-zinc-500">URL identifier: lowercase letters, numbers, hyphens only. Used in room links.</p>
        {errors.slug && (
          <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="descriptionEn" className="text-zinc-300">Description (English)</Label>
          <textarea
            id="descriptionEn"
            rows={3}
            {...register("descriptionEn")}
            className={inputClass + " min-h-[80px] resize-y"}
            placeholder="Room description in English…"
          />
        </div>
        <div>
          <Label htmlFor="descriptionAr" className="text-zinc-300">Description (Arabic)</Label>
          <textarea
            id="descriptionAr"
            rows={3}
            {...register("descriptionAr")}
            className={inputClass + " min-h-[80px] resize-y"}
            placeholder="وصف الغرفة بالعربية…"
            dir="rtl"
          />
        </div>
      </div>

      {/* Room images — رفع مجموعة صور مرة واحدة */}
      <MultiImageUpload
        value={imagesList}
        onChange={(urls) => setValue("images", urls, { shouldValidate: true })}
        folder="rooms"
        onError={setError}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="capacity" className="text-zinc-300">Capacity (guests per room)</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            {...register("capacity", { valueAsNumber: true })}
            className={inputClass}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-400">{errors.capacity.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="quantity" className="text-zinc-300">Quantity (units of this type)</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            {...register("quantity", { valueAsNumber: true })}
            className={inputClass}
            placeholder="e.g. 10"
          />
          <p className="mt-1 text-xs text-zinc-500">How many rooms of this type exist in the hotel.</p>
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-400">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      {/* Prices per number of guests — سعر الليلة حسب عدد الضيوف */}
      <div className="space-y-4 rounded-lg border border-zinc-600/80 bg-zinc-900/50 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-zinc-200">
            Price per night (by number of guests)
          </h3>
          <p className="text-xs text-zinc-500">
            Set a different rate for 1, 2, 3, 4, or 5 guests. The public booking form will show the correct price for the selected guest count.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([1, 2, 3, 4, 5] as const).map((g) => (
            <div key={g}>
              <Label htmlFor={`rates.${g}`} className="text-zinc-400">
                {g} {g === 1 ? "guest" : "guests"}
              </Label>
              <Input
                id={`rates.${g}`}
                type="number"
                min={0}
                step={0.01}
                {...register(`rates.${g}` as Path<CreateRoomInput>, { valueAsNumber: true })}
                className={inputClass}
                placeholder="0"
              />
              {errors.rates?.[g] && (
                <p className="mt-1 text-xs text-red-400">{errors.rates[g].message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-600 focus:ring-amber-500"
        />
        <Label htmlFor="isActive" className="text-zinc-300">Active (visible on public site)</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update room" : "Create room"}
        </Button>
        <Link href="/rooms">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg border-zinc-600 bg-zinc-700/50 text-zinc-200 hover:bg-zinc-700"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
