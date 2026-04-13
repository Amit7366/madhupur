import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
};

/** Single block with premium shimmer */
export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-slate-200/80 dark:bg-slate-700/50",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/18 after:to-transparent after:content-[''] dark:after:via-white/10",
        "after:animate-[skeleton-shimmer_1.25s_ease-in-out_infinite]",
        className,
      )}
    />
  );
}

/** Hero-style skeleton */
export function HeroSkeleton() {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-[var(--surface)] p-6 sm:p-8 dark:border-slate-700/70">
      <LoadingSkeleton className="h-8 w-3/4 max-w-md" />
      <LoadingSkeleton className="h-4 w-full max-w-lg" />
      <LoadingSkeleton className="h-4 w-5/6 max-w-md" />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <LoadingSkeleton className="h-12 flex-1" />
        <LoadingSkeleton className="h-12 w-full sm:w-40" />
      </div>
    </div>
  );
}

/** Card grid placeholders */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-2xl border border-slate-200/90 bg-[var(--surface)] p-5 dark:border-slate-700/70"
        >
          <LoadingSkeleton className="mb-4 size-11 rounded-2xl" />
          <LoadingSkeleton className="mb-2 h-4 w-4/5" />
          <LoadingSkeleton className="h-3 w-full" />
          <LoadingSkeleton className="mt-2 h-3 w-2/3" />
        </li>
      ))}
    </ul>
  );
}

/** Full page shell for route `loading.tsx` */
export function PageLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 lg:max-w-5xl">
      <HeroSkeleton />
      <div className="space-y-3">
        <LoadingSkeleton className="h-5 w-40" />
        <LoadingSkeleton className="h-4 w-64" />
        <CardGridSkeleton count={3} />
      </div>
    </div>
  );
}
