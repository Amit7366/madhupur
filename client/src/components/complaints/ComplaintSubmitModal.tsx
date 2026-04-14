"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Crosshair, ImagePlus, MapPin, X } from "lucide-react";
import { ContributeMapPickModal } from "@/components/contribute/ContributeMapPickModal";
import {
  requestComplaintsRefresh,
  submitComplaintFormData,
} from "@/lib/complaint-api";
import { MAP_DEFAULT_CENTER } from "@/lib/dummy/map-places";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm",
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
  "dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
);

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400";

const MAX_FILES = 10;
const MAX_BYTES = 5 * 1024 * 1024;

type ComplaintSubmitModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ComplaintSubmitModal({ open, onClose }: ComplaintSubmitModalProps) {
  const { t } = useI18n();
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mapPickOpen, setMapPickOpen] = useState(false);
  const [locationGeoHint, setLocationGeoHint] = useState<string | null>(null);

  const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => {
      for (const u of previewUrls) URL.revokeObjectURL(u);
    };
  }, [previewUrls]);

  const reset = useCallback(() => {
    setTitleBn("");
    setTitleEn("");
    setDescriptionBn("");
    setDescriptionEn("");
    setLat("");
    setLng("");
    setNameBn("");
    setNameEn("");
    setPhone("");
    setFiles([]);
    setError(null);
    setSuccess(false);
    setSubmitting(false);
    setMapPickOpen(false);
    setLocationGeoHint(null);
  }, []);

  const close = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

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

  const setCoords = (la: number, ln: number) => {
    setLat(la.toFixed(6));
    setLng(ln.toFixed(6));
    setLocationGeoHint(null);
    setError(null);
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
  const mapPickLat = parseOptionalCoord(lat);
  const mapPickLng = parseOptionalCoord(lng);

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const next: File[] = [...files];
      for (const f of list) {
        if (!f.type.startsWith("image/")) {
          setError(t("pages.complaints.form.validationImages"));
          return;
        }
        if (f.size > MAX_BYTES) {
          setError(t("pages.complaints.form.validationFileSize"));
          return;
        }
        if (next.length >= MAX_FILES) break;
        next.push(f);
      }
      setError(null);
      setFiles(next);
    },
    [files, t],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const onSubmit = useCallback(async () => {
    setError(null);
    if (!titleBn.trim() && !titleEn.trim()) {
      setError(t("pages.complaints.form.validationTitle"));
      return;
    }
    if (!descriptionBn.trim() && !descriptionEn.trim()) {
      setError(t("pages.complaints.form.validationDescription"));
      return;
    }
    const latStr = lat.trim();
    const lngStr = lng.trim();
    if (!latStr || !lngStr) {
      setError(t("pages.complaints.form.validationLocation"));
      return;
    }
    const latN = Number(latStr);
    const lngN = Number(lngStr);
    if (Number.isNaN(latN) || Number.isNaN(lngN)) {
      setError(t("pages.complaints.form.validationLocation"));
      return;
    }
    if (latN < -90 || latN > 90 || lngN < -180 || lngN > 180) {
      setError(t("pages.complaints.form.validationLocationRange"));
      return;
    }
    if (!nameBn.trim() && !nameEn.trim()) {
      setError(t("pages.complaints.form.validationName"));
      return;
    }
    const p = phone.trim();
    if (p.length < 5) {
      setError(t("pages.complaints.form.validationPhone"));
      return;
    }

    const fd = new FormData();
    fd.append("titleBn", titleBn.trim());
    fd.append("titleEn", titleEn.trim());
    fd.append("descriptionBn", descriptionBn.trim());
    fd.append("descriptionEn", descriptionEn.trim());
    fd.append("lat", String(latN));
    fd.append("lng", String(lngN));
    fd.append("nameBn", nameBn.trim());
    fd.append("nameEn", nameEn.trim());
    fd.append("phone", p);
    for (const f of files) {
      fd.append("images", f);
    }

    setSubmitting(true);
    const result = await submitComplaintFormData(fd);
    setSubmitting(false);

    if (!result.ok) {
      const msg =
        result.status === 0
          ? t("pages.complaints.form.errorApi")
          : result.message || t("pages.complaints.form.errorUpload");
      setError(msg);
      return;
    }

    setSuccess(true);
    requestComplaintsRefresh();
  }, [
    titleBn,
    titleEn,
    descriptionBn,
    descriptionEn,
    lat,
    lng,
    nameBn,
    nameEn,
    phone,
    files,
    t,
  ]);

  const mapPickStrings = {
    title: t("pages.complaints.mapPick.title"),
    hint: t("pages.complaints.mapPick.hint"),
    confirm: t("pages.complaints.mapPick.confirm"),
    cancel: t("pages.complaints.mapPick.cancel"),
    close: t("pages.complaints.mapPick.close"),
    attribution: t("pages.complaints.mapPick.attribution"),
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px]"
        aria-hidden
        onClick={() => (mapPickOpen ? setMapPickOpen(false) : close())}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-1/2 z-[201] w-[calc(100%-2rem)] max-w-2xl max-h-[min(92vh,52rem)] -translate-x-1/2 -translate-y-1/2",
          "flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-background shadow-2xl dark:border-slate-600/80 dark:bg-slate-950",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 px-5 py-4 dark:border-slate-700/70">
          <h2 id={titleId} className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {success ? t("pages.complaints.form.successTitle") : t("pages.complaints.form.title")}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label={t("pages.complaints.form.close")}
            className={cn(
              "flex size-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
              focusRing,
            )}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {success ? (
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t("pages.complaints.form.successBody")}
            </p>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("pages.complaints.form.intro")}
              </p>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-100">
                  {error}
                </p>
              ) : null}

              <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                  {t("pages.complaints.form.sectionTitle")}
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor={`${dialogId}-tb`}>
                      {t("pages.complaints.form.titleBn")}
                    </label>
                    <input
                      id={`${dialogId}-tb`}
                      className={inputClass}
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${dialogId}-te`}>
                      {t("pages.complaints.form.titleEn")}
                    </label>
                    <input
                      id={`${dialogId}-te`}
                      className={inputClass}
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-3 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-700/80">
                <legend className="px-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                  {t("pages.complaints.form.sectionDescription")}
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor={`${dialogId}-db`}>
                      {t("pages.complaints.form.descriptionBn")}
                    </label>
                    <textarea
                      id={`${dialogId}-db`}
                      className={cn(inputClass, "min-h-[88px] resize-y")}
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${dialogId}-de`}>
                      {t("pages.complaints.form.descriptionEn")}
                    </label>
                    <textarea
                      id={`${dialogId}-de`}
                      className={cn(inputClass, "min-h-[88px] resize-y")}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
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
                      "bg-emerald-600 text-white hover:bg-emerald-700",
                      "dark:bg-emerald-800 dark:text-emerald-50 dark:hover:bg-emerald-700",
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
                      "bg-sky-600 text-white hover:bg-sky-700",
                      "dark:bg-sky-800 dark:text-sky-50 dark:hover:bg-sky-700",
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
                    id={`${dialogId}-lat`}
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className={cn(inputClass, "rounded-full")}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={t("contribute.locationLatPlaceholder")}
                    aria-label={t("contribute.lat")}
                  />
                  <input
                    id={`${dialogId}-lng`}
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
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
                  {t("pages.complaints.form.sectionReporter")}
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor={`${dialogId}-nb`}>
                      {t("pages.complaints.form.reporterNameBn")}
                    </label>
                    <input
                      id={`${dialogId}-nb`}
                      className={inputClass}
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${dialogId}-ne`}>
                      {t("pages.complaints.form.reporterNameEn")}
                    </label>
                    <input
                      id={`${dialogId}-ne`}
                      className={inputClass}
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor={`${dialogId}-ph`}>
                      {t("pages.complaints.form.fieldPhone")}
                    </label>
                    <input
                      id={`${dialogId}-ph`}
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </fieldset>

              <div>
                <p className={labelClass}>{t("pages.complaints.form.imagesLabel")}</p>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-white/[0.03] dark:hover:border-indigo-500/50 dark:hover:bg-indigo-950/20",
                    focusRing,
                  )}
                >
                  <ImagePlus className="mx-auto size-8 text-slate-400" aria-hidden />
                  <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("pages.complaints.form.imagesHint")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("pages.complaints.form.imagesAdd")}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const l = e.target.files;
                    if (l?.length) addFiles(l);
                    e.target.value = "";
                  }}
                />
                {files.length > 0 ? (
                  <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {files.map((f, i) => (
                      <li
                        key={`${f.name}-${i}-${f.lastModified}`}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrls[i]}
                          alt=""
                          className="size-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles((prev) => prev.filter((_, j) => j !== i));
                          }}
                          className={cn(
                            "absolute right-1 top-1 flex size-7 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 transition group-hover:opacity-100",
                            focusRing,
                          )}
                          aria-label={t("pages.complaints.form.removeImage")}
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {!success ? (
          <div className="flex shrink-0 gap-2 border-t border-slate-200/90 px-5 py-4 dark:border-slate-700/70">
            <button
              type="button"
              onClick={close}
              className={cn(
                "flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100",
                focusRing,
              )}
            >
              {t("pages.complaints.form.cancel")}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void onSubmit()}
              className={cn(
                "flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400",
                focusRing,
              )}
            >
              {submitting ? "…" : t("pages.complaints.form.submit")}
            </button>
          </div>
        ) : (
          <div className="border-t border-slate-200/90 px-5 py-4 dark:border-slate-700/70">
            <button
              type="button"
              onClick={close}
              className={cn(
                "w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500",
                focusRing,
              )}
            >
              {t("pages.complaints.form.close")}
            </button>
          </div>
        )}
      </div>

      <ContributeMapPickModal
        open={mapPickOpen}
        onClose={() => setMapPickOpen(false)}
        initialLat={mapPickLat ?? MAP_DEFAULT_CENTER.lat}
        initialLng={mapPickLng ?? MAP_DEFAULT_CENTER.lng}
        strings={mapPickStrings}
        stackClassName="z-[310]"
        onConfirm={(la, ln) => {
          setCoords(la, ln);
          setMapPickOpen(false);
        }}
      />
    </>
  );
}
