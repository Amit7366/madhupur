import type { LatLng } from "@/lib/geo";

/**
 * Driving-directions preview for an iframe (no API key). Uses the same origin/destination
 * pattern as `maps/dir` links; `output=embed` returns Google’s embed document.
 */
/** Opens Google Maps directions (no API key). */
export function googleMapsDirectionsUrl(
  destination: LatLng,
  origin?: LatLng,
): string {
  const dest = `${destination.lat},${destination.lng}`;
  let u = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
  if (origin) {
    u += `&origin=${encodeURIComponent(`${origin.lat},${origin.lng}`)}`;
  }
  return u;
}

export function googleDirectionsEmbedUrl(
  origin: LatLng,
  destination: LatLng,
): string {
  const saddr = `${origin.lat},${origin.lng}`;
  const daddr = `${destination.lat},${destination.lng}`;
  return `https://maps.google.com/maps?f=d&saddr=${encodeURIComponent(saddr)}&daddr=${encodeURIComponent(daddr)}&output=embed`;
}

/**
 * Iframe embed that targets the **Google Maps place entity** (not raw lat/lng).
 * That’s what draws the red dashed upazila outline in the full Maps UI; a plain
 * `?q=lat,lng&output=embed` pin does not.
 *
 * `pb` includes `1s0x37562698236e5fa1:0x7ed3c7c357fb40d6` from the official place link.
 * Viewport lng/lat match the shared map; `1m3!1d…` is scale—larger = zoomed out so the
 * upazila boundary fits more comfortably in the iframe.
 */
export const MADHUPUR_UPAZILA_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d178200!2d89.8809843!3d24.6546968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37562698236e5fa1%3A0x7ed3c7c357fb40d6!2sMadhupur%20Upazila%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1704067200000!5m2!1sen!2sbd";

/** Full Google Maps place URL for “Open in Google Maps”. */
export const MADHUPUR_UPAZILA_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Madhupur+Upazila/@24.6072161,90.0288144,11z/data=!3m1!4b1!4m6!3m5!1s0x37562698236e5fa1:0x7ed3c7c357fb40d6!8m2!3d24.6072161!4d90.0288144!16s%2Fg%2F11clgc_99_?entry=ttu";
