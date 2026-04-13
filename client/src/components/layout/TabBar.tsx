"use client";

import { NavItem } from "@/components/navigation/NavItem";
import { NAV_DEF, navHref } from "@/lib/nav";
import { useI18n } from "@/lib/use-i18n";

export function TabBar() {
  const { locale, t } = useI18n();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Primary"
    >
      <div className="pointer-events-none flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="pointer-events-auto flex w-full max-w-md items-stretch gap-0.5 rounded-[1.35rem] border border-slate-200/90 bg-background/95 px-1.5 py-1.5 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/90 dark:shadow-[0_-4px_28px_rgba(0,0,0,0.5)]">
          {NAV_DEF.map((item) => (
            <NavItem
              key={item.segment || "home"}
              href={navHref(locale, item.segment)}
              label={t(`nav.${item.navKey}`)}
              icon={item.icon}
              variant="tab"
              featured={item.featured}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
