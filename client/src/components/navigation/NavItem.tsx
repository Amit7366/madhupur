"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isPathActive } from "@/lib/routing";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

export type NavItemVariant = "tab" | "desktop";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  variant: NavItemVariant;
  /** Amber / yellow emphasis for main-feature routes (e.g. map). */
  featured?: boolean;
};

const activeTab =
  "text-indigo-700 dark:text-indigo-300 [&_svg]:stroke-[2.5px]";
const inactiveTab = "text-foreground/50 [&_svg]:stroke-[1.75px]";
const activeDesktop =
  "bg-background text-indigo-800 shadow-sm ring-1 ring-slate-200/90 dark:text-indigo-300 dark:ring-white/12";
const inactiveDesktop =
  "text-foreground/60 hover:bg-slate-100/80 hover:text-foreground dark:hover:bg-white/[0.06]";

export function NavItem({
  href,
  label,
  icon: Icon,
  variant,
  featured = false,
}: NavItemProps) {
  const pathname = usePathname();
  const active = isPathActive(pathname, href);

  if (variant === "tab") {
    return (
      <Link
        href={href}
        prefetch
        className={cn(
          "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2.5 transition-all duration-200 ease-out",
          "[-webkit-tap-highlight-color:transparent] touch-manipulation active:scale-[0.96]",
          focusRing,
          featured &&
            "z-[1] ring-2 ring-amber-400/95 ring-offset-2 ring-offset-background dark:ring-amber-400/75",
          featured && !active && "shadow-[0_0_20px_-4px_rgba(245,158,11,0.55)]",
          featured
            ? active
              ? "text-amber-950 dark:text-amber-50 [&_svg]:stroke-[2.5px]"
              : "text-amber-900 dark:text-amber-100 [&_svg]:stroke-[2.25px]"
            : active
              ? activeTab
              : inactiveTab,
        )}
        aria-current={active ? "page" : undefined}
      >
        <span
          className={cn(
            "absolute inset-x-1 top-1 bottom-1 rounded-2xl transition-colors duration-200",
            featured
              ? active
                ? "bg-amber-400/35 dark:bg-amber-400/25"
                : "bg-amber-200/85 group-hover:bg-amber-300/90 group-active:bg-amber-300 dark:bg-amber-500/30 dark:group-hover:bg-amber-500/40 dark:group-active:bg-amber-500/45"
              : active
                ? "bg-indigo-500/12 dark:bg-indigo-400/14"
                : "bg-transparent group-hover:bg-slate-200/60 group-active:bg-slate-200/80 dark:group-hover:bg-white/[0.07] dark:group-active:bg-white/10",
          )}
          aria-hidden
        />
        <span className="relative flex flex-col items-center gap-0.5">
          <Icon className="size-6 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <span className="nav-tab-label max-w-full truncate text-[10px] font-semibold leading-tight tracking-tight sm:text-[11px]">
            {label}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "relative z-10 flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-out",
        "[-webkit-tap-highlight-color:transparent] touch-manipulation active:scale-[0.98]",
        focusRing,
        featured &&
          "font-semibold shadow-[0_0_18px_-3px_rgba(245,158,11,0.65)] ring-2 ring-amber-400 dark:shadow-[0_0_20px_-2px_rgba(251,191,36,0.35)] dark:ring-amber-400/80",
        featured
          ? active
            ? "bg-amber-300 text-amber-950 ring-amber-500 dark:bg-amber-500/35 dark:text-amber-50 dark:ring-amber-300"
            : "bg-amber-100 text-amber-950 hover:bg-amber-200 dark:bg-amber-950/55 dark:text-amber-100 dark:hover:bg-amber-900/55"
          : active
            ? activeDesktop
            : inactiveDesktop,
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={active || featured ? 2.25 : 1.75} />
      {label}
    </Link>
  );
}
