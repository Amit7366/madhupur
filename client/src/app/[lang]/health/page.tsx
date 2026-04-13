import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { HEALTH_ITEMS, HEALTH_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.health.title,
    description: dict.pages.health.description,
  }));
}

export default async function HealthPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "health", HEALTH_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.health.title")}
        description={t("pages.health.description")}
      />
      <FilteredCardSection
        items={HEALTH_ITEMS}
        categoryOrder={HEALTH_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.health.emptyTitle")}
        emptyListDescription={t("pages.health.emptyDescription")}
      />
    </PageShell>
  );
}
