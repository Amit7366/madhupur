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
  LEAFLET_USER_PIN_ANCHOR,
  LEAFLET_USER_PIN_ICON_SIZE,
  leafletUserPinHtml,
} from "@/components/map/leaflet-pins";
import type { ComplaintDto } from "@/lib/complaint-api";
import type { LatLng, LatLngBounds } from "@/lib/geo";

const COMPLAINT_PIN_SIZE: [number, number] = [26, 26];
const COMPLAINT_PIN_ANCHOR: [number, number] = [13, 26];

export type ComplaintsLeafletMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
};

function fitMapToBounds(map: L.Map, b: LatLngBounds, maxZoom = 16) {
  const corner1 = L.latLng(b.minLat, b.minLng);
  const corner2 = L.latLng(b.maxLat, b.maxLng);
  map.fitBounds(L.latLngBounds(corner1, corner2), {
    padding: [40, 40],
    maxZoom,
  });
}

function complaintPinHtml(selected: boolean): string {
  const scale = selected ? "transform:scale(1.12);" : "";
  return `<div style="width:26px;height:26px;border-radius:9999px;background:#ea580c;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);${scale}"></div>`;
}

type ComplaintsLeafletMapProps = {
  className?: string;
  complaints: ComplaintDto[];
  origin: LatLng;
  bounds: LatLngBounds;
  userLocationActive: boolean;
  selectedId: string | null;
  infoboxComplaint: ComplaintDto | null;
  tileAttribution: string;
  onSelectComplaint: (c: ComplaintDto) => void;
  onMapBackgroundClick: () => void;
  onInfoboxAnchor: (pt: { x: number; y: number } | null) => void;
};

export const ComplaintsLeafletMap = forwardRef<
  ComplaintsLeafletMapHandle,
  ComplaintsLeafletMapProps
>(function ComplaintsLeafletMap(
  {
    className,
    complaints,
    origin,
    bounds,
    userLocationActive,
    selectedId,
    infoboxComplaint,
    tileAttribution,
    onSelectComplaint,
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
  const complaintsRef = useRef(complaints);
  const boundsRef = useRef(bounds);
  const originRef = useRef(origin);
  const userLocationActiveRef = useRef(userLocationActive);

  complaintsRef.current = complaints;
  boundsRef.current = bounds;
  originRef.current = origin;
  userLocationActiveRef.current = userLocationActive;

  const reportAnchor = useCallback(() => {
    const map = mapRef.current;
    if (!map || !infoboxComplaint) return;
    const { lat, lng } = infoboxComplaint;
    const run = () => {
      const m = mapRef.current;
      if (!m) return;
      try {
        const p = m.latLngToContainerPoint(L.latLng(lat, lng));
        onInfoboxAnchor({ x: p.x, y: p.y });
      } catch {
        /* layout */
      }
    };
    map.whenReady(run);
  }, [infoboxComplaint, onInfoboxAnchor]);

  useEffect(() => {
    if (!infoboxComplaint) onInfoboxAnchor(null);
  }, [infoboxComplaint, onInfoboxAnchor]);

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
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    recenter: () => {
      const map = mapRef.current;
      if (!map) return;
      if (userLocationActiveRef.current) {
        const o = originRef.current;
        map.flyTo([o.lat, o.lng], Math.max(map.getZoom(), 15), {
          duration: 0.55,
        });
        return;
      }
      const b = boundsRef.current;
      const pts = complaintsRef.current;
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
    const pts = complaints;
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
    complaints,
    origin.lat,
    origin.lng,
  ]);

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

    for (const c of complaints) {
      const selected =
        c.id === selectedId ||
        (infoboxComplaint != null && c.id === infoboxComplaint.id);
      const icon = L.divIcon({
        className: "mp-complaint-pin",
        html: complaintPinHtml(selected),
        iconSize: COMPLAINT_PIN_SIZE,
        iconAnchor: COMPLAINT_PIN_ANCHOR,
      });

      const marker = L.marker([c.lat, c.lng], {
        icon,
        riseOnHover: true,
        zIndexOffset: selected ? 650 : 0,
      });

      marker.on("click", (e: L.LeafletMouseEvent) => {
        if (e.originalEvent) {
          L.DomEvent.stop(e.originalEvent);
        }
        onSelectComplaint(c);
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
      zIndexOffset: 900,
    });
    userMarker.addTo(map);
    userMarkerRef.current = userMarker;
  }, [
    mapReady,
    complaints,
    selectedId,
    infoboxComplaint?.id,
    origin.lat,
    origin.lng,
    onSelectComplaint,
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
