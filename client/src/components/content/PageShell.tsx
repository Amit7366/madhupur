import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl space-y-10 lg:max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
