import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  id?: string;
  title: string;
  eyebrow?: string;
  action?: { label: string; href: string };
  className?: string;
};

export function SectionTitle({
  id,
  title,
  eyebrow,
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-400">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className="text-balance text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl"
        >
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex items-center gap-1 rounded-md text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200",
            focusRing,
          )}
        >
          {action.label}
          <ChevronRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      ) : null}
    </div>
  );
}
