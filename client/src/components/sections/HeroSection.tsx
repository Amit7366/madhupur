import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
};

export function HeroSection({
  title,
  subtitle,
  searchPlaceholder,
  ctaLabel,
  ctaHref,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-indigo-50/90 via-background to-background px-6 py-11 shadow-sm dark:border-slate-700/60 dark:from-indigo-950/40 dark:via-background sm:px-10 sm:py-14",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 top-0 size-64 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-600/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-600/15"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl text-center sm:text-left">
        <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-[2rem] md:leading-tight">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mx-0 sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
          <label className="relative flex flex-1 items-center">
            <span className="sr-only">{searchPlaceholder}</span>
            <Search
              className="pointer-events-none absolute left-4 size-5 text-slate-400 dark:text-slate-500"
              aria-hidden
            />
            <input
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              autoComplete="off"
              className={cn(
                "h-12 w-full rounded-2xl border border-slate-200/90 bg-background py-3 pl-12 pr-4 text-sm text-foreground shadow-inner outline-none transition-[box-shadow,border-color] duration-200",
                "placeholder:text-slate-400 dark:border-slate-600/80 dark:placeholder:text-slate-500",
                "hover:border-slate-300 dark:hover:border-slate-500",
                "focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 dark:focus:border-indigo-400/60",
              )}
            />
          </label>
          <Link
            href={ctaHref}
            className={cn(
              "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-md transition-all duration-200",
              "hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg active:translate-y-0 dark:bg-indigo-600 dark:hover:bg-indigo-500",
              focusRing,
            )}
          >
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
