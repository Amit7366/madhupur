import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { EDUCATION_ITEMS, EDUCATION_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.education.title,
    description: dict.pages.education.description,
  }));
}

export default async function EducationPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "education", EDUCATION_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.education.title")}
        description={t("pages.education.description")}
      />
      <FilteredCardSection
        items={EDUCATION_ITEMS}
        categoryOrder={EDUCATION_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.education.emptyTitle")}
        emptyListDescription={t("pages.education.emptyDescription")}
      />
    </PageShell>
  );
}
