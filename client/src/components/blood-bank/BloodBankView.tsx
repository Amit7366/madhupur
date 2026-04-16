"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Droplet, MapPin, Siren } from "lucide-react";
import { EmergencyRequestModal } from "@/components/blood-bank/EmergencyRequestModal";
import { PageIntro } from "@/components/content/PageIntro";
import {
  BLOOD_BANK_UNIONS,
  BLOOD_DONORS,
  BLOOD_GROUPS,
  type BloodBankUnion,
  type BloodGroup,
  coolingDaysRemaining,
  donorLine,
  unionLabel,
} from "@/lib/dummy/blood-donors";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm font-medium text-slate-900 shadow-sm",
  "focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15",
  "dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-rose-500",
);

const listParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 26, stiffness: 320 },
  },
};

function DonorCard({
  name,
  bloodGroup,
  locationText,
  unionText,
  available,
  coolingDays,
}: {
  name: string;
  bloodGroup: BloodGroup;
  locationText: string;
  unionText: string;
  available: boolean;
  coolingDays: number | null;
}) {
  const { t } = useI18n();

  return (
    <motion.article
      layout
      variants={listItem}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm",
        "dark:border-slate-700 dark:bg-slate-900/80",
      )}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 bg-rose-800/90 dark:bg-rose-700"
        aria-hidden
      />
      <div className="p-4 pl-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-900 dark:bg-rose-950/60 dark:text-rose-100">
                <Droplet className="h-3.5 w-3.5" aria-hidden />
                {bloodGroup}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{unionText}</span>
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {available ? (
              <motion.span
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm"
                animate={{
                  scale: [1, 1.06, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(5, 150, 105, 0.35)",
                    "0 0 0 8px rgba(5, 150, 105, 0)",
                    "0 0 0 0 rgba(5, 150, 105, 0)",
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                {t("pages.bloodBank.badgeLive")}
              </motion.span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                <Activity className="h-3 w-3" aria-hidden />
                {t("pages.bloodBank.badgeCooling")}
              </span>
            )}
            {!available && coolingDays !== null ? (
              <span className="max-w-[10rem] text-right text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {t("pages.bloodBank.coolingHint").replace(
                  "{{days}}",
                  String(coolingDays),
                )}
              </span>
            ) : null}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {locationText}
        </p>
      </div>
    </motion.article>
  );
}

export function BloodBankView() {
  const { locale, t } = useI18n();
  const [bloodFilter, setBloodFilter] = useState<string>("all");
  const [unionFilter, setUnionFilter] = useState<string>("all");
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const filtered = useMemo(() => {
    return BLOOD_DONORS.filter((d) => {
      if (bloodFilter !== "all" && d.bloodGroup !== bloodFilter) return false;
      if (unionFilter !== "all" && d.unionId !== unionFilter) return false;
      return true;
    });
  }, [bloodFilter, unionFilter]);

  const unionById = useMemo(() => {
    const m = new Map<string, BloodBankUnion>();
    for (const u of BLOOD_BANK_UNIONS) m.set(u.id, u);
    return m;
  }, []);

  return (
    <>
      <PageIntro
        title={t("pages.bloodBank.title")}
        description={t("pages.bloodBank.description")}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("pages.bloodBank.liveRegistry")}
          </p>
          <button
            type="button"
            onClick={() => setEmergencyOpen(true)}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-800 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-900/15 transition hover:bg-rose-900 sm:w-auto",
              focusRing,
            )}
          >
            <Siren className="h-4 w-4 shrink-0" aria-hidden />
            {t("pages.bloodBank.emergencyCta")}
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="blood-bank-group"
              className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              {t("pages.bloodBank.filterBlood")}
            </label>
            <div className="relative">
              <select
                id="blood-bank-group"
                className={selectClass}
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
              >
                <option value="all">{t("pages.filterAll")}</option>
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
          <div>
            <label
              htmlFor="blood-bank-union"
              className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              {t("pages.bloodBank.filterUnion")}
            </label>
            <div className="relative">
              <select
                id="blood-bank-union"
                className={selectClass}
                value={unionFilter}
                onChange={(e) => setUnionFilter(e.target.value)}
              >
                <option value="all">{t("pages.filterAll")}</option>
                {BLOOD_BANK_UNIONS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {unionLabel(u, locale)}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {t("pages.bloodBank.resultsCount").replace(
          "{{count}}",
          String(filtered.length),
        )}
      </p>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50"
          >
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {t("pages.bloodBank.emptyTitle")}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {t("pages.bloodBank.emptyDescription")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="grid gap-4 sm:grid-cols-2"
            variants={listParent}
            initial="hidden"
            animate="show"
          >
            {filtered.map((d) => {
              const u = unionById.get(d.unionId);
              const unionText = u ? unionLabel(u, locale) : d.unionId;
              const available = d.status === "available";
              const coolingDays =
                d.status === "cooling" && d.lastDonationIso
                  ? coolingDaysRemaining(d.lastDonationIso)
                  : null;
              return (
                <DonorCard
                  key={d.id}
                  name={donorLine(d.name, locale)}
                  bloodGroup={d.bloodGroup}
                  locationText={donorLine(d.location, locale)}
                  unionText={unionText}
                  available={available}
                  coolingDays={coolingDays}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
        {t("pages.bloodBank.disclaimer")}
      </p>

      <EmergencyRequestModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </>
  );
}
