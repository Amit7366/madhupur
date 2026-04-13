import type { MapPlaceCategory } from "@/lib/map-place-categories";

/** Top-level tab on the map (narrow area before subtype chips). */
export type MapFilterGroupId =
  | "all"
  | "health"
  | "safety_legal"
  | "government"
  | "education"
  | "religion"
  | "food"
  | "retail"
  | "tourism"
  | "transport"
  | "finance"
  | "utilities"
  | "work"
  | "community"
  | "agriculture"
  | "other";

export const MAP_FILTER_GROUP_ORDER: MapFilterGroupId[] = [
  "all",
  "health",
  "safety_legal",
  "government",
  "education",
  "religion",
  "food",
  "retail",
  "tourism",
  "transport",
  "finance",
  "utilities",
  "work",
  "community",
  "agriculture",
  "other",
];

export const CATEGORIES_BY_GROUP: Record<
  Exclude<MapFilterGroupId, "all">,
  readonly MapPlaceCategory[]
> = {
  health: [
    "hospital",
    "clinic",
    "pharmacy",
    "diagnostic_center",
    "ambulance",
    "blood_bank",
    "veterinary",
  ],
  safety_legal: ["police", "fire_service", "disaster_shelter", "legal_aid"],
  government: [
    "union_office",
    "upazila_office",
    "land_office",
    "passport_office",
    "post_office",
    "election_office",
    "social_service_office",
  ],
  education: [
    "school",
    "college",
    "university",
    "madrasa",
    "coaching_center",
    "library",
  ],
  religion: ["mosque", "temple", "church", "pagoda"],
  food: ["restaurant", "hotel_food", "fast_food", "cafe", "bakery"],
  retail: [
    "super_shop",
    "grocery_store",
    "bazaar",
    "shopping_mall",
    "clothing_store",
    "electronics_store",
  ],
  tourism: [
    "tourist_spot",
    "park",
    "resort",
    "guest_house",
    "historical_place",
  ],
  transport: [
    "bus_stand",
    "train_station",
    "ferry_terminal",
    "cng_stand",
    "car_rental",
  ],
  finance: ["bank", "atm", "mobile_banking_agent", "microfinance"],
  utilities: [
    "electric_office",
    "water_office",
    "internet_provider",
    "repair_service",
    "printing_service",
  ],
  work: ["company", "factory", "job_center", "training_institute"],
  community: ["community_center", "ngo", "club", "event_venue"],
  agriculture: [
    "agriculture_office",
    "fertilizer_shop",
    "seed_store",
    "fishery_office",
    "livestock_office",
  ],
  other: [
    "fuel_station",
    "public_toilet",
    "parking",
    "graveyard",
    "crematorium",
  ],
};

const CATEGORY_TO_GROUP = (() => {
  const m = new Map<MapPlaceCategory, Exclude<MapFilterGroupId, "all">>();
  (Object.entries(CATEGORIES_BY_GROUP) as [
    Exclude<MapFilterGroupId, "all">,
    readonly MapPlaceCategory[],
  ][]).forEach(([gid, cats]) => {
    for (const c of cats) m.set(c, gid);
  });
  return m;
})();

export function categoryToGroup(
  category: MapPlaceCategory,
): Exclude<MapFilterGroupId, "all"> {
  return CATEGORY_TO_GROUP.get(category) ?? "other";
}

export function categoriesInActiveGroup(
  group: MapFilterGroupId,
): readonly MapPlaceCategory[] | null {
  if (group === "all") return null;
  return CATEGORIES_BY_GROUP[group];
}
