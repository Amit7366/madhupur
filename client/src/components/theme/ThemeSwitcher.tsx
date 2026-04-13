"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/use-i18n";

type ThemeChoice = "light" | "dark" | "system";

const choices: ThemeChoice[] = ["light", "dark", "system"];

function subscribe() {
  return () => {};
}
function getServerSnapshot() {
  return false;
}
function getClientSnapshot() {
  return true;
}

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function ThemeSwitcher() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = (theme ?? "system") as ThemeChoice;
  const TriggerIcon =
    current === "system"
      ? Monitor
      : current === "dark"
        ? Moon
        : Sun;

  const pick = useCallback(
    (value: ThemeChoice) => {
      setTheme(value);
      setOpen(false);
    },
    [setTheme],
  );

  if (!mounted) {
    return (
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white dark:border-slate-600/80 dark:bg-slate-900/40"
        aria-hidden
      >
        <Sun className="size-4 text-slate-400" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("theme.menu")}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.96] dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/50",
          focusRing,
        )}
      >
        <TriggerIcon className="size-4" strokeWidth={1.75} aria-hidden />
        <span className="sr-only">{t("theme.menu")}</span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("theme.menu")}
          className={cn(
            "absolute right-0 top-[calc(100%+0.35rem)] z-[60] min-w-[11rem] rounded-xl border border-slate-200/90 bg-[var(--surface)] py-1 shadow-lg dark:border-slate-600/80 dark:bg-slate-900 dark:shadow-black/40",
          )}
        >
          {choices.map((value) => {
            const Icon = icons[value];
            const selected = current === value;
            return (
              <li key={value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => pick(value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    selected
                      ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-100"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.06]",
                    focusRing,
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                  <span>
                    {value === "light"
                      ? t("theme.light")
                      : value === "dark"
                        ? t("theme.dark")
                        : t("theme.system")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
