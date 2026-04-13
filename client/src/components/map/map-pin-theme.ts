import type { MapPlaceCategory } from "@/lib/map-place-categories";
import { MAP_PLACE_CATEGORIES } from "@/lib/map-place-categories";
import {
  categoryToGroup,
  type MapFilterGroupId,
} from "@/lib/map-category-groups";

const GROUP_HEX: Record<Exclude<MapFilterGroupId, "all">, string> = {
  health: "#dc2626",
  safety_legal: "#0369a1",
  government: "#475569",
  education: "#059669",
  religion: "#d97706",
  food: "#ca8a04",
  retail: "#65a30d",
  tourism: "#15803d",
  transport: "#2563eb",
  finance: "#0d9488",
  utilities: "#7c3aed",
  work: "#4338ca",
  community: "#db2777",
  agriculture: "#a16207",
  other: "#64748b",
};

function hexForCategory(category: MapPlaceCategory): string {
  return GROUP_HEX[categoryToGroup(category)];
}

/** Pin fill colour per category (group-based). */
export const MAP_PIN_HEX: Record<MapPlaceCategory, string> = Object.fromEntries(
  MAP_PLACE_CATEGORIES.map((c) => [c, hexForCategory(c)]),
) as Record<MapPlaceCategory, string>;

/** Tailwind pin theme (used if components need class-based pins). */
export const MAP_PIN_THEME: Record<
  MapPlaceCategory,
  { circle: string; pinTail: string; boxTail: string; header: string }
> = Object.fromEntries(
  MAP_PLACE_CATEGORIES.map((c) => {
    const hex = hexForCategory(c);
    const tail = `border-t-[${hex}]`;
    return [
      c,
      {
        circle: "bg-slate-600",
        pinTail: `h-0 w-0 border-x-[9px] border-x-transparent border-b-0 border-t-[11px] ${tail}`,
        boxTail: `h-0 w-0 border-x-[10px] border-x-transparent border-b-0 border-t-[12px] ${tail}`,
        header: "bg-slate-600",
      },
    ];
  }),
) as Record<
  MapPlaceCategory,
  { circle: string; pinTail: string; boxTail: string; header: string }
>;
