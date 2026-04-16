"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/dummy/blood-donors";
import { submitBloodRequest } from "@/lib/blood-api";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm",
  "placeholder:text-slate-400 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20",
  "dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-rose-500",
);

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400";

const URGENCY_VALUES = ["Emergency", "High", "Low"] as const;

type EmergencyRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
};

export function EmergencyRequestModal({
  open,
  onClose,
  onSubmitted,
}: EmergencyRequestModalProps) {
  const { t } = useI18n();
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const panelRef = useRef<HTMLDivElement>(null);

  const [patientName, setPatientName] = useState("");
  const [hospital, setHospital] = useState("");
  const [units, setUnits] = useState("");
  const [contact, setContact] = useState("");
  const [deadline, setDeadline] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [urgency, setUrgency] = useState<string>("Emergency");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback(() => {
    setPatientName("");
    setHospital("");
    setUnits("");
    setContact("");
    setDeadline("");
    setBloodGroup("O+");
    setUrgency("Emergency");
    setError(null);
    setSuccess(false);
    setSubmitting(false);
  }, []);

  const close = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (
      !patientName.trim() ||
      !hospital.trim() ||
      !units.trim() ||
      !contact.trim() ||
      !deadline.trim()
    ) {
      setError(t("pages.bloodBank.formErrorRequired"));
      return;
    }
    const needed = new Date(deadline);
    if (Number.isNaN(needed.getTime())) {
      setError(t("pages.bloodBank.formErrorDeadline"));
      return;
    }

    setSubmitting(true);
    const result = await submitBloodRequest({
      patientName: patientName.trim(),
      hospitalName: hospital.trim(),
      bloodGroup,
      unitsNeeded: units.trim(),
      contactPhone: contact.trim(),
      neededBy: needed.toISOString(),
      urgency,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(true);
    onSubmitted?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t("pages.bloodBank.modalClose")}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={close}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-[221] flex max-h-[min(92vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white shadow-2xl",
          "sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950",
        )}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-rose-950 px-4 py-4 text-white dark:border-slate-800 dark:bg-rose-950">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 id={titleId} className="text-base font-semibold leading-snug">
                {t("pages.bloodBank.modalTitle")}
              </h2>
              <p className="mt-0.5 text-xs text-rose-100/90">
                {t("pages.bloodBank.modalSubtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className={cn(
              "rounded-lg p-2 text-rose-100 transition hover:bg-white/10 hover:text-white",
              focusRing,
            )}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-5 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                {t("pages.bloodBank.formSuccess")}
              </p>
              <button
                type="button"
                onClick={close}
                className={cn(
                  "mt-4 w-full rounded-xl bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-900",
                  focusRing,
                )}
              >
                {t("pages.bloodBank.modalClose")}
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => void submit(e)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor={`${dialogId}-blood`} className={labelClass}>
                    {t("pages.bloodBank.fieldBloodGroup")}
                  </label>
                  <div className="relative">
                    <select
                      id={`${dialogId}-blood`}
                      className={cn(inputClass, "pr-10")}
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    >
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ▾
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor={`${dialogId}-urgency`} className={labelClass}>
                    {t("pages.bloodBank.fieldUrgency")}
                  </label>
                  <div className="relative">
                    <select
                      id={`${dialogId}-urgency`}
                      className={cn(inputClass, "pr-10")}
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                    >
                      {URGENCY_VALUES.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ▾
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor={`${dialogId}-patient`} className={labelClass}>
                  {t("pages.bloodBank.fieldPatient")}
                </label>
                <input
                  id={`${dialogId}-patient`}
                  className={inputClass}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor={`${dialogId}-hospital`} className={labelClass}>
                  {t("pages.bloodBank.fieldHospital")}
                </label>
                <input
                  id={`${dialogId}-hospital`}
                  className={inputClass}
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  autoComplete="organization"
                />
              </div>
              <div>
                <label htmlFor={`${dialogId}-units`} className={labelClass}>
                  {t("pages.bloodBank.fieldUnits")}
                </label>
                <input
                  id={`${dialogId}-units`}
                  className={inputClass}
                  inputMode="numeric"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`${dialogId}-contact`} className={labelClass}>
                  {t("pages.bloodBank.fieldContact")}
                </label>
                <input
                  id={`${dialogId}-contact`}
                  className={inputClass}
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor={`${dialogId}-deadline`} className={labelClass}>
                  {t("pages.bloodBank.fieldDeadline")}
                </label>
                <input
                  id={`${dialogId}-deadline`}
                  className={inputClass}
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              {error ? (
                <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
              ) : null}
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={close}
                  disabled={submitting}
                  className={cn(
                    "order-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:order-1 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                    focusRing,
                    submitting && "pointer-events-none opacity-50",
                  )}
                >
                  {t("pages.bloodBank.formCancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "order-1 rounded-xl bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-900 sm:order-2",
                    focusRing,
                    submitting && "pointer-events-none opacity-70",
                  )}
                >
                  {submitting ? t("pages.bloodBank.submitting") : t("pages.bloodBank.formSubmit")}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
