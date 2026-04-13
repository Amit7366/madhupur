import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { GALLERY_ITEMS, GALLERY_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.gallery.title,
    description: dict.pages.gallery.description,
  }));
}

export default async function GalleryPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "gallery", GALLERY_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.gallery.title")}
        description={t("pages.gallery.description")}
      />
      <FilteredCardSection
        items={GALLERY_ITEMS}
        categoryOrder={GALLERY_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.gallery.emptyTitle")}
        emptyListDescription={t("pages.gallery.emptyDescription")}
      />
    </PageShell>
  );
}
