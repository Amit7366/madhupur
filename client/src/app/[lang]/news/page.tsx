import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { NEWS_ITEMS, NEWS_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.news.title,
    description: dict.pages.news.description,
  }));
}

export default async function NewsPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "news", NEWS_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.news.title")}
        description={t("pages.news.description")}
      />
      <FilteredCardSection
        items={NEWS_ITEMS}
        categoryOrder={NEWS_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.news.emptyTitle")}
        emptyListDescription={t("pages.news.emptyDescription")}
      />
    </PageShell>
  );
}
