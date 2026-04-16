import type { Metadata } from "next";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { TourismExplorer } from "@/components/tourism/TourismExplorer";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
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

  return (
    <PageShell className="max-w-5xl">
      <PageIntro
        title={t("pages.tourism.title")}
        description={t("pages.tourism.description")}
      />
      <TourismExplorer />
    </PageShell>
  );
}
