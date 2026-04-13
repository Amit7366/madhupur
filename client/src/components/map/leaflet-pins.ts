import type { MapPlaceCategory } from "@/lib/dummy/map-places";
import { MAP_PLACE_CATEGORIES } from "@/lib/map-place-categories";
import { MAP_PIN_HEX } from "@/components/map/map-pin-theme";

/** Lucide-style paths (viewBox 0 0 24 24), white on coloured pin head. */
const CATEGORY_ICON_OVERRIDES: Partial<Record<MapPlaceCategory, string>> = {
  hospital: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M14 9h-4"/><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/></g>`,
  pharmacy: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/></g>`,
  police: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></g>`,
  fire_service: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07 2-2 2-2 4a4 4 0 0 0 8 0c0-1.67-.67-2.33-1.33-3.17"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></g>`,
  union_office: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></g>`,
  school: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></g>`,
  restaurant: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></g>`,
  atm: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M10 16h4"/></g>`,
  bus_stand: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.5"/><path d="M18 18h3s1 0 1-1v-3"/><path d="M2 18h16s1 0 1-1v-3"/><path d="M8 18v2"/><path d="M16 18v2"/></g>`,
  fuel_station: `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M7 10h4"/><path d="M17 10h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1"/><path d="M17 22V10"/></g>`,
};

const DEFAULT_ICON_INNER = `<g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></g>`;

function categoryIconInner(category: MapPlaceCategory): string {
  return CATEGORY_ICON_OVERRIDES[category] ?? DEFAULT_ICON_INNER;
}

/** Ensures every category resolves (satisfies exhaustive Record if needed elsewhere). */
export const CATEGORY_ICON_SVG_INNER: Record<MapPlaceCategory, string> =
  Object.fromEntries(
    MAP_PLACE_CATEGORIES.map((c) => [c, categoryIconInner(c)]),
  ) as Record<MapPlaceCategory, string>;

const PIN_W = 50;
/** Bottom of ground dot from top of wrapper (matches prior Tailwind layout). */
const PIN_H = 56;
const ANCHOR_X = PIN_W / 2;
const ANCHOR_Y = PIN_H;

export const LEAFLET_PLACE_PIN_ICON_SIZE: [number, number] = [PIN_W, PIN_H];
export const LEAFLET_PLACE_PIN_ANCHOR: [number, number] = [ANCHOR_X, ANCHOR_Y];

const USER_PIN_W = 44;
const USER_PIN_H = 52;
export const LEAFLET_USER_PIN_ICON_SIZE: [number, number] = [USER_PIN_W, USER_PIN_H];
export const LEAFLET_USER_PIN_ANCHOR: [number, number] = [USER_PIN_W / 2, USER_PIN_H];

function placePinInnerHtml(category: MapPlaceCategory, selected: boolean): string {
  const hex = MAP_PIN_HEX[category];
  const icon = categoryIconInner(category);
  const scale = selected ? "scale(1.1)" : "scale(1)";
  const z = selected ? 25 : 10;
  return `
<div class="mp-pin" style="display:flex;flex-direction:column;align-items:center;width:${PIN_W}px;transform:${scale};transform-origin:50% 100%;z-index:${z};cursor:pointer;pointer-events:auto;">
  <div style="width:44px;height:44px;border-radius:9999px;border:3px solid #fff;background:${hex};box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.12),0 4px 6px -4px rgb(0 0 0 / 0.1);display:flex;align-items:center;justify-content:center;box-sizing:content-box;">
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>
  </div>
  <div style="width:0;height:0;margin-top:-6px;border-left:9px solid transparent;border-right:9px solid transparent;border-top:11px solid ${hex};"></div>
  <div style="width:8px;height:8px;margin-top:-2px;border-radius:9999px;background:#fff;box-shadow:0 1px 2px rgb(0 0 0 / 0.12);border:2px solid rgba(0,0,0,0.15);"></div>
</div>`.trim();
}

export function leafletPlaceDivIconClassName(
  category: MapPlaceCategory,
  selected: boolean,
): string {
  return `mp-place-pin mp-place-pin-${category}${selected ? " mp-place-pin--selected" : ""}`;
}

export function leafletPlacePinHtml(category: MapPlaceCategory, selected: boolean): string {
  return placePinInnerHtml(category, selected);
}

/** Sky user location marker (MapPin), same visual language as MapView. */
export function leafletUserPinHtml(): string {
  const sky = "#0284c7";
  const ring = "rgba(56, 189, 248, 0.5)";
  return `
<div style="display:flex;flex-direction:column;align-items:center;width:${USER_PIN_W}px;pointer-events:none;cursor:default;opacity:0.95;">
  <div style="width:36px;height:36px;border-radius:9999px;border:2px solid #fff;background:${sky};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px ${ring},0 10px 15px -3px rgb(0 0 0 / 0.12);">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>
  <div style="width:1px;height:8px;background:${sky};opacity:0.85;margin-top:2px;"></div>
  <div style="width:8px;height:8px;border-radius:9999px;background:${sky};border:2px solid #fff;margin-top:0;box-shadow:0 0 0 1px rgba(15,23,42,0.12);"></div>
</div>`.trim();
}
