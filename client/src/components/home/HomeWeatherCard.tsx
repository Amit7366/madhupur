"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Loader2,
  LocateFixed,
  Navigation,
  RefreshCw,
  Sun,
  Wind,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MAP_DEFAULT_CENTER } from "@/lib/dummy/map-places";
import {
  fetchOpenMeteoCurrent,
  mapWeatherCode,
  shouldHighlightDust,
  windDegreesToCompass,
  type CurrentWeatherPayload,
  type WeatherKind,
} from "@/lib/open-meteo-weather";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

type LocationMode = "gps" | "fallback";

function resolveDisplayKind(data: CurrentWeatherPayload): { kind: WeatherKind } {
  const codeKind = mapWeatherCode(data.weatherCode);
  const dust = shouldHighlightDust(
    data.pm10,
    data.europeanAqi,
    data.weatherCode,
  );
  if (dust) return { kind: "dust" };
  return { kind: codeKind };
}

function kindToIcon(kind: WeatherKind) {
  const common = "size-[5.5rem] shrink-0 drop-shadow-md sm:size-28";
  switch (kind) {
    case "clear":
    case "mainlyClear":
      return <Sun className={cn(common, "text-amber-400")} strokeWidth={1.25} />;
    case "partlyCloudy":
      return <CloudSun className={cn(common, "text-sky-400")} strokeWidth={1.25} />;
    case "cloudy":
      return <Cloud className={cn(common, "text-slate-400")} strokeWidth={1.25} />;
    case "fog":
      return <CloudFog className={cn(common, "text-slate-400")} strokeWidth={1.25} />;
    case "drizzle":
      return <CloudDrizzle className={cn(common, "text-sky-400")} strokeWidth={1.25} />;
    case "rain":
      return <CloudRain className={cn(common, "text-sky-500")} strokeWidth={1.25} />;
    case "snow":
      return <CloudSnow className={cn(common, "text-sky-200")} strokeWidth={1.25} />;
    case "thunder":
      return (
        <CloudLightning className={cn(common, "text-indigo-400")} strokeWidth={1.25} />
      );
    case "dust":
      return (
        <div className="relative flex shrink-0 items-center justify-center">
          <Wind
            className={cn(common, "absolute text-amber-600/80")}
            strokeWidth={1.15}
          />
          <CloudFog
            className={cn(common, "relative text-amber-200/95")}
            strokeWidth={1.25}
          />
        </div>
      );
    default:
      return <Cloud className={cn(common, "text-slate-400")} strokeWidth={1.25} />;
  }
}

function kindToGradient(kind: WeatherKind): string {
  switch (kind) {
    case "clear":
    case "mainlyClear":
      return "from-amber-400/25 via-sky-400/15 to-transparent dark:from-amber-500/20 dark:via-sky-500/10";
    case "partlyCloudy":
      return "from-sky-400/20 via-slate-400/10 to-transparent dark:from-sky-500/15";
    case "rain":
    case "drizzle":
      return "from-slate-500/25 via-sky-600/15 to-transparent dark:from-slate-600/30";
    case "thunder":
      return "from-indigo-600/30 via-violet-600/15 to-transparent dark:from-indigo-900/40";
    case "snow":
      return "from-slate-300/30 via-sky-200/15 to-transparent dark:from-slate-500/20";
    case "fog":
    case "cloudy":
      return "from-slate-400/20 via-slate-500/10 to-transparent dark:from-slate-600/25";
    case "dust":
      return "from-amber-600/30 via-orange-800/20 to-transparent dark:from-amber-900/35";
    default:
      return "from-sky-400/15 to-transparent";
  }
}

export function HomeWeatherCard() {
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<LocationMode>("gps");
  const [phase, setPhase] = useState<"locating" | "fetching" | "ready" | "error">(
    "locating",
  );
  const [data, setData] = useState<CurrentWeatherPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async (lat: number, lng: number, m: LocationMode) => {
    setPhase("fetching");
    setErr(null);
    try {
      const payload = await fetchOpenMeteoCurrent(lat, lng);
      setData(payload);
      setMode(m);
      setPhase("ready");
    } catch {
      setErr(t("home.weather.error"));
      setPhase("error");
      setData(null);
    }
  }, [t]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      void load(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng, "fallback");
      return;
    }

    setPhase("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void load(pos.coords.latitude, pos.coords.longitude, "gps");
      },
      () => {
        void load(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng, "fallback");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  }, [load]);

  const display = useMemo(() => (data ? resolveDisplayKind(data) : null), [data]);

  const conditionLabel = useMemo(() => {
    if (!display) return "";
    return t(`home.weather.conditions.${display.kind}`);
  }, [display, t]);

  const tempStr = data
    ? Math.round(data.tempC).toLocaleString(locale === "bn" ? "bn-BD" : "en-GB")
    : "";
  const feelsStr = data
    ? Math.round(data.apparentC).toLocaleString(locale === "bn" ? "bn-BD" : "en-GB")
    : "";

  const windCompass = data ? windDegreesToCompass(data.windDirDeg) : "";
  const windKmhRounded = data ? Math.round(data.windKmh) : 0;

  const retryGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      void load(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng, "fallback");
      return;
    }
    setPhase("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void load(pos.coords.latitude, pos.coords.longitude, "gps");
      },
      () => {
        void load(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng, "fallback");
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  };

  return (
    <section
      className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-gradient-to-br shadow-md dark:border-slate-700/80 dark:shadow-black/30"
      aria-labelledby="home-weather-heading"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
          display ? kindToGradient(display.kind) : "from-slate-200/20 to-transparent",
        )}
      />
      <div className="relative px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              id="home-weather-heading"
              className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400"
            >
              {t("home.weather.eyebrow")}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              <LocateFixed className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              {mode === "gps"
                ? t("home.weather.nearYou")
                : t("home.weather.fallbackArea")}
            </p>
          </div>
          <button
            type="button"
            onClick={retryGps}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-200",
              focusRing,
            )}
          >
            <RefreshCw className="size-3.5" aria-hidden />
            {t("home.weather.refresh")}
          </button>
        </div>

        {phase === "locating" || phase === "fetching" ? (
          <div
            className="mt-8 flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400"
            role="status"
          >
            <Loader2 className="size-6 animate-spin text-indigo-600 dark:text-indigo-400" />
            {phase === "locating"
              ? t("home.weather.loading")
              : t("home.weather.fetching")}
          </div>
        ) : phase === "error" ? (
          <div className="mt-6 text-sm text-red-700 dark:text-red-300">
            {err ?? t("home.weather.error")}
          </div>
        ) : data && display ? (
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
              <div className="flex shrink-0 justify-center sm:justify-start" aria-hidden>
                {kindToIcon(display.kind)}
              </div>
              <div className="min-w-0">
                <p className="text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                  {tempStr}
                  <span className="align-top text-2xl font-semibold text-slate-500 dark:text-slate-400">
                    °C
                  </span>
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {conditionLabel}
                </p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  {t("home.weather.feelsLike").replace("{{temp}}", feelsStr)}
                </p>
              </div>
            </div>

            <ul className="grid shrink-0 grid-cols-2 gap-2 sm:max-w-xs sm:grid-cols-1">
              {data.humidityPct != null ? (
                <li className="flex items-center gap-2.5 rounded-2xl border border-white/50 bg-white/50 px-3 py-2.5 text-xs dark:border-white/10 dark:bg-slate-950/40">
                  <Droplets
                    className="size-4 shrink-0 text-sky-600 dark:text-sky-400"
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {Math.round(data.humidityPct)}%
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t("home.weather.humidity")}
                    </p>
                  </div>
                </li>
              ) : null}
              <li className="flex items-center gap-2.5 rounded-2xl border border-white/50 bg-white/50 px-3 py-2.5 text-xs dark:border-white/10 dark:bg-slate-950/40">
                <Navigation
                  className="size-4 shrink-0 text-slate-600 dark:text-slate-400"
                  style={{
                    transform: `rotate(${data.windDirDeg + 180}deg)`,
                  }}
                  aria-hidden
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {windKmhRounded}{" "}
                    <span className="font-normal text-slate-500">km/h</span>{" "}
                    <span className="text-slate-500">{windCompass}</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t("home.weather.wind")}
                  </p>
                </div>
              </li>
              {(data.europeanAqi != null || data.pm10 != null) && (
                <li className="col-span-2 flex items-center gap-2.5 rounded-2xl border border-white/50 bg-white/50 px-3 py-2.5 text-xs sm:col-span-1 dark:border-white/10 dark:bg-slate-950/40">
                  <Wind
                    className="size-4 shrink-0 text-amber-700 dark:text-amber-400"
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {data.europeanAqi != null
                        ? `AQI ${Math.round(data.europeanAqi)}`
                        : data.pm10 != null
                          ? `PM10 ${Math.round(data.pm10)}`
                          : "—"}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t("home.weather.air")}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        ) : null}

        <p className="mt-6 text-[10px] leading-relaxed text-slate-500 dark:text-slate-500">
          {t("home.weather.attribution")}
        </p>
      </div>
    </section>
  );
}
