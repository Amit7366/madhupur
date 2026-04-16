/** WMO weather interpretation codes (Open-Meteo). */
export type WeatherKind =
  | "clear"
  | "mainlyClear"
  | "partlyCloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder"
  | "dust";

export function mapWeatherCode(code: number): WeatherKind {
  if (code === 0) return "clear";
  if (code === 1) return "mainlyClear";
  if (code === 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95 && code <= 99) return "thunder";
  return "cloudy";
}

/** Strong rain/storm — suppress “dust/haze” as the hero state. */
export function isHeavyPrecipitation(code: number): boolean {
  return [65, 67, 80, 81, 82, 95, 96, 97, 98, 99].includes(code);
}

export function shouldHighlightDust(
  pm10: number | null,
  europeanAqi: number | null,
  code: number,
): boolean {
  if (isHeavyPrecipitation(code)) return false;
  if (pm10 != null && pm10 >= 75) return true;
  if (europeanAqi != null && europeanAqi >= 75) return true;
  return false;
}

export type CurrentWeatherPayload = {
  tempC: number;
  apparentC: number;
  humidityPct: number | null;
  windKmh: number;
  windDirDeg: number;
  weatherCode: number;
  pm10: number | null;
  pm25: number | null;
  europeanAqi: number | null;
};

export async function fetchOpenMeteoCurrent(
  lat: number,
  lng: number,
): Promise<CurrentWeatherPayload> {
  const weatherParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    wind_speed_unit: "kmh",
    timezone: "auto",
  });

  const wRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?${weatherParams}`,
    { cache: "no-store" },
  );
  if (!wRes.ok) throw new Error("weather_http");
  const wJson: unknown = await wRes.json();
  if (
    !wJson ||
    typeof wJson !== "object" ||
    !("current" in wJson) ||
    !(wJson as { current: unknown }).current ||
    typeof (wJson as { current: unknown }).current !== "object"
  ) {
    throw new Error("weather_shape");
  }
  const c = (wJson as { current: Record<string, unknown> }).current;

  let pm10: number | null = null;
  let pm25: number | null = null;
  let europeanAqi: number | null = null;

  try {
    const aqParams = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      current: "european_aqi,pm10,pm2_5",
      timezone: "auto",
    });
    const aRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${aqParams}`,
      { cache: "no-store" },
    );
    if (aRes.ok) {
      const aJson: unknown = await aRes.json();
      if (
        aJson &&
        typeof aJson === "object" &&
        "current" in aJson &&
        (aJson as { current: unknown }).current &&
        typeof (aJson as { current: unknown }).current === "object"
      ) {
        const ac = (aJson as { current: Record<string, unknown> }).current;
        if (typeof ac.pm10 === "number") pm10 = ac.pm10;
        if (typeof ac.pm2_5 === "number") pm25 = ac.pm2_5;
        if (typeof ac.european_aqi === "number") europeanAqi = ac.european_aqi;
      }
    }
  } catch {
    /* air quality is optional */
  }

  const tempC = c.temperature_2m;
  if (typeof tempC !== "number") throw new Error("weather_temp");

  return {
    tempC,
    apparentC:
      typeof c.apparent_temperature === "number"
        ? c.apparent_temperature
        : tempC,
    humidityPct:
      typeof c.relative_humidity_2m === "number"
        ? c.relative_humidity_2m
        : null,
    windKmh: typeof c.wind_speed_10m === "number" ? c.wind_speed_10m : 0,
    windDirDeg:
      typeof c.wind_direction_10m === "number" ? c.wind_direction_10m : 0,
    weatherCode: typeof c.weather_code === "number" ? c.weather_code : 0,
    pm10,
    pm25,
    europeanAqi,
  };
}

export function windDegreesToCompass(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const d = ((deg % 360) + 360) % 360;
  const idx = Math.floor((d + 22.5) / 45) % 8;
  return directions[idx] ?? "N";
}
