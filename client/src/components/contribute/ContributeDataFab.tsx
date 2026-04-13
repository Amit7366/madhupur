"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CirclePlus, Crosshair, MapPin, X } from "lucide-react";
import { ContributeMapPickModal } from "@/components/contribute/ContributeMapPickModal";
import type { MapPlaceCategory } from "@/lib/dummy/map-places";
import {
  CATEGORIES_BY_GROUP,
  MAP_FILTER_GROUP_ORDER,
  type MapFilterGroupId,
} from "@/lib/map-category-groups";
import {
  getPublicApiBaseUrl,
  requestMapPlacesRefresh,
  submitPlaceToApi,
  type CreatePlacePayload,
} from "@/lib/map-place-api";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/use-i18n";

type FormFields = {
  category: MapPlaceCategory | "";
  nameBn: string;
  nameEn: string;
  addressBn: string;
  addressEn: string;
  descriptionBn: string;
  descriptionEn: string;
  servicesBn: string;
  servicesEn: string;
  hoursBn: string;
  hoursEn: string;
  imageUrl: string;
  hotline: string;
  dutyPhone: string;
  dutyOfficerBn: string;
  dutyOfficerEn: string;
  lat: string;
  lng: string;
  contributorName: string;
  contributorContact: string;
};

const emptyForm = (): FormFields => ({
  category: "",
  nameBn: "",
  nameEn: "",
  addressBn: "",
  addressEn: "",
  descriptionBn: "",
  descriptionEn: "",
  servicesBn: "",
  servicesEn: "",
  hoursBn: "",
  hoursEn: "",
  imageUrl: "",
  hotline: "",
  dutyPhone: "",
  dutyOfficerBn: "",
  dutyOfficerEn: "",
  lat: "",
  lng: "",
  contributorName: "",
  contributorContact: "",
});

const inputClass = cn(
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm",
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
  "dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
);

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400";

export function ContributeDataFab() {
  const { t } = useI18n();
  const router = useRouter();
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [successFromApi, setSuccessFromApi] = useState(false);
  const [mapPickOpen, setMapPickOpen] = useState(false);
  const [locationGeoHint, setLocationGeoHint] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setSuccess(false);
    setCopyFallback(null);
    setSuccessFromApi(false);
    setMapPickOpen(false);
    setLocationGeoHint(null);
    setForm(emptyForm());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mapPickOpen) {
        setMapPickOpen(false);
        return;
      }
      close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, mapPickOpen]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("select, input, button")?.focus();
  }, [open]);

  const setField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const setCoords = (lat: number, lng: number) => {
    setForm((f) => ({
      ...f,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
    setError(null);
    setLocationGeoHint(null);
  };

  const requestGpsLocation = () => {
    setLocationGeoHint(null);
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationGeoHint(t("contribute.locationGeoUnsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === 1) setLocationGeoHint(t("contribute.locationGeoDenied"));
        else setLocationGeoHint(t("contribute.locationGeoError"));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

  const parseOptionalCoord = (raw: string): number | undefined => {
    const s = raw.trim();
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };
  const mapPickLat = parseOptionalCoord(form.lat);
  const mapPickLng = parseOptionalCoord(form.lng);

  const buildApiBody = (): CreatePlacePayload | null => {
    if (!form.category) return null;
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    return {
      category: form.category,
      name: { bn: form.nameBn.trim(), en: form.nameEn.trim() },
      address: { bn: form.addressBn.trim(), en: form.addressEn.trim() },
      description: { bn: form.descriptionBn.trim(), en: form.descriptionEn.trim() },
      services: { bn: form.servicesBn.trim(), en: form.servicesEn.trim() },
      hours: { bn: form.hoursBn.trim(), en: form.hoursEn.trim() },
      image: form.imageUrl.trim() || undefined,
      hotline: form.hotline.trim() || undefined,
      dutyPhone: form.dutyPhone.trim() || undefined,
      dutyOfficer: {
        bn: form.dutyOfficerBn.trim(),
        en: form.dutyOfficerEn.trim(),
      },
      lat,
      lng,
      contributor: {
        name: form.contributorName.trim() || undefined,
        contact: form.contributorContact.trim() || undefined,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      setError(t("contribute.validationCategory"));
      return;
    }
    if (!form.nameBn.trim() && !form.nameEn.trim()) {
      setError(t("contribute.validationName"));
      return;
    }
    const latStr = form.lat.trim();
    const lngStr = form.lng.trim();
    if (!latStr || !lngStr) {
      setError(t("contribute.validationLocation"));
      return;
    }
    const latN = Number(latStr);
    const lngN = Number(lngStr);
    if (Number.isNaN(latN) || Number.isNaN(lngN)) {
      setError(t("contribute.validationLocation"));
      return;
    }
    if (latN < -90 || latN > 90 || lngN < -180 || lngN > 180) {
      setError(t("contribute.validationLocationRange"));
      return;
    }
    const body = buildApiBody();
    if (!body) {
      setError(t("contribute.validationCategory"));
      return;
    }

    if (getPublicApiBaseUrl()) {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await submitPlaceToApi(body);
        if (result.ok) {
          setSuccess(true);
          setSuccessFromApi(true);
          setCopyFallback(null);
          requestMapPlacesRefresh();
          router.refresh();
          return;
        }
        setError(`${t("contribute.submitError")} ${result.message}`);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const text = JSON.stringify(
      { submittedAt: new Date().toISOString(), ...body },
      null,
      2,
    );
    setSuccessFromApi(false);
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(true);
      setCopyFallback(null);
    } catch {
      setSuccess(true);
      setCopyFallback(text);
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          "fixed z-[56]",
          "left-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:left-auto lg:right-6 lg:bottom-8",
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 260, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex flex-col items-center gap-1 lg:items-end"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSuccess(false);
              setSuccessFromApi(false);
              setCopyFallback(null);
              setError(null);
            }}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={dialogId}
            title={t("contribute.fabHint")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-3 text-left shadow-lg",
              "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white",
              "ring-2 ring-white/25 dark:ring-emerald-400/20",
              focusRing,
              "[-webkit-tap-highlight-color:transparent]",
            )}
          >
            <CirclePlus className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="max-w-[9.5rem] text-sm font-semibold leading-tight sm:max-w-none">
              {t("contribute.fabLabel")}
            </span>
          </button>
          <p className="hidden max-w-[11rem] text-center text-[10px] font-medium leading-snug text-slate-600 dark:text-slate-400 sm:block lg:text-right">
            {t("contribute.fabHint")}
          </p>
        </motion.div>
      </motion.div>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label={t("contribute.close")}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            onClick={close}
          />
          <div
            ref={panelRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "relative z-10 flex max-h-[min(92dvh,880px)] w-full max-w-2xl flex-col",
              "rounded-t-3xl border border-slate-200 bg-background shadow-2xl dark:border-slate-700 sm:rounded-3xl",
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <h2
                  id={titleId}
                  className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50"
                >
                  {t("contribute.dialogTitle")}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {t("contribute.dialogIntro")}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className={cn(
                  "rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                  focusRing,
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {success ? (
                <div className="space-y-4 py-2">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    {t("contribute.successTitle")}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {copyFallback
                      ? t("contribute.copyFailed")
                      : successFromApi
                        ? t("contribute.successBody")
                        : t("contribute.successBodyCopyFallback")}
                  </p>
                  {copyFallback ? (
                    <textarea
                      readOnly
                      className={cn(inputClass, "min-h-[200px] font-mono text-xs")}
                      value={copyFallback}
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={close}
                    className={cn(
                      "rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700",
                      focusRing,
                    )}
                  >
                    {t("contribute.done")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 pb-2">
                  {error ? (
                    <p
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
                      role="alert"
                    >
                      {error}
                    </p>
                  ) : null}

                  <div>
                    <label htmlFor="contrib-category" className={labelClass}>
                      {t("contribute.category")} *
                    </label>
                    <select
                      id="contrib-category"
                      required
                      value={form.category}
                      onChange={(e) =>
                        setField("category", e.target.value as MapPlaceCategory | "")
                      }
                      className={cn(inputClass, "cursor-pointer")}
                    >
                      <option value="">{t("contribute.categoryPlaceholder")}</option>
                      {MAP_FILTER_GROUP_ORDER.filter(
                        (g): g is Exclude<MapFilterGroupId, "all"> => g !== "all",
                      ).map((groupId) => (
                        <optgroup
                          key={groupId}
                          label={t(`pages.map.filterGroups.${groupId}`)}
                        >
                          {CATEGORIES_BY_GROUP[groupId].map((c) => (
                            <option key={c} value={c}>
                              {t(`pages.map.filters.${c}`)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                    <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                      {t("contribute.sectionNames")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contrib-name-bn" className={labelClass}>
                          {t("contribute.nameBn")}
                        </label>
                        <input
                          id="contrib-name-bn"
                          value={form.nameBn}
                          onChange={(e) => setField("nameBn", e.target.value)}
                          className={inputClass}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-name-en" className={labelClass}>
                          {t("contribute.nameEn")}
                        </label>
                        <input
                          id="contrib-name-en"
                          value={form.nameEn}
                          onChange={(e) => setField("nameEn", e.target.value)}
                          className={inputClass}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                    <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                      {t("contribute.sectionAddress")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="contrib-addr-bn" className={labelClass}>
                          {t("contribute.addressBn")}
                        </label>
                        <input
                          id="contrib-addr-bn"
                          value={form.addressBn}
                          onChange={(e) => setField("addressBn", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="contrib-addr-en" className={labelClass}>
                          {t("contribute.addressEn")}
                        </label>
                        <input
                          id="contrib-addr-en"
                          value={form.addressEn}
                          onChange={(e) => setField("addressEn", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                    <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                      {t("contribute.sectionDetails")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="contrib-desc-bn" className={labelClass}>
                          {t("contribute.descriptionBn")}
                        </label>
                        <textarea
                          id="contrib-desc-bn"
                          rows={3}
                          value={form.descriptionBn}
                          onChange={(e) => setField("descriptionBn", e.target.value)}
                          className={cn(inputClass, "resize-y")}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="contrib-desc-en" className={labelClass}>
                          {t("contribute.descriptionEn")}
                        </label>
                        <textarea
                          id="contrib-desc-en"
                          rows={3}
                          value={form.descriptionEn}
                          onChange={(e) => setField("descriptionEn", e.target.value)}
                          className={cn(inputClass, "resize-y")}
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-svc-bn" className={labelClass}>
                          {t("contribute.servicesBn")}
                        </label>
                        <textarea
                          id="contrib-svc-bn"
                          rows={2}
                          value={form.servicesBn}
                          onChange={(e) => setField("servicesBn", e.target.value)}
                          className={cn(inputClass, "resize-y")}
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-svc-en" className={labelClass}>
                          {t("contribute.servicesEn")}
                        </label>
                        <textarea
                          id="contrib-svc-en"
                          rows={2}
                          value={form.servicesEn}
                          onChange={(e) => setField("servicesEn", e.target.value)}
                          className={cn(inputClass, "resize-y")}
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-hours-bn" className={labelClass}>
                          {t("contribute.hoursBn")}
                        </label>
                        <input
                          id="contrib-hours-bn"
                          value={form.hoursBn}
                          onChange={(e) => setField("hoursBn", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-hours-en" className={labelClass}>
                          {t("contribute.hoursEn")}
                        </label>
                        <input
                          id="contrib-hours-en"
                          value={form.hoursEn}
                          onChange={(e) => setField("hoursEn", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                    <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                      {t("contribute.sectionContact")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contrib-hotline" className={labelClass}>
                          {t("contribute.hotline")}
                        </label>
                        <input
                          id="contrib-hotline"
                          value={form.hotline}
                          onChange={(e) => setField("hotline", e.target.value)}
                          className={inputClass}
                          inputMode="tel"
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-duty" className={labelClass}>
                          {t("contribute.dutyPhone")}
                        </label>
                        <input
                          id="contrib-duty"
                          value={form.dutyPhone}
                          onChange={(e) => setField("dutyPhone", e.target.value)}
                          className={inputClass}
                          inputMode="tel"
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-officer-bn" className={labelClass}>
                          {t("contribute.dutyOfficerBn")}
                        </label>
                        <input
                          id="contrib-officer-bn"
                          value={form.dutyOfficerBn}
                          onChange={(e) => setField("dutyOfficerBn", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-officer-en" className={labelClass}>
                          {t("contribute.dutyOfficerEn")}
                        </label>
                        <input
                          id="contrib-officer-en"
                          value={form.dutyOfficerEn}
                          onChange={(e) => setField("dutyOfficerEn", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="contrib-image" className={labelClass}>
                          {t("contribute.imageUrl")}
                        </label>
                        <input
                          id="contrib-image"
                          type="url"
                          value={form.imageUrl}
                          onChange={(e) => setField("imageUrl", e.target.value)}
                          className={inputClass}
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                    <legend className="sr-only">{t("contribute.sectionLocation")}</legend>
                    <p
                      className={cn(
                        "text-sm font-semibold text-amber-900/90 dark:text-amber-100/90",
                      )}
                    >
                      {t("contribute.locationHeading")}{" "}
                      <span className="text-red-600 dark:text-red-400" aria-hidden>
                        *
                      </span>
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={requestGpsLocation}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold",
                          "bg-emerald-100 text-emerald-900 hover:bg-emerald-200/90",
                          "dark:bg-emerald-950/60 dark:text-emerald-100 dark:hover:bg-emerald-900/50",
                          focusRing,
                        )}
                      >
                        <Crosshair className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                        {t("contribute.locationGps")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLocationGeoHint(null);
                          setMapPickOpen(true);
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold",
                          "bg-sky-100 text-sky-900 hover:bg-sky-200/90",
                          "dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-900/45",
                          focusRing,
                        )}
                      >
                        <MapPin className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                        {t("contribute.locationFromMap")}
                      </button>
                    </div>
                    {locationGeoHint ? (
                      <p
                        className="text-xs font-medium text-amber-800 dark:text-amber-200/90"
                        role="status"
                      >
                        {locationGeoHint}
                      </p>
                    ) : null}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        id="contrib-lat"
                        value={form.lat}
                        onChange={(e) => setField("lat", e.target.value)}
                        className={cn(inputClass, "rounded-full")}
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder={t("contribute.locationLatPlaceholder")}
                        aria-label={t("contribute.lat")}
                      />
                      <input
                        id="contrib-lng"
                        value={form.lng}
                        onChange={(e) => setField("lng", e.target.value)}
                        className={cn(inputClass, "rounded-full")}
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder={t("contribute.locationLngPlaceholder")}
                        aria-label={t("contribute.lng")}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                    <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                      {t("contribute.sectionContributor")}
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contrib-you" className={labelClass}>
                          {t("contribute.contributorName")}
                        </label>
                        <input
                          id="contrib-you"
                          value={form.contributorName}
                          onChange={(e) => setField("contributorName", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="contrib-you-contact" className={labelClass}>
                          {t("contribute.contributorContact")}
                        </label>
                        <input
                          id="contrib-you-contact"
                          value={form.contributorContact}
                          onChange={(e) => setField("contributorContact", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60",
                        focusRing,
                      )}
                    >
                      {isSubmitting ? t("contribute.submitting") : t("contribute.submit")}
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className={cn(
                        "rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
                        focusRing,
                      )}
                    >
                      {t("contribute.cancel")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <ContributeMapPickModal
        open={mapPickOpen}
        onClose={() => setMapPickOpen(false)}
        initialLat={mapPickLat}
        initialLng={mapPickLng}
        strings={{
          title: t("contribute.locationMapTitle"),
          hint: t("contribute.locationMapHint"),
          confirm: t("contribute.locationMapConfirm"),
          cancel: t("contribute.locationMapCancel"),
          close: t("contribute.close"),
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }}
        onConfirm={(lat, lng) => setCoords(lat, lng)}
      />
    </>
  );
}
