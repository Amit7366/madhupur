import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { EMERGENCY_ITEMS, EMERGENCY_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.emergency.title,
    description: dict.pages.emergency.description,
  }));
}

export default async function EmergencyPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "emergency", EMERGENCY_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.emergency.title")}
        description={t("pages.emergency.description")}
      />
      <FilteredCardSection
        items={EMERGENCY_ITEMS}
        categoryOrder={EMERGENCY_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.emergency.emptyTitle")}
        emptyListDescription={t("pages.emergency.emptyDescription")}
      />
    </PageShell>
  );
}
