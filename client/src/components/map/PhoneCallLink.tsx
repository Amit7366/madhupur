"use client";

import { Phone } from "lucide-react";
import { phoneToTelHref } from "@/lib/phone-tel";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type PhoneCallLinkProps = {
  /** Display number (may include spaces, hyphens). */
  display: string;
  /** Accessible label, e.g. "Call" or "কল করুন". */
  label: string;
  /** Stop parent click (e.g. card selection) when tapping call. */
  stopPropagation?: boolean;
  className?: string;
};

export function PhoneCallLink({
  display,
  label,
  stopPropagation = false,
  className,
}: PhoneCallLinkProps) {
  const href = phoneToTelHref(display);
  if (!href) return null;
  const aria = `${label}: ${display}`;

  return (
    <a
      href={href}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      onKeyDown={stopPropagation ? (e) => e.stopPropagation() : undefined}
      aria-label={aria}
      title={aria}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-950/60",
        focusRing,
        className,
      )}
    >
      <Phone className="size-4" strokeWidth={2} aria-hidden />
    </a>
  );
}
