/** Earth radius in km */
const R_KM = 6371;

export type LatLng = Readonly<{ lat: number; lng: number }>;

export type LatLngBounds = Readonly<{
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}>;

/** Great-circle distance in kilometers. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Padded bounds around a set of points for map framing. */
export function latLngBounds(points: LatLng[]): LatLngBounds {
  if (points.length === 0) {
    return {
      minLat: 0,
      maxLat: 1,
      minLng: 0,
      maxLng: 1,
    };
  }
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);
  const padLat = Math.max((maxLat - minLat) * 0.12, 0.0015);
  const padLng = Math.max((maxLng - minLng) * 0.12, 0.0015);
  if (maxLat === minLat) {
    minLat -= padLat;
    maxLat += padLat;
  }
  if (maxLng === minLng) {
    minLng -= padLng;
    maxLng += padLng;
  }
  return {
    minLat: minLat - padLat,
    maxLat: maxLat + padLat,
    minLng: minLng - padLng,
    maxLng: maxLng + padLng,
  };
}

/** Map pin position as % inside the map panel (8–92% safe area). */
export function toMapPercent(lat: number, lng: number, b: LatLngBounds): {
  mapX: number;
  mapY: number;
} {
  const w = b.maxLng - b.minLng;
  const h = b.maxLat - b.minLat;
  const x = w > 0 ? ((lng - b.minLng) / w) * 84 + 8 : 50;
  const y = h > 0 ? ((b.maxLat - lat) / h) * 84 + 8 : 50;
  return { mapX: clamp(x, 8, 92), mapY: clamp(y, 8, 92) };
}

export function formatDistanceKm(
  km: number,
  unitKm: string,
  unitM: string,
): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} ${unitM}`;
  }
  const decimals = km < 10 ? 1 : 0;
  return `${km.toFixed(decimals)} ${unitKm}`;
}
