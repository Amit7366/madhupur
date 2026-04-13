"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/components/map/leaflet-map.css";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  LEAFLET_PLACE_PIN_ANCHOR,
  LEAFLET_PLACE_PIN_ICON_SIZE,
  LEAFLET_USER_PIN_ANCHOR,
  LEAFLET_USER_PIN_ICON_SIZE,
  leafletPlaceDivIconClassName,
  leafletPlacePinHtml,
  leafletUserPinHtml,
} from "@/components/map/leaflet-pins";
import type { MapPlace } from "@/lib/dummy/map-places";
import type { LatLng, LatLngBounds } from "@/lib/geo";

export type MadhupurLeafletMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
};

type MadhupurLeafletMapProps = {
  className?: string;
  places: MapPlace[];
  origin: LatLng;
  bounds: LatLngBounds;
  /** True when `origin` is the device GPS fix (not the town fallback). */
  userLocationActive: boolean;
  selectedId: string | null;
  infoboxPlace: MapPlace | null;
  tileAttribution: string;
  onSelectPlace: (place: MapPlace) => void;
  onMapBackgroundClick: () => void;
  onInfoboxAnchor: (pt: { x: number; y: number } | null) => void;
};

function fitMapToBounds(map: L.Map, b: LatLngBounds, maxZoom = 16) {
  const corner1 = L.latLng(b.minLat, b.minLng);
  const corner2 = L.latLng(b.maxLat, b.maxLng);
  map.fitBounds(L.latLngBounds(corner1, corner2), {
    padding: [40, 40],
    maxZoom,
  });
}

export const MadhupurLeafletMap = forwardRef<
  MadhupurLeafletMapHandle,
  MadhupurLeafletMapProps
>(function MadhupurLeafletMap(
  {
    className,
    places,
    origin,
    bounds,
    userLocationActive,
    selectedId,
    infoboxPlace,
    tileAttribution,
    onSelectPlace,
    onMapBackgroundClick,
    onInfoboxAnchor,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const placesRef = useRef<MapPlace[]>(places);
  const boundsRef = useRef(bounds);
  const originRef = useRef(origin);
  const userLocationActiveRef = useRef(userLocationActive);

  placesRef.current = places;
  boundsRef.current = bounds;
  originRef.current = origin;
  userLocationActiveRef.current = userLocationActive;

  const reportAnchor = useCallback(() => {
    const map = mapRef.current;
    if (!map || !infoboxPlace) return;
    const { lat, lng } = infoboxPlace;

    const run = () => {
      const m = mapRef.current;
      if (!m) return;
      try {
        const p = m.latLngToContainerPoint(L.latLng(lat, lng));
        onInfoboxAnchor({ x: p.x, y: p.y });
      } catch {
        /* container may still be 0×0 or map not fully laid out */
      }
    };

    map.whenReady(run);
  }, [infoboxPlace, onInfoboxAnchor]);

  useEffect(() => {
    if (!infoboxPlace) onInfoboxAnchor(null);
  }, [infoboxPlace, onInfoboxAnchor]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: tileAttribution,
    }).addTo(map);

    const o = originRef.current;
    map.setView([o.lat, o.lng], 13);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    map.on("click", () => {
      onMapBackgroundClick();
    });

    mapRef.current = map;
    setMapReady(true);

    const ro = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      setMapReady(false);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      userMarkerRef.current = null;
    };
  }, [onMapBackgroundClick, tileAttribution]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      mapRef.current?.zoomIn();
    },
    zoomOut: () => {
      mapRef.current?.zoomOut();
    },
    recenter: () => {
      const map = mapRef.current;
      if (!map) return;
      if (userLocationActiveRef.current) {
        const o = originRef.current;
        map.flyTo([o.lat, o.lng], Math.max(map.getZoom(), 15), { duration: 0.55 });
        return;
      }
      const b = boundsRef.current;
      const pts = placesRef.current;
      if (!pts.length) {
        const o = originRef.current;
        map.setView([o.lat, o.lng], 13);
        return;
      }
      fitMapToBounds(map, b);
    },
  }));

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const pts = places;
    if (!pts.length) {
      map.setView([origin.lat, origin.lng], 13);
      return;
    }
    fitMapToBounds(map, bounds);
  }, [
    mapReady,
    bounds.minLat,
    bounds.maxLat,
    bounds.minLng,
    bounds.maxLng,
    places,
    origin.lat,
    origin.lng,
  ]);

  /** Once GPS is available, bring the map to the user so the blue dot is obvious. */
  const hasFlownToUserFix = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !userLocationActive) return;
    if (hasFlownToUserFix.current) return;
    hasFlownToUserFix.current = true;
    const o = originRef.current;
    requestAnimationFrame(() => {
      map.flyTo([o.lat, o.lng], 15, { duration: 0.85 });
    });
  }, [mapReady, userLocationActive]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer || !mapReady) return;

    layer.clearLayers();

    for (const place of places) {
      const selected =
        place.id === selectedId ||
        (infoboxPlace != null && place.id === infoboxPlace.id);
      const icon = L.divIcon({
        className: leafletPlaceDivIconClassName(place.category, selected),
        html: leafletPlacePinHtml(place.category, selected),
        iconSize: LEAFLET_PLACE_PIN_ICON_SIZE,
        iconAnchor: LEAFLET_PLACE_PIN_ANCHOR,
      });

      const marker = L.marker([place.lat, place.lng], {
        icon,
        riseOnHover: true,
        zIndexOffset: selected ? 650 : 0,
      });

      marker.on("click", (e: L.LeafletMouseEvent) => {
        if (e.originalEvent) {
          L.DomEvent.stop(e.originalEvent);
        }
        onSelectPlace(place);
      });

      marker.addTo(layer);
    }

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    const userIcon = L.divIcon({
      className: "mp-user-pin",
      html: leafletUserPinHtml(),
      iconSize: LEAFLET_USER_PIN_ICON_SIZE,
      iconAnchor: LEAFLET_USER_PIN_ANCHOR,
    });

    const userMarker = L.marker([origin.lat, origin.lng], {
      icon: userIcon,
      interactive: false,
      /** Above category pins (selected uses ~650) so “you are here” stays visible when zoomed in. */
      zIndexOffset: 900,
    });
    userMarker.addTo(map);
    userMarkerRef.current = userMarker;
  }, [
    mapReady,
    places,
    selectedId,
    infoboxPlace?.id,
    origin.lat,
    origin.lng,
    onSelectPlace,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    reportAnchor();
    map.on("move", reportAnchor);
    map.on("zoom", reportAnchor);
    return () => {
      map.off("move", reportAnchor);
      map.off("zoom", reportAnchor);
    };
  }, [mapReady, reportAnchor]);

  return <div ref={containerRef} className={className} />;
});
