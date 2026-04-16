import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { HomeWeatherCard } from "@/components/home/HomeWeatherCard";
import { HeroSection } from "@/components/sections/HeroSection";
import { UpazilaMapSection } from "@/components/sections/UpazilaMapSection";
import { InfoCard } from "@/components/ui/InfoCard";
import { QuickActionGrid } from "@/components/sections/QuickActionGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  featuredCardsDummy,
  noticesPreviewDummy,
} from "@/lib/home-dummy";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { navHref } from "@/lib/nav";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.nav.home,
    description: dict.meta.description,
  }));
}

export default async function HomePage({ params }: LangPageProps) {
  const { locale, t } = await getLangContext(params);

  const quickActions = [
    {
      href: navHref(locale, "services"),
      label: t("nav.services"),
      description: t("home.quickServicesBlurb"),
      iconKey: "briefcase" as const,
      variant: "default" as const,
    },
    {
      href: navHref(locale, "map"),
      label: t("nav.map"),
      description: t("home.quickMapBlurb"),
      iconKey: "map" as const,
      variant: "default" as const,
    },
    {
      href: navHref(locale, "notices"),
      label: t("nav.notices"),
      description: t("home.quickNoticesBlurb"),
      iconKey: "bell" as const,
      variant: "default" as const,
    },
    {
      href: "tel:999",
      label: t("tags.emergency"),
      description: t("home.emergencyHint"),
      iconKey: "siren" as const,
      variant: "danger" as const,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 lg:max-w-5xl">
      <HeroSection
        title={t("home.heroTitle")}
        subtitle={t("home.heroSubtitle")}
        searchPlaceholder={t("home.searchPlaceholder")}
        ctaLabel={t("home.ctaPrimary")}
        ctaHref={navHref(locale, "services")}
      />

      <HomeWeatherCard />

      <section className="space-y-5" aria-labelledby="quick-actions-heading">
        <SectionTitle
          id="quick-actions-heading"
          eyebrow={t("home.quickActionsEyebrow")}
          title={t("home.quickActionsTitle")}
        />
        <QuickActionGrid items={quickActions} />
      </section>

      <UpazilaMapSection
        locale={locale}
        eyebrow={t("home.mapSectionEyebrow")}
        title={t("home.mapSectionTitle")}
        description={
          locale === "bn"
            ? t("home.mapSectionDescriptionBn")
            : t("home.mapSectionDescriptionEn")
        }
        openInMapsLabel={t("home.mapSectionOpenInMaps")}
        iframeTitle={t("home.mapSectionIframeTitle")}
      />

      <section className="space-y-5" aria-labelledby="featured-heading">
        <SectionTitle
          id="featured-heading"
          eyebrow={t("home.featuredEyebrow")}
          title={t("home.featuredTitle")}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCardsDummy.map((card) => (
            <InfoCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              href={navHref(locale, card.segment)}
              accent={card.accent}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="notices-heading">
        <SectionTitle
          id="notices-heading"
          eyebrow={t("home.noticesEyebrow")}
          title={t("home.noticesTitle")}
          action={{
            label: t("home.viewAll"),
            href: navHref(locale, "notices"),
          }}
        />
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
          {noticesPreviewDummy.map((n) => (
            <InfoCard
              key={n.id}
              icon={FileText}
              title={n.title}
              description={n.category}
              meta={n.dateLabel}
              href={navHref(locale, "notices")}
              accent="sky"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
