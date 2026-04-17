"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Check,
  List,
  Loader2,
  Map as MapIcon,
  Phone,
  Send,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { JobListing } from "@/lib/dummy/job-listings";
import { fetchJobsFromApi } from "@/lib/jobs-api";
import { JobApplicationModal } from "@/components/jobs/JobApplicationModal";
import type { Locale } from "@/lib/i18n";
import { phoneToTelHref } from "@/lib/phone-tel";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

function JobsMapLoading() {
  const { t } = useI18n();
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-slate-950 text-sm text-slate-400">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
      <span>{t("pages.jobs.mapLoading")}</span>
    </div>
  );
}

const JobsLeafletMap = dynamic(
  () =>
    import("@/components/jobs/JobsLeafletMap").then((mod) => ({
      default: mod.JobsLeafletMap,
    })),
  { ssr: false, loading: JobsMapLoading },
);

function jobTitle(j: JobListing, locale: Locale): string {
  return locale === "bn" ? j.title.bn : j.title.en;
}

function jobCompany(j: JobListing, locale: Locale): string {
  return locale === "bn" ? j.company.bn : j.company.en;
}

function jobSalary(j: JobListing, locale: Locale): string {
  return locale === "bn" ? j.salaryRange.bn : j.salaryRange.en;
}

export function JobDiscoveryView() {
  const { locale, t } = useI18n();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [modalJob, setModalJob] = useState<JobListing | null>(null);
  const [applyFormOpen, setApplyFormOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const loadJobs = useCallback(async () => {
    setLoadState("loading");
    const data = await fetchJobsFromApi();
    if (data === null) {
      setJobs([]);
      setLoadState("error");
      return;
    }
    setJobs(data);
    setLoadState("ready");
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const setCardRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) cardRefs.current[id] = el;
    else delete cardRefs.current[id];
  }, []);

  useEffect(() => {
    if (!focusedId) return;
    const el = cardRefs.current[focusedId];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [focusedId]);

  useEffect(() => {
    setApplyFormOpen(false);
    setAppliedId(null);
  }, [modalJob]);

  const openModal = useCallback((job: JobListing) => {
    setFocusedId(job.id);
    setModalJob(job);
  }, []);

  const onMapPickJob = useCallback((id: string) => {
    setFocusedId(id);
    setMobileTab("list");
  }, []);

  const mapBgClick = useCallback(() => {
    setFocusedId(null);
  }, []);

  if (loadState === "loading") {
    return (
      <div className="flex min-h-[240px] items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-slate-50 py-16 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        {t("pages.jobs.loading")}
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="space-y-3 rounded-xl border-2 border-amber-500/40 bg-amber-50 px-4 py-5 dark:border-amber-500/30 dark:bg-amber-950/35">
        <p className="font-semibold text-amber-950 dark:text-amber-100">{t("pages.jobs.loadError")}</p>
        <p className="text-sm text-amber-900/85 dark:text-amber-200/90">{t("pages.jobs.apiHint")}</p>
        <button
          type="button"
          onClick={() => void loadJobs()}
          className={cn(
            "rounded-xl border-2 border-slate-800 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 dark:border-slate-500 dark:bg-slate-800 dark:text-white",
            focusRing,
          )}
        >
          {t("pages.jobs.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-7.5rem)] lg:min-h-[520px] lg:flex-row lg:gap-0">
      {/* Mobile view toggle */}
      <div
        className="mb-3 flex shrink-0 rounded-xl border-2 border-slate-300 bg-slate-100 p-1 dark:border-slate-600 dark:bg-slate-900 lg:hidden"
        role="tablist"
        aria-label={t("pages.jobs.viewToggleAria")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "list"}
          onClick={() => setMobileTab("list")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition",
            focusRing,
            mobileTab === "list"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-600 dark:text-slate-400",
          )}
        >
          <List className="h-4 w-4" aria-hidden />
          {t("pages.jobs.listView")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "map"}
          onClick={() => setMobileTab("map")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition",
            focusRing,
            mobileTab === "map"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-600 dark:text-slate-400",
          )}
        >
          <MapIcon className="h-4 w-4" aria-hidden />
          {t("pages.jobs.mapView")}
        </button>
      </div>

      {/* List panel */}
      <aside
        className={cn(
          "flex min-h-0 flex-col border-slate-300 dark:border-slate-700 lg:w-[40%] lg:shrink-0 lg:border-r-2 lg:pr-4",
          mobileTab === "map" ? "hidden lg:flex" : "flex",
        )}
      >
        <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-4 [scrollbar-width:thin] lg:max-h-full lg:pb-2">
          {jobs.length === 0 ? (
            <li className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center dark:border-slate-600 dark:bg-slate-900/50">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{t("pages.jobs.emptyTitle")}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t("pages.jobs.emptyDescription")}</p>
            </li>
          ) : null}
          {jobs.map((job) => {
            const active = focusedId === job.id;
            return (
              <li key={job.id} ref={(el) => setCardRef(job.id, el)}>
                <motion.div
                  layout
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <button
                    type="button"
                    onClick={() => openModal(job)}
                    className={cn(
                      "w-full rounded-xl border-2 bg-white p-4 text-left shadow-sm transition dark:bg-slate-950",
                      active
                        ? "border-orange-500 shadow-md shadow-orange-500/10 ring-2 ring-orange-500/30 dark:border-orange-500"
                        : "border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500",
                      focusRing,
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {t("pages.jobs.openRole")}
                        </p>
                        <h3 className="mt-1.5 font-semibold leading-snug text-slate-900 dark:text-slate-50">
                          {jobTitle(job, locale)}
                        </h3>
                        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <Building2 className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                          <span>{jobCompany(job, locale)}</span>
                        </p>
                        <p className="mt-2 text-sm font-semibold tabular-nums text-orange-700 dark:text-orange-400">
                          {jobSalary(job, locale)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex shrink-0 flex-col items-end gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-right dark:border-slate-600 dark:bg-slate-900",
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {t("pages.jobs.liveApplications")}
                        </span>
                        <span className="flex items-center gap-1.5 text-base font-bold tabular-nums text-slate-900 dark:text-white">
                          <span
                            className="relative flex h-2 w-2"
                            aria-hidden
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                          </span>
                          {job.liveApplicants}
                        </span>
                      </span>
                    </div>
                  </button>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Map panel */}
      <div
        className={cn(
          "relative min-h-[min(55dvh,420px)] flex-1 overflow-hidden rounded-xl border-2 border-slate-300 bg-slate-950 dark:border-slate-600 lg:min-h-0 lg:w-[60%] lg:rounded-none lg:border-0 lg:border-l-2",
          mobileTab === "list" ? "hidden lg:block" : "block",
        )}
      >
        <JobsLeafletMap
          className="h-full min-h-[min(55dvh,420px)] w-full lg:min-h-0"
          jobs={jobs}
          selectedId={focusedId}
          onSelectJob={onMapPickJob}
          onMapBackgroundClick={mapBgClick}
        />
      </div>

      <AnimatePresence>
        {modalJob ? (
          <motion.div
            className="fixed inset-0 z-[10050] flex items-end justify-center sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={t("pages.jobs.close")}
              className="absolute inset-0 z-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setModalJob(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="job-modal-title"
              className={cn(
                "relative z-10 flex max-h-[min(92dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border-2 border-slate-300 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-950 sm:max-h-[min(90dvh,44rem)] sm:rounded-2xl",
              )}
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div className="flex items-start justify-between gap-3 border-b-2 border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-600 dark:text-orange-400">
                    {t("pages.jobs.industrialist")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {jobCompany(modalJob, locale)}
                  </p>
                  <h2
                    id="job-modal-title"
                    className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl"
                  >
                    {jobTitle(modalJob, locale)}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalJob(null)}
                  className={cn(
                    "shrink-0 rounded-lg border-2 border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
                    focusRing,
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Users className="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {t("pages.jobs.totalApplicants")}
                    </span>
                  </div>
                  <motion.p
                    key={modalJob.totalApplicants}
                    initial={{ opacity: 0.5, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 text-3xl font-black tabular-nums tracking-tight text-slate-900 dark:text-white"
                  >
                    {modalJob.totalApplicants.toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}
                  </motion.p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t("pages.jobs.totalApplicantsHint")}
                  </p>
                </div>

                <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("pages.jobs.salaryRange")}
                </p>
                <p className="mt-1 text-base font-semibold text-orange-700 dark:text-orange-400">
                  {jobSalary(modalJob, locale)}
                </p>

                <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  {t("pages.jobs.description")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {locale === "bn" ? modalJob.description.bn : modalJob.description.en}
                </p>

                <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  {t("pages.jobs.requirements")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {locale === "bn" ? modalJob.requirements.bn : modalJob.requirements.en}
                </p>
              </div>

              <div className="border-t-2 border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {phoneToTelHref(modalJob.hrPhone) ? (
                    <a
                      href={phoneToTelHref(modalJob.hrPhone)!}
                      className={cn(
                        "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-800 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 sm:flex-none",
                        focusRing,
                      )}
                    >
                      <Phone className="h-4 w-4" />
                      {t("pages.jobs.callHr")}
                    </a>
                  ) : null}
                  <motion.button
                    type="button"
                    disabled={appliedId === modalJob.id}
                    onClick={() => setApplyFormOpen(true)}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition sm:flex-none",
                      appliedId === modalJob.id
                        ? "bg-emerald-600 shadow-emerald-900/30"
                        : "bg-orange-600 shadow-orange-900/25 hover:bg-orange-500",
                      focusRing,
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {appliedId === modalJob.id ? (
                        <motion.span
                          key="done"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-5 w-5" strokeWidth={2.5} />
                          {t("pages.jobs.applied")}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="go"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {t("pages.jobs.applyNow")}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                {appliedId === modalJob.id ? (
                  <p className="mt-3 text-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {t("pages.jobs.applicationSent")}
                  </p>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <JobApplicationModal
        open={applyFormOpen}
        job={modalJob}
        onClose={() => setApplyFormOpen(false)}
        onSuccess={() => {
          if (modalJob) setAppliedId(modalJob.id);
          void loadJobs();
        }}
      />
    </div>
  );
}
