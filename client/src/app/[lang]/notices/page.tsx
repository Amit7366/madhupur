import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { NOTICES_ITEMS, NOTICES_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.notices.title,
    description: dict.pages.notices.description,
  }));
}

export default async function NoticesPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "notices", NOTICES_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.notices.title")}
        description={t("pages.notices.description")}
      />
      <FilteredCardSection
        items={NOTICES_ITEMS}
        categoryOrder={NOTICES_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.notices.emptyTitle")}
        emptyListDescription={t("pages.notices.emptyDescription")}
      />
    </PageShell>
  );
}
