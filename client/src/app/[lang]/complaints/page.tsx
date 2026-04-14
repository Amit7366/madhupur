import type { Metadata } from "next";
import { ComplaintsView } from "@/components/complaints/ComplaintsView";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { getLangContext } from "@/lib/i18n-server";
import { loadComplaintsForPage } from "@/lib/load-complaints";
import type { LangPageProps } from "@/lib/lang-routes";
import { pageMetadata } from "@/lib/metadata-lang";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.complaints.title,
    description: dict.pages.complaints.description,
  }));
}

export default async function ComplaintsPage({ params }: LangPageProps) {
  const { t, locale } = await getLangContext(params);
  const complaints = await loadComplaintsForPage();

  const strings = {
    listHeading: t("pages.complaints.listHeading"),
    mapTab: t("pages.complaints.mapTab"),
    listTab: t("pages.complaints.listTab"),
    fabLabel: t("pages.complaints.fabLabel"),
    fabHint: t("pages.complaints.fabHint"),
    mapAttribution: t("pages.complaints.mapAttribution"),
    zoomIn: t("pages.complaints.zoomIn"),
    zoomOut: t("pages.complaints.zoomOut"),
    recenter: t("pages.complaints.recenter"),
    geoLoading: t("pages.complaints.geoLoading"),
    geoDenied: t("pages.complaints.geoDenied"),
    geoError: t("pages.complaints.geoError"),
    geoUnsupported: t("pages.complaints.geoUnsupported"),
    geoFallbackNote: t("pages.complaints.geoFallbackNote"),
    emptyTitle: t("pages.complaints.emptyTitle"),
    emptyDescription: t("pages.complaints.emptyDescription"),
    unitKm: t("pages.complaints.unitKm"),
    unitM: t("pages.complaints.unitM"),
    submitted: t("pages.complaints.submitted"),
    photos: t("pages.complaints.photos"),
    callReporter: t("pages.complaints.callReporter"),
    directions: t("pages.complaints.directions"),
    closePanel: t("pages.complaints.closePanel"),
  };

  return (
    <PageShell className="space-y-6">
      <PageIntro
        title={t("pages.complaints.title")}
        description={t("pages.complaints.description")}
      />
      <ComplaintsView complaints={complaints} locale={locale} strings={strings} />
    </PageShell>
  );
}
