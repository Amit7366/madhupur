import type { Metadata } from "next";
import { ContentCardGrid } from "@/components/content/ContentCardGrid";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { ABOUT_ITEMS } from "@/lib/dummy/main-pages";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.about.title,
    description: dict.pages.about.description,
  }));
}

export default async function AboutPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);

  return (
    <PageShell>
      <PageIntro
        title={t("pages.about.title")}
        description={t("pages.about.description")}
      />
      <ContentCardGrid items={ABOUT_ITEMS} />
    </PageShell>
  );
}
