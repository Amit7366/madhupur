import type { Locale } from "@/lib/i18n";
import type { MapPlaceCategory } from "@/lib/map-place-categories";
import {
  MAP_CATEGORY_ORDER,
  MAP_PLACE_CATEGORIES,
} from "@/lib/map-place-categories";

export type { MapPlaceCategory } from "@/lib/map-place-categories";
export { MAP_CATEGORY_ORDER, MAP_PLACE_CATEGORIES };

/** Bilingual copy — Bangla first; UI picks by route locale. */
export type Bilingual = Readonly<{
  bn: string;
  en: string;
}>;

export type MapPlace = {
  id: string;
  category: MapPlaceCategory;
  name: Bilingual;
  address: Bilingual;
  description: Bilingual;
  services: Bilingual;
  hours: Bilingual;
  image: string;
  hotline?: string;
  dutyPhone?: string;
  dutyOfficer: Bilingual;
  lat: number;
  lng: number;
};

export function placeText(b: Bilingual, lang: Locale): string {
  return lang === "bn" ? b.bn : b.en;
}

export const MAP_DEFAULT_CENTER = {
  lat: 24.61921690909821,
  lng: 90.03515625064864,
} as const;

export const MAP_PLACE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=900&q=80";

/**
 * Curated seed data (offline + baseline). API places are merged on the map page.
 * Keep in sync with `server/src/seeds/map-places.seed.ts` for `npm run seed`.
 */
export const MAP_PLACES: MapPlace[] = [
  {
    id: "seed-madhupur-health-complex",
    category: "hospital",
    name: {
      bn: "Madhupur Upazila Health Complex",
      en: "Madhupur Upazila Health Complex",
    },
    address: {
      bn: "Madhupur, Tangail (upazila HQ)",
      en: "Madhupur, Tangail (upazila HQ)",
    },
    description: {
      bn: "Main government health facility. Emergency, OPD, maternal and child health.",
      en: "Main government health facility. Emergency, OPD, maternal and child health.",
    },
    services: {
      bn: "Emergency · OPD · MCH · Immunization",
      en: "Emergency · OPD · MCH · Immunization",
    },
    hours: {
      bn: "Emergency per policy. OPD weekday daytime; confirm holidays.",
      en: "Emergency per policy. OPD weekday daytime; confirm holidays.",
    },
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
    hotline: "16263",
    dutyPhone: "09228-56004",
    dutyOfficer: {
      bn: "Upazila Health & Family Planning Officer",
      en: "Upazila Health & Family Planning Officer",
    },
    lat: 24.6169,
    lng: 90.0268,
  },
  {
    id: "seed-madhupur-model-pharmacy",
    category: "pharmacy",
    name: {
      bn: "Model Pharmacy (sample)",
      en: "Model Pharmacy (sample)",
    },
    address: {
      bn: "Near Madhupur Bazar",
      en: "Near Madhupur Bazar",
    },
    description: {
      bn: "Prescription medicines and health supplies—verify locally.",
      en: "Prescription medicines and health supplies—verify locally.",
    },
    services: {
      bn: "Medicines · Health products",
      en: "Medicines · Health products",
    },
    hours: {
      bn: "Typically 09:00–22:00.",
      en: "Typically 09:00–22:00.",
    },
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474e2ae?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01700-000000",
    dutyOfficer: { bn: "Pharmacist on duty", en: "Pharmacist on duty" },
    lat: 24.6215,
    lng: 90.034,
  },
  {
    id: "seed-madhupur-police-station",
    category: "police",
    name: {
      bn: "Madhupur Police Station",
      en: "Madhupur Police Station",
    },
    address: {
      bn: "Madhupur Upazila HQ, Thana Road",
      en: "Madhupur Upazila HQ, Thana Road",
    },
    description: {
      bn: "GD, general diary, law and order. Emergency: 999.",
      en: "GD, general diary, law and order. Emergency: 999.",
    },
    services: {
      bn: "GD · Diary · Traffic",
      en: "GD · Diary · Traffic",
    },
    hours: {
      bn: "Duty desk per police policy.",
      en: "Duty desk per police policy.",
    },
    image:
      "https://images.unsplash.com/photo-1453873530434-1a5a7d89fcaa?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "999",
    dutyOfficer: { bn: "Officer in charge", en: "Officer in charge" },
    lat: 24.6182,
    lng: 90.0285,
  },
  {
    id: "seed-madhupur-fire-service",
    category: "fire_service",
    name: {
      bn: "Fire Service & Civil Defence (sample)",
      en: "Fire Service & Civil Defence (sample)",
    },
    address: {
      bn: "Near upazila HQ",
      en: "Near upazila HQ",
    },
    description: {
      bn: "Fire and rescue. National hotlines 999 / 9611.",
      en: "Fire and rescue. National hotlines 999 / 9611.",
    },
    services: {
      bn: "Firefighting · Rescue",
      en: "Firefighting · Rescue",
    },
    hours: {
      bn: "24h emergency readiness per policy.",
      en: "24h emergency readiness per policy.",
    },
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    hotline: "9611",
    dutyOfficer: { bn: "Station officer", en: "Station officer" },
    lat: 24.6175,
    lng: 90.031,
  },
  {
    id: "seed-madhupur-union-complex",
    category: "union_office",
    name: {
      bn: "Upazila / Union parishad office (sample)",
      en: "Upazila / Union parishad office (sample)",
    },
    address: {
      bn: "Madhupur Upazila",
      en: "Madhupur Upazila",
    },
    description: {
      bn: "Certificates and local admin—contact the relevant union parishad.",
      en: "Certificates and local admin—contact the relevant union parishad.",
    },
    services: {
      bn: "Registration · Certificates · Information",
      en: "Registration · Certificates · Information",
    },
    hours: {
      bn: "Government office hours on working days.",
      en: "Government office hours on working days.",
    },
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "09228-00000",
    dutyOfficer: { bn: "Chairman / Secretary", en: "Chairman / Secretary" },
    lat: 24.6195,
    lng: 90.033,
  },
  {
    id: "seed-madhupur-restaurant",
    category: "restaurant",
    name: {
      bn: "Local restaurant (sample)",
      en: "Local restaurant (sample)",
    },
    address: {
      bn: "Near Tangail Road",
      en: "Near Tangail Road",
    },
    description: {
      bn: "Daily meals and snacks—menu and hours vary.",
      en: "Daily meals and snacks—menu and hours vary.",
    },
    services: {
      bn: "Food · Beverages",
      en: "Food · Beverages",
    },
    hours: {
      bn: "Approx. 10:00–23:00.",
      en: "Approx. 10:00–23:00.",
    },
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01711-222222",
    dutyOfficer: { bn: "Manager", en: "Manager" },
    lat: 24.623,
    lng: 90.038,
  },
  {
    id: "seed-madhupur-atm",
    category: "atm",
    name: {
      bn: "ATM booth (sample)",
      en: "ATM booth (sample)",
    },
    address: {
      bn: "Bazar corner",
      en: "Bazar corner",
    },
    description: {
      bn: "Cash withdrawal—confirm bank brand and network on site.",
      en: "Cash withdrawal—confirm bank brand and network on site.",
    },
    services: {
      bn: "Cash · Balance inquiry",
      en: "Cash · Balance inquiry",
    },
    hours: {
      bn: "24h or banking hours—check signage.",
      en: "24h or banking hours—check signage.",
    },
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    dutyOfficer: { bn: "Bank support line", en: "Bank support line" },
    lat: 24.621,
    lng: 90.029,
  },
  {
    id: "seed-madhupur-bus-stand",
    category: "bus_stand",
    name: {
      bn: "Madhupur Bus Stand",
      en: "Madhupur Bus Stand",
    },
    address: {
      bn: "Madhupur town",
      en: "Madhupur town",
    },
    description: {
      bn: "Inter-district and local buses—confirm times at counters.",
      en: "Inter-district and local buses—confirm times at counters.",
    },
    services: {
      bn: "Tickets · Luggage",
      en: "Tickets · Luggage",
    },
    hours: {
      bn: "Early morning through evening (route dependent).",
      en: "Early morning through evening (route dependent).",
    },
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "09600-00000",
    dutyOfficer: { bn: "Counter staff", en: "Counter staff" },
    lat: 24.624,
    lng: 90.04,
  },
  {
    id: "seed-madhupur-fuel-station",
    category: "fuel_station",
    name: {
      bn: "Fuel station (sample)",
      en: "Fuel station (sample)",
    },
    address: {
      bn: "Tangail Road",
      en: "Tangail Road",
    },
    description: {
      bn: "Petrol, diesel, CNG—prices and services on site.",
      en: "Petrol, diesel, CNG—prices and services on site.",
    },
    services: {
      bn: "Fuel · Air",
      en: "Fuel · Air",
    },
    hours: {
      bn: "Typically 06:00–23:00.",
      en: "Typically 06:00–23:00.",
    },
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=900&q=80",
    dutyPhone: "01733-333333",
    dutyOfficer: { bn: "Station manager", en: "Station manager" },
    lat: 24.6188,
    lng: 90.041,
  },
];
