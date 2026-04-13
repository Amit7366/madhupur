import type { Metadata } from "next";
import { FilteredCardSection } from "@/components/content/FilteredCardSection";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import { CONTACTS_ITEMS, CONTACTS_ORDER } from "@/lib/dummy/main-pages";
import { pageFilterLabels } from "@/lib/page-helpers";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.contacts.title,
    description: dict.pages.contacts.description,
  }));
}

export default async function ContactsPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);
  const filterLabels = pageFilterLabels(t, "contacts", CONTACTS_ORDER);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.contacts.title")}
        description={t("pages.contacts.description")}
      />
      <FilteredCardSection
        items={CONTACTS_ITEMS}
        categoryOrder={CONTACTS_ORDER}
        filterLabels={filterLabels}
        emptyFilterTitle={t("pages.emptyFilterTitle")}
        emptyFilterDescription={t("pages.emptyFilterDescription")}
        emptyListTitle={t("pages.contacts.emptyTitle")}
        emptyListDescription={t("pages.contacts.emptyDescription")}
      />
    </PageShell>
  );
}
