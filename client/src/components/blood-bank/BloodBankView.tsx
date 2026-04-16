"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ClipboardList, Droplet, MapPin, Siren, Users } from "lucide-react";
import { EmergencyRequestModal } from "@/components/blood-bank/EmergencyRequestModal";
import { PageIntro } from "@/components/content/PageIntro";
import {
  BLOOD_BANK_REFRESH_EVENT,
  fetchBloodDonorsFromApi,
  fetchBloodRequestsFromApi,
  type BloodDonorApiRow,
  type BloodRequestApiRow,
  requestBloodBankRefresh,
} from "@/lib/blood-api";
import {
  BLOOD_BANK_UNIONS,
  BLOOD_GROUPS,
  type BloodBankUnion,
  type BloodGroup,
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

function DonorCardApi({
  row,
  unionText,
  locale,
  t,
}: {
  row: BloodDonorApiRow;
  unionText: string;
  locale: string;
  t: (path: string) => string;
}) {
  const contactLine = useMemo(() => {
    if (row.contactHidden) return null;
    const parts: string[] = [];
    if (row.user.phone) parts.push(row.user.phone);
    if (row.user.email) parts.push(row.user.email);
    return parts.length ? parts.join(" · ") : null;
  }, [row.contactHidden, row.user.email, row.user.phone]);

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
              {row.user.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-900 dark:bg-rose-950/60 dark:text-rose-100">
                <Droplet className="h-3.5 w-3.5" aria-hidden />
                {row.bloodGroup}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{unionText}</span>
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
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
          </div>
        </div>
        {contactLine ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {contactLine}
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-500">
            {t("pages.bloodBank.contactHiddenHint")}
          </p>
        )}
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {locale === "bn" ? `ID: ${row.locationId}` : `Area: ${row.locationId}`}
        </p>
      </div>
    </motion.article>
  );
}

function RequestCard({
  row,
  locale,
  t,
}: {
  row: BloodRequestApiRow;
  locale: string;
  t: (path: string) => string;
}) {
  const neededLabel = useMemo(() => {
    try {
      const d = new Date(row.neededBy);
      return d.toLocaleString(locale === "bn" ? "bn-BD" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return row.neededBy;
    }
  }, [locale, row.neededBy]);

  const urgencyKey = `pages.bloodBank.urgency.${row.urgency}`;
  const statusKey = `pages.bloodBank.status.${row.status}`;
  const urgencyLabel = t(urgencyKey) !== urgencyKey ? t(urgencyKey) : row.urgency;
  const statusLabel = t(statusKey) !== statusKey ? t(statusKey) : row.status;

  return (
    <motion.article
      layout
      variants={listItem}
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-300">
            {row.bloodGroup}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
            {row.patientName}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            row.status === "Open"
              ? "bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100"
              : row.status === "Fulfilled"
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100"
                : "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
          )}
        >
          {statusLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{row.hospitalName}</p>
      <dl className="mt-3 grid gap-1.5 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-slate-500 dark:text-slate-500">
            {t("pages.bloodBank.requestUnits")}
          </dt>
          <dd>{row.unitsNeeded}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-slate-500 dark:text-slate-500">
            {t("pages.bloodBank.requestNeededBy")}
          </dt>
          <dd>{neededLabel}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-slate-500 dark:text-slate-500">
            {t("pages.bloodBank.requestUrgency")}
          </dt>
          <dd>{urgencyLabel}</dd>
        </div>
        {row.requester.phone ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-slate-500 dark:text-slate-500">
              {t("pages.bloodBank.requestContact")}
            </dt>
            <dd>{row.requester.phone}</dd>
          </div>
        ) : null}
      </dl>
    </motion.article>
  );
}

type TabId = "donors" | "requests";

export function BloodBankView() {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<TabId>("donors");
  const [bloodFilter, setBloodFilter] = useState<string>("all");
  const [unionFilter, setUnionFilter] = useState<string>("all");
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const [donors, setDonors] = useState<BloodDonorApiRow[] | null>(null);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [requests, setRequests] = useState<BloodRequestApiRow[] | null>(null);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const unionById = useMemo(() => {
    const m = new Map<string, BloodBankUnion>();
    for (const u of BLOOD_BANK_UNIONS) m.set(u.id, u);
    return m;
  }, []);

  const loadDonors = useCallback(async () => {
    setDonorsLoading(true);
    const q =
      bloodFilter === "all" && unionFilter === "all"
        ? {}
        : {
            ...(bloodFilter !== "all" ? { bloodGroup: bloodFilter } : {}),
            ...(unionFilter !== "all" ? { locationId: unionFilter } : {}),
          };
    const data = await fetchBloodDonorsFromApi(q);
    setDonors(data);
    setDonorsLoading(false);
  }, [bloodFilter, unionFilter]);

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    const data = await fetchBloodRequestsFromApi({ status: "Open", limit: 100 });
    setRequests(data);
    setRequestsLoading(false);
  }, []);

  useEffect(() => {
    void loadDonors();
  }, [loadDonors]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    const onRefresh = () => {
      void loadDonors();
      void loadRequests();
    };
    window.addEventListener(BLOOD_BANK_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(BLOOD_BANK_REFRESH_EVENT, onRefresh);
  }, [loadDonors, loadRequests]);

  const filteredDonorCount = donors?.length ?? 0;

  return (
    <>
      <PageIntro
        title={t("pages.bloodBank.title")}
        description={t("pages.bloodBank.description")}
      />

      <div
        className="flex gap-1 rounded-2xl border border-slate-200/90 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-900/50"
        role="tablist"
        aria-label={t("pages.bloodBank.tablistAria")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "donors"}
          onClick={() => setTab("donors")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition",
            focusRing,
            tab === "donors"
              ? "bg-white text-rose-900 shadow-sm dark:bg-slate-800 dark:text-rose-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
          )}
        >
          <Users className="h-4 w-4 shrink-0" aria-hidden />
          {t("pages.bloodBank.tabDonors")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "requests"}
          onClick={() => setTab("requests")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition",
            focusRing,
            tab === "requests"
              ? "bg-white text-rose-900 shadow-sm dark:bg-slate-800 dark:text-rose-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
          )}
        >
          <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
          {t("pages.bloodBank.tabRequests")}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {tab === "donors" ? t("pages.bloodBank.liveRegistry") : t("pages.bloodBank.requestsRegistry")}
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

        {tab === "donors" ? (
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
                      {locale === "bn" ? u.name.bn : u.name.en}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ▾
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {tab === "donors" ? (
        <>
          {donorsLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("pages.bloodBank.loading")}</p>
          ) : donors === null ? (
            <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-6 dark:border-amber-900/40 dark:bg-amber-950/30">
              <p className="font-medium text-amber-950 dark:text-amber-100">
                {t("pages.bloodBank.loadError")}
              </p>
              <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-200/90">
                {t("pages.bloodBank.apiConfigHint")}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("pages.bloodBank.resultsCount").replace(
                  "{{count}}",
                  String(filteredDonorCount),
                )}
              </p>
              <AnimatePresence mode="wait">
                {donors.length === 0 ? (
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
                    {donors.map((d) => {
                      const u = unionById.get(d.locationId);
                      const unionText = u ? (locale === "bn" ? u.name.bn : u.name.en) : d.locationId;
                      return (
                        <DonorCardApi
                          key={d.id}
                          row={d}
                          unionText={unionText}
                          locale={locale}
                          t={t}
                        />
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </>
      ) : (
        <>
          {requestsLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("pages.bloodBank.loading")}</p>
          ) : requests === null ? (
            <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-6 dark:border-amber-900/40 dark:bg-amber-950/30">
              <p className="font-medium text-amber-950 dark:text-amber-100">
                {t("pages.bloodBank.loadError")}
              </p>
              <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-200/90">
                {t("pages.bloodBank.apiConfigHint")}
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <Activity className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" aria-hidden />
              <p className="mt-3 font-medium text-slate-800 dark:text-slate-100">
                {t("pages.bloodBank.requestsEmpty")}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={listParent}
              initial="hidden"
              animate="show"
            >
              {requests.map((r) => (
                <RequestCard key={r.id} row={r} locale={locale} t={t} />
              ))}
            </motion.div>
          )}
        </>
      )}

      <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
        {t("pages.bloodBank.disclaimer")}
      </p>

      <EmergencyRequestModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        onSubmitted={() => requestBloodBankRefresh()}
      />
    </>
  );
}
