"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { DRAWER_MORE_LINKS } from "@/lib/drawer-links";
import { NAV_DEF, navHref } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/use-i18n";
import { useMobileNav } from "@/components/navigation/MobileNavContext";
import { isPathActive } from "@/lib/routing";
import { focusRing } from "@/lib/ui";

export function MobileDrawer() {
  const { drawerOpen, closeDrawer } = useMobileNav();
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen ? (
        <>
          <motion.button
            type="button"
            aria-label={t("drawer.closeBackdrop")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] lg:hidden"
            onClick={closeDrawer}
          />
          <motion.aside
            ref={panelRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("drawer.menu")}
            initial={{ x: "-104%" }}
            animate={{ x: 0 }}
            exit={{ x: "-104%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className={cn(
              "fixed left-0 top-0 z-[101] flex h-full w-[min(88vw,20rem)] flex-col overflow-hidden",
              "border-r border-slate-200/90 bg-background/98 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 lg:hidden",
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-200/90 px-4 py-4 dark:border-slate-700/60">
              <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {t("brand.name")}
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label={t("drawer.close")}
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl border border-slate-200/90",
                  "bg-slate-50 text-foreground transition hover:bg-slate-100 active:scale-95 dark:border-slate-600/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]",
                  "[-webkit-tap-highlight-color:transparent]",
                  focusRing,
                )}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
              aria-label={t("drawer.menu")}
            >
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                {t("drawer.sectionMain")}
              </p>
              <ul className="space-y-1">
                {NAV_DEF.map((item) => {
                  const href = navHref(locale, item.segment);
                  const Icon = item.icon;
                  const active = isPathActive(pathname, href);
                  const featured = item.featured;
                  return (
                    <li key={item.segment || "home"}>
                      <Link
                        href={href}
                        prefetch
                        onClick={closeDrawer}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                          "[-webkit-tap-highlight-color:transparent] active:scale-[0.99]",
                          focusRing,
                          featured &&
                            "ring-2 ring-amber-400/90 ring-offset-2 ring-offset-background dark:ring-amber-400/70",
                          featured
                            ? active
                              ? "bg-amber-200/90 text-amber-950 dark:bg-amber-500/25 dark:text-amber-50"
                              : "bg-amber-50 text-amber-950 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/35"
                            : active
                              ? "bg-indigo-500/12 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200"
                              : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            featured
                              ? active
                                ? "bg-amber-400/50 text-amber-950 dark:bg-amber-400/35 dark:text-amber-50"
                                : "bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-100"
                              : active
                                ? "bg-indigo-500/20 text-indigo-900 dark:bg-indigo-200"
                                : "bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300",
                          )}
                        >
                          <Icon className="size-[18px]" strokeWidth={featured ? 2 : 1.75} />
                        </span>
                        {t(`nav.${item.navKey}`)}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                {t("drawer.sectionExplore")}
              </p>
              <ul className="space-y-1">
                {DRAWER_MORE_LINKS.map((item) => {
                  const href = `/${locale}/${item.segment}`;
                  const Icon = item.icon;
                  const active = isPathActive(pathname, href);
                  return (
                    <li key={item.segment}>
                      <Link
                        href={href}
                        prefetch
                        onClick={closeDrawer}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                          "[-webkit-tap-highlight-color:transparent] active:scale-[0.99]",
                          focusRing,
                          active
                            ? "bg-indigo-500/12 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200"
                            : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            active
                              ? "bg-indigo-500/20 text-indigo-900 dark:text-indigo-200"
                              : "bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300",
                          )}
                        >
                          <Icon className="size-[18px]" strokeWidth={1.75} />
                        </span>
                        {t(item.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
