"use client";

import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

export type ChipTabOption<T extends string = string> = Readonly<{
  value: T;
  label: string;
}>;

type ChipTabListProps<T extends string> = Readonly<{
  value: T;
  onChange: (value: T) => void;
  options: readonly ChipTabOption<T>[];
  ariaLabel: string;
  /** Horizontal scroll (map filters) vs wrapping grid (card filters). */
  layout?: "wrap" | "scroll";
  className?: string;
}>;

const chipBtn = (selected: boolean) =>
  cn(
    "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
    "[-webkit-tap-highlight-color:transparent] touch-manipulation active:scale-[0.97]",
    focusRing,
    selected
      ? "border-indigo-400/50 bg-indigo-50 text-indigo-900 shadow-sm dark:border-indigo-500/45 dark:bg-indigo-950/50 dark:text-indigo-100"
      : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-500",
  );

const chipBtnWrap = (selected: boolean) =>
  cn(
    chipBtn(selected),
    "px-3.5 py-2 active:scale-[0.98]",
    !selected &&
      "dark:bg-transparent dark:hover:bg-white/[0.04]",
  );

const chipBtnScroll = (selected: boolean) =>
  cn(chipBtn(selected), "px-4 py-2");

export function ChipTabList<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  layout = "wrap",
  className,
}: ChipTabListProps<T>) {
  const scroll = layout === "scroll";
  const btnClass = scroll ? chipBtnScroll : chipBtnWrap;

  return (
    <div
      className={cn(
        scroll &&
          "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        !scroll && "flex flex-wrap gap-2.5",
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={btnClass(selected)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
