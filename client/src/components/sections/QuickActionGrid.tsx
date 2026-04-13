"use client";

import { Bell, Briefcase, Map, Siren, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

export type QuickActionIconKey = "briefcase" | "map" | "bell" | "siren";

const QUICK_ACTION_ICONS: Record<QuickActionIconKey, LucideIcon> = {
  briefcase: Briefcase,
  map: Map,
  bell: Bell,
  siren: Siren,
};

export type QuickActionItem = {
  href: string;
  label: string;
  description: string;
  iconKey: QuickActionIconKey;
  variant?: "default" | "danger";
};

type QuickActionGridProps = {
  items: QuickActionItem[];
};

export function QuickActionGrid({ items }: QuickActionGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-5">
      {items.map((item, index) => {
        const Icon = QUICK_ACTION_ICONS[item.iconKey];
        const danger = item.variant === "danger";

        return (
          <li key={item.href} className="min-w-0">
            <AnimatedCard
              delay={index * 0.06}
              hoverLift={false}
              className="h-full"
            >
              <Link
                href={item.href}
                prefetch
                className={cn(
                  "flex h-full min-h-[120px] flex-col gap-2.5 rounded-2xl border p-4 transition-all duration-300 ease-out",
                  "[-webkit-tap-highlight-color:transparent] touch-manipulation",
                  "hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
                  focusRing,
                  danger
                    ? "border-red-200/80 bg-gradient-to-br from-red-50/80 to-transparent hover:border-red-300 dark:border-red-500/25 dark:from-red-950/30"
                    : "border-slate-200/90 bg-[var(--surface)] hover:border-indigo-200 hover:shadow-indigo-500/5 dark:border-slate-700/70 dark:bg-slate-900/30 dark:hover:border-indigo-500/30",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                    danger
                      ? "bg-red-500/15 text-red-600 dark:text-red-400"
                      : "bg-indigo-500/12 text-indigo-800 dark:text-indigo-300",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-sm font-semibold tracking-tight",
                      danger
                        ? "text-red-700 dark:text-red-300"
                        : "text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400 sm:text-xs">
                    {item.description}
                  </span>
                </span>
              </Link>
            </AnimatedCard>
          </li>
        );
      })}
    </ul>
  );
}
