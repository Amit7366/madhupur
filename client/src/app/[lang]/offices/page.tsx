import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { OFFICES_ITEMS, OFFICES_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.offices.title,
    description: dict.pages.offices.description,
  }));
}

export default async function OfficesPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "offices", OFFICES_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.offices.title")}
        description={t("pages.offices.description")}
      />
      <FilteredCardSection
        items={OFFICES_ITEMS}
        categoryOrder={OFFICES_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.offices.emptyTitle")}
        emptyListDescription={t("pages.offices.emptyDescription")}
      />
    </PageShell>
  );
}
