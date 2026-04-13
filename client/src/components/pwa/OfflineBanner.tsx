"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/use-i18n";

export function OfflineBanner() {
  const { t } = useI18n();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline ? (
        <motion.div
          key="offline"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-auto flex items-center justify-center gap-2 border-b border-amber-600/20 bg-amber-50 px-4 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] text-sm font-medium text-amber-950 dark:border-amber-500/25 dark:bg-amber-950/50 dark:text-amber-50">
            <WifiOff className="size-4 shrink-0 opacity-80" aria-hidden />
            <span className="text-center font-medium leading-snug">
              {t("pwa.offline.message")}
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
