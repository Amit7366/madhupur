"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useMobileNav } from "@/components/navigation/MobileNavContext";
import { DesktopExploreMenu } from "@/components/navigation/DesktopExploreMenu";
import { NavItem } from "@/components/navigation/NavItem";
import { NAV_DEF, navHref } from "@/lib/nav";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { isPathActive } from "@/lib/routing";
import { useI18n } from "@/lib/use-i18n";

export function Header() {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const { openDrawer, drawerOpen } = useMobileNav();

  const current = NAV_DEF.find((item) =>
    isPathActive(pathname, navHref(locale, item.segment)),
  );
  const pageTitle = current ? t(`nav.${current.navKey}`) : t("brand.name");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-background/90 shadow-sm backdrop-blur-xl dark:border-slate-700/50 dark:bg-background/85 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]">
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 pt-3.5 sm:px-6 lg:px-8",
          "pb-3.5 lg:pb-5",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-2 lg:flex-none lg:flex-col lg:gap-0.5">
            <button
              type="button"
              onClick={openDrawer}
              aria-label={t("drawer.menu")}
              aria-expanded={drawerOpen}
              aria-controls="mobile-navigation-drawer"
              className={cn(
                "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50/90 text-foreground transition hover:border-slate-300 hover:bg-slate-100 active:scale-[0.96] lg:hidden dark:border-slate-600/80 dark:bg-white/[0.04] dark:hover:border-slate-500 dark:hover:bg-white/[0.07] [-webkit-tap-highlight-color:transparent]",
                focusRing,
              )}
            >
              <Menu className="size-5" strokeWidth={2} />
            </button>
            <div className="min-w-0 flex-1">
              <Link
                href={navHref(locale, "")}
                className={cn(
                  "w-fit rounded-lg text-lg font-bold tracking-tight text-foreground transition-colors hover:text-indigo-900 active:opacity-90 dark:hover:text-indigo-200",
                  focusRing,
                )}
              >
                {t("brand.name")}
              </Link>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 lg:hidden">
                {pageTitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <nav
              className="hidden lg:flex lg:items-center lg:gap-1 lg:rounded-full lg:border lg:border-slate-200/90 lg:bg-slate-50/80 lg:p-1 dark:lg:border-slate-600/60 dark:lg:bg-white/[0.04]"
              aria-label={t("nav.landmarkLabel")}
            >
              <div className="flex items-center gap-0.5">
                {NAV_DEF.map((item) => (
                  <NavItem
                    key={item.segment || "home"}
                    href={navHref(locale, item.segment)}
                    label={t(`nav.${item.navKey}`)}
                    icon={item.icon}
                    variant="desktop"
                    featured={item.featured}
                  />
                ))}
              </div>
              <DesktopExploreMenu />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
