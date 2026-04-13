import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.02] px-6 py-14 text-center",
        className,
      )}
      role="status"
    >
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
        <Icon className="size-7" strokeWidth={1.5} />
      </span>
      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
