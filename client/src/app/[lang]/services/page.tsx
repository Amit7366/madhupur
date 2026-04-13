import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { SERVICES_ITEMS, SERVICES_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.services.title,
    description: dict.pages.services.description,
  }));
}

export default async function ServicesPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "services", SERVICES_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.services.title")}
        description={t("pages.services.description")}
      />
      <FilteredCardSection
        items={SERVICES_ITEMS}
        categoryOrder={SERVICES_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.services.emptyTitle")}
        emptyListDescription={t("pages.services.emptyDescription")}
      />
    </PageShell>
  );
}
