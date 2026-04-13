"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/use-i18n";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const SESSION_DISMISS_KEY = "pwa-install-dismissed";

export function AppInstallPrompt() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem(SESSION_DISMISS_KEY)) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    setOpen(false);
    setDeferred(null);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }, [deferred, dismiss]);

  return (
    <AnimatePresence>
      {open && deferred ? (
        <motion.div
          key="install"
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={cn(
            "fixed left-3 right-3 z-[90] lg:hidden",
            "bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))]",
          )}
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-background/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-slate-700/70 dark:shadow-black/40">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/12 text-indigo-800 dark:text-indigo-300">
              <Download className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p
                id="pwa-install-title"
                className="text-sm font-semibold tracking-tight"
              >
                {t("pwa.install.title")}
              </p>
              <p
                id="pwa-install-desc"
                className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400"
              >
                {t("pwa.install.body")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={install}
                  className={cn(
                    "rounded-full bg-indigo-700 px-4 py-2 text-xs font-semibold text-white touch-manipulation [-webkit-tap-highlight-color:transparent] hover:bg-indigo-800 active:opacity-95 dark:bg-indigo-600 dark:hover:bg-indigo-500",
                    focusRing,
                  )}
                >
                  {t("pwa.install.action")}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-medium text-slate-600 touch-manipulation [-webkit-tap-highlight-color:transparent] hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100",
                    focusRing,
                  )}
                >
                  {t("pwa.install.later")}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className={cn(
                "-m-1 shrink-0 rounded-lg p-2 text-slate-500 touch-manipulation [-webkit-tap-highlight-color:transparent] hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-slate-100",
                focusRing,
              )}
              aria-label={t("pwa.install.close")}
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
