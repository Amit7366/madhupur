"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Map } from "lucide-react";
import { navHref } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/use-i18n";

type FloatingActionButtonProps = {
  className?: string;
};

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const { locale, t } = useI18n();
  const href = navHref(locale, "map");

  return (
    <motion.div
      className={cn(
        "fixed right-4 z-[55] lg:hidden",
        "bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))]",
        className,
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 18, stiffness: 260, delay: 0.15 }}
    >
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Link
          href={href}
          prefetch
          aria-label={t("fab.openMap")}
          className={cn(
            "flex size-14 items-center justify-center rounded-[1.15rem]",
            "bg-gradient-to-br from-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-900/25",
            "ring-2 ring-white/30 dark:ring-indigo-400/25",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "[-webkit-tap-highlight-color:transparent]",
          )}
        >
          <Map className="size-6" strokeWidth={2} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
