import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { TOURISM_ITEMS, TOURISM_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.tourism.title,
    description: dict.pages.tourism.description,
  }));
}

export default async function TourismPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "tourism", TOURISM_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.tourism.title")}
        description={t("pages.tourism.description")}
      />
      <FilteredCardSection
        items={TOURISM_ITEMS}
        categoryOrder={TOURISM_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.tourism.emptyTitle")}
        emptyListDescription={t("pages.tourism.emptyDescription")}
      />
    </PageShell>
  );
}
