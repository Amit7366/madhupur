"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { JobListing } from "@/lib/dummy/job-listings";
import { submitJobApplication } from "@/lib/jobs-api";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/ui";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";

function listingTitle(j: JobListing, locale: Locale): string {
  return locale === "bn" ? j.title.bn : j.title.en;
}

type JobApplicationModalProps = {
  open: boolean;
  job: JobListing | null;
  onClose: () => void;
  /** Called after a successful API submission (before `onClose`). */
  onSuccess: () => void;
};

export function JobApplicationModal({
  open,
  job,
  onClose,
  onSuccess,
}: JobApplicationModalProps) {
  const { locale, t } = useI18n();
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setApplicantName("");
      setApplicantPhone("");
      setApplicantEmail("");
      setDistrict("");
      setCoverLetter("");
      setYearsExperience("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!job) return;
    setError(null);
    if (!applicantName.trim() || !applicantPhone.trim()) {
      setError(t("pages.jobs.applyFormRequired"));
      return;
    }

    const yRaw = yearsExperience.trim();
    const yParsed = yRaw === "" ? undefined : Number.parseInt(yRaw, 10);
    const years =
      yParsed != null && !Number.isNaN(yParsed) ? yParsed : undefined;

    setSubmitting(true);
    const res = await submitJobApplication(job.id, {
      applicantName: applicantName.trim(),
      applicantPhone: applicantPhone.trim(),
      applicantEmail: applicantEmail.trim() || undefined,
      district: district.trim() || undefined,
      coverLetter: coverLetter.trim() || undefined,
      yearsExperience: years,
    });
    setSubmitting(false);

    if (res.ok) {
      onSuccess();
      onClose();
      return;
    }
    if (res.status === 409) {
      setError(t("pages.jobs.duplicateApplication"));
      return;
    }
    setError(res.error || t("pages.jobs.applicationError"));
  }

  return (
    <AnimatePresence>
      {open && job ? (
        <motion.div
          className="fixed inset-0 z-[10120] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={t("pages.jobs.applyModalClose")}
            className="absolute inset-0 z-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-apply-modal-title"
            className={cn(
              "relative z-10 flex max-h-[min(92dvh,44rem)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border-2 border-slate-300 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-950 sm:rounded-2xl",
            )}
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-3 border-b-2 border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="min-w-0">
                <h2
                  id="job-apply-modal-title"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {t("pages.jobs.applyModalTitle")}
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t("pages.jobs.applyModalSubtitle")}
                </p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
                  {listingTitle(job, locale)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "shrink-0 rounded-lg border-2 border-slate-300 bg-white p-2 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
                  focusRing,
                )}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto"
            >
              <div className="space-y-4 px-5 py-4">
                {error ? (
                  <p className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100">
                    {error}
                  </p>
                ) : null}

                <div>
                  <label htmlFor="apply-name" className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("pages.jobs.fieldFullName")} <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="apply-name"
                    name="applicantName"
                    autoComplete="name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className={cn(
                      "mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                      "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                    )}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="apply-phone" className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("pages.jobs.fieldPhone")} <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="apply-phone"
                    name="applicantPhone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className={cn(
                      "mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                      "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                    )}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="apply-email" className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("pages.jobs.fieldEmail")}
                    <span className="ml-1 font-normal normal-case text-slate-500">
                      ({t("pages.jobs.fieldEmailOptional")})
                    </span>
                  </label>
                  <input
                    id="apply-email"
                    name="applicantEmail"
                    type="email"
                    autoComplete="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className={cn(
                      "mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                      "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="apply-district" className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("pages.jobs.fieldDistrict")}
                    <span className="ml-1 font-normal normal-case text-slate-500">
                      ({t("pages.jobs.fieldDistrictOptional")})
                    </span>
                  </label>
                  <input
                    id="apply-district"
                    name="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={cn(
                      "mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                      "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="apply-years" className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("pages.jobs.fieldYearsExperience")}
                    <span className="ml-1 font-normal normal-case text-slate-500">
                      ({t("pages.jobs.fieldOptional")})
                    </span>
                  </label>
                  <input
                    id="apply-years"
                    name="yearsExperience"
                    type="number"
                    min={0}
                    max={60}
                    placeholder={t("pages.jobs.fieldYearsPlaceholder")}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className={cn(
                      "mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                      "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="apply-cover" className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("pages.jobs.fieldCoverLetter")}
                    <span className="ml-1 font-normal normal-case text-slate-500">
                      ({t("pages.jobs.fieldOptional")})
                    </span>
                  </label>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-500">
                    {t("pages.jobs.fieldCoverLetterHint")}
                  </p>
                  <textarea
                    id="apply-cover"
                    name="coverLetter"
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className={cn(
                      "mt-1.5 w-full resize-y rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                      "focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
                    )}
                  />
                </div>
              </div>

              <div className="mt-auto border-t-2 border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-500 disabled:opacity-60",
                    focusRing,
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      {t("pages.jobs.submittingApplication")}
                    </>
                  ) : (
                    t("pages.jobs.submitApplication")
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
