import Link from "next/link";
import { NAV_DEF, navHref } from "@/lib/nav";
import { focusRing } from "@/lib/ui";
import { createTranslator, type Dictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
};

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const t = createTranslator(dict);

  return (
    <footer className="mt-auto hidden border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-950/30 lg:block">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {t("brand.name")}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t("footer.tagline")}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {year} {t("brand.name")}. {t("footer.rights")}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-8 gap-y-3"
          aria-label="Footer"
        >
          {NAV_DEF.map((item) => (
            <Link
              key={item.segment || "home"}
              href={navHref(lang, item.segment)}
              className={cn(
                "rounded-md text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-800 dark:text-slate-400 dark:hover:text-indigo-300",
                focusRing,
              )}
            >
              {t(`nav.${item.navKey}`)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
