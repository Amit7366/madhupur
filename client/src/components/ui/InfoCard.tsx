import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

const accentStyles = {
  emerald: {
    ring: "ring-emerald-500/15",
    iconBg:
      "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-400/15",
    glow: "from-emerald-500/12",
  },
  violet: {
    ring: "ring-indigo-500/15",
    iconBg:
      "bg-indigo-500/12 text-indigo-800 dark:text-indigo-300 dark:bg-indigo-400/15",
    glow: "from-indigo-500/12",
  },
  amber: {
    ring: "ring-amber-500/20",
    iconBg:
      "bg-amber-500/12 text-amber-800 dark:text-amber-200 dark:bg-amber-400/15",
    glow: "from-amber-500/12",
  },
  sky: {
    ring: "ring-sky-500/15",
    iconBg:
      "bg-sky-500/12 text-sky-800 dark:text-sky-200 dark:bg-sky-400/15",
    glow: "from-sky-500/12",
  },
} as const;

export type InfoCardAccent = keyof typeof accentStyles;

type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  accent?: InfoCardAccent;
  meta?: string;
  className?: string;
};

export function InfoCard({
  icon: Icon,
  title,
  description,
  href,
  accent = "violet",
  meta,
  className,
}: InfoCardProps) {
  const a = accentStyles[accent];

  const inner = (
    <>
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br to-transparent opacity-70 blur-2xl",
          a.glow,
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative mb-4 inline-flex size-11 items-center justify-center rounded-2xl",
          a.iconBg,
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      {meta ? (
        <p className="relative mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
          {meta}
        </p>
      ) : null}
      <h3 className="relative text-base font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </>
  );

  const shell = cn(
    "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-[var(--surface)] p-5 shadow-sm ring-1 ring-slate-200/40 ring-inset transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 hover:border-slate-300/90 hover:shadow-md dark:border-slate-700/60 dark:ring-slate-700/50 dark:hover:border-slate-600",
    a.ring,
    "[-webkit-tap-highlight-color:transparent] active:scale-[0.99]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(shell, "block rounded-2xl", focusRing)}>
        {inner}
      </Link>
    );
  }

  return <div className={shell}>{inner}</div>;
}
