import type { Metadata } from "next";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { JobDiscoveryView } from "@/components/jobs/JobDiscoveryView";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import type { LangPageProps } from "@/lib/lang-routes";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.jobs.title,
    description: dict.pages.jobs.description,
  }));
}

export default async function JobsPage({ params }: LangPageProps) {
  const { t } = await getLangContext(params);

  return (
    <PageShell className="max-w-[100rem] space-y-6">
      <PageIntro
        title={t("pages.jobs.title")}
        description={t("pages.jobs.description")}
      />
      <JobDiscoveryView />
    </PageShell>
  );
}
