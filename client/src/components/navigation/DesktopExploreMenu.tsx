"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DRAWER_MORE_LINKS } from "@/lib/drawer-links";
import { isPathActive } from "@/lib/routing";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/use-i18n";

const activeTrigger =
  "bg-background text-indigo-800 shadow-sm ring-1 ring-slate-200/90 dark:text-indigo-300 dark:ring-white/12";
const inactiveTrigger =
  "text-foreground/60 hover:bg-slate-100/80 hover:text-foreground dark:hover:bg-white/[0.06]";

export function DesktopExploreMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);

  const anyExploreActive = DRAWER_MORE_LINKS.some((item) =>
    isPathActive(pathname, `/${locale}/${item.segment}`),
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        id="desktop-explore-trigger"
        aria-controls="desktop-explore-menu"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative z-10 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
          "[-webkit-tap-highlight-color:transparent] touch-manipulation active:scale-[0.98]",
          focusRing,
          open || anyExploreActive ? activeTrigger : inactiveTrigger,
        )}
      >
        <span>{t("drawer.sectionExplore")}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 opacity-80 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id="desktop-explore-menu"
          role="menu"
          aria-labelledby="desktop-explore-trigger"
          className={cn(
            "absolute right-0 top-[calc(100%+0.35rem)] z-50 min-w-[15rem] rounded-xl border border-slate-200/90 bg-[var(--surface)] py-1 shadow-lg dark:border-slate-600/80 dark:bg-slate-900 dark:shadow-black/40",
          )}
        >
          {DRAWER_MORE_LINKS.map((item) => {
            const href = `/${locale}/${item.segment}`;
            const Icon = item.icon;
            const active = isPathActive(pathname, href);
            return (
              <li key={item.segment} role="none">
                <Link
                  role="menuitem"
                  href={href}
                  prefetch
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-100"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.06]",
                    focusRing,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-indigo-500/20 text-indigo-900 dark:text-indigo-200"
                        : "bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300",
                    )}
                  >
                    <Icon className="size-[16px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  {t(item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
