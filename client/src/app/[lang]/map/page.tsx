import type { Metadata } from "next";
import { MapView } from "@/components/map/MapView";
import { ContributeDataFab } from "@/components/contribute/ContributeDataFab";
import type { MapFilterValue } from "@/components/map/MapFilters";
import {
  MAP_FILTER_GROUP_ORDER,
  type MapFilterGroupId,
} from "@/lib/map-category-groups";
import { MAP_PLACE_CATEGORIES } from "@/lib/map-place-categories";
import { PageIntro } from "@/components/content/PageIntro";
import { PageShell } from "@/components/content/PageShell";
import { loadMapPlacesForPage } from "@/lib/load-map-places";
import { getLangContext } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata-lang";
import type { LangPageProps } from "@/lib/lang-routes";

/** Always merge latest API places on each request; `router.refresh()` after contribute must see new rows. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.map.title,
    description: dict.pages.map.description,
  }));
}

export default async function MapPage({ params }: LangPageProps) {
  const { t, locale } = await getLangContext(params);
  const places = await loadMapPlacesForPage();
  
  const filters = {
    all: t("pages.map.filters.all"),
    ...Object.fromEntries(
      MAP_PLACE_CATEGORIES.map((c) => [c, t(`pages.map.filters.${c}`)]),
    ),
  } as Record<MapFilterValue, string>;

  const filterGroups = Object.fromEntries(
    MAP_FILTER_GROUP_ORDER.map((g) => [g, t(`pages.map.filterGroups.${g}`)]),
  ) as Record<MapFilterGroupId, string>;

  const strings = {
    filters,
    filterGroups,
    allTypesInSection: t("pages.map.allTypesInSection"),
    filterGroupAria: t("pages.map.filterGroupAria"),
    filterSubtypeAria: t("pages.map.filterSubtypeAria"),
    nearYou: t("pages.map.nearYou"),
    mapInfoBoxDetails: t("pages.map.mapInfoBoxDetails"),
    mapInfoBoxDirections: t("pages.map.mapInfoBoxDirections"),
    mapInfoBoxShare: t("pages.map.mapInfoBoxShare"),
    mapInfoBoxCall: t("pages.map.mapInfoBoxCall"),
    mapInfoBoxCopyAddress: t("pages.map.mapInfoBoxCopyAddress"),
    emptyTitle: t("pages.map.emptyTitle"),
    emptyDescription: t("pages.map.emptyDescription"),
    mapAttribution: t("pages.map.mapAttribution"),
    zoomIn: t("pages.map.zoomIn"),
    zoomOut: t("pages.map.zoomOut"),
    recenter: t("pages.map.recenter"),
    geoLoading: t("pages.map.geoLoading"),
    geoDenied: t("pages.map.geoDenied"),
    geoError: t("pages.map.geoError"),
    geoUnsupported: t("pages.map.geoUnsupported"),
    geoFallbackNote: t("pages.map.geoFallbackNote"),
    unitKm: t("pages.map.unitKm"),
    unitM: t("pages.map.unitM"),
    routeModalClose: t("pages.map.routeModalClose"),
    routeModalOpenDirections: t("pages.map.routeModalOpenDirections"),
    routeModalMapPreviewHint: t("pages.map.routeModalMapPreviewHint"),
    routeModalDirectionsHint: t("pages.map.routeModalDirectionsHint"),
    routeModalBackToPreview: t("pages.map.routeModalBackToPreview"),
    openRoute: t("pages.map.openRoute"),
    routeModalLabelDescription: t("pages.map.routeModalLabelDescription"),
    routeModalLabelServices: t("pages.map.routeModalLabelServices"),
    routeModalLabelHours: t("pages.map.routeModalLabelHours"),
    routeModalLabelHotline: t("pages.map.routeModalLabelHotline"),
    routeModalLabelDutyPhone: t("pages.map.routeModalLabelDutyPhone"),
    routeModalLabelDutyOfficer: t("pages.map.routeModalLabelDutyOfficer"),
    routeModalLabelBangla: t("pages.map.routeModalLabelBangla"),
    routeModalLabelEnglish: t("pages.map.routeModalLabelEnglish"),
    callNumber: t("pages.map.callNumber"),
    mapSearchPlaceholder: t("pages.map.mapSearchPlaceholder"),
    mapSearchInputAria: t("pages.map.mapSearchInputAria"),
    mapSearchSubmitAria: t("pages.map.mapSearchSubmitAria"),
    mapSearchClearAria: t("pages.map.mapSearchClearAria"),
    mapSearchVoiceAria: t("pages.map.mapSearchVoiceAria"),
    mapSearchVoiceStopAria: t("pages.map.mapSearchVoiceStopAria"),
    mapSearchVoiceUnsupported: t("pages.map.mapSearchVoiceUnsupported"),
    mapSearchVoiceListening: t("pages.map.mapSearchVoiceListening"),
    mapSearchDismiss: t("pages.map.mapSearchDismiss"),
  };

  return (
    <PageShell className="space-y-6">
      <PageIntro
        title={t("pages.map.title")}
        description={t("pages.map.description")}
      />
      <MapView places={places} locale={locale} strings={strings} />
      <ContributeDataFab />
    </PageShell>
  );
}
