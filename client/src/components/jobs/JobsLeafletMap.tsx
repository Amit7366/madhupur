"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/components/map/leaflet-map.css";
import { useCallback, useEffect, useRef, useState } from "react";
import type { JobListing } from "@/lib/dummy/job-listings";
import { latLngBounds, type LatLngBounds } from "@/lib/geo";

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const PIN_SIZE = 30;
const PIN_ANCHOR: L.PointExpression = [15, 15];

function jobPinHtml(selected: boolean): string {
  const border = selected ? "#ea580c" : "#64748b";
  const bg = selected ? "#0f172a" : "#1e293b";
  const scale = selected ? 1.12 : 1;
  const shadow = selected
    ? "0 6px 20px rgba(234,88,12,0.45)"
    : "0 4px 14px rgba(0,0,0,0.35)";
  return `<div class="job-leaflet-pin" style="width:${PIN_SIZE}px;height:${PIN_SIZE}px;border-radius:9999px;background:${bg};border:3px solid ${border};box-shadow:${shadow};transform:scale(${scale});transform-origin:center center;transition:transform 0.2s ease,border-color 0.2s ease,box-shadow 0.2s ease"></div>`;
}

function jobDivIcon(selected: boolean): L.DivIcon {
  return L.divIcon({
    className: "job-marker-wrap",
    html: jobPinHtml(selected),
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: PIN_ANCHOR,
  });
}

function fitJobsBounds(map: L.Map, b: LatLngBounds, maxZoom = 14) {
  const corner1 = L.latLng(b.minLat, b.minLng);
  const corner2 = L.latLng(b.maxLat, b.maxLng);
  map.fitBounds(L.latLngBounds(corner1, corner2), {
    padding: [48, 48],
    maxZoom,
  });
}

export type JobsLeafletMapProps = {
  className?: string;
  jobs: JobListing[];
  selectedId: string | null;
  onSelectJob: (id: string) => void;
  onMapBackgroundClick?: () => void;
};

export function JobsLeafletMap({
  className,
  jobs,
  selectedId,
  onSelectJob,
  onMapBackgroundClick,
}: JobsLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const jobsRef = useRef(jobs);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelectJob);
  jobsRef.current = jobs;
  selectedRef.current = selectedId;
  onSelectRef.current = onSelectJob;

  const bounds = useCallback((): LatLngBounds => {
    const pts = jobs.map((j) => ({ lat: j.lat, lng: j.lng }));
    return latLngBounds(pts);
  }, [jobs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, { zoomControl: true, attributionControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: TILE_ATTRIBUTION,
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerRef.current = layer;

    map.on("click", () => {
      onMapBackgroundClick?.();
    });

    const b = bounds();
    const center: [number, number] =
      jobs.length > 0
        ? [(b.minLat + b.maxLat) / 2, (b.minLng + b.maxLng) / 2]
        : [24.62, 90.04];
    map.setView(center, 12);

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
      layerRef.current = null;
    };
  }, [bounds, jobs.length, onMapBackgroundClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || jobs.length === 0) return;
    fitJobsBounds(map, bounds());
  }, [mapReady, jobs, bounds]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !mapReady) return;

    layer.clearLayers();

    for (const job of jobsRef.current) {
      const selected = job.id === selectedRef.current;
      const marker = L.marker([job.lat, job.lng], {
        icon: jobDivIcon(selected),
        riseOnHover: true,
        zIndexOffset: selected ? 800 : 0,
      });

      marker.on("click", (e: L.LeafletMouseEvent) => {
        if (e.originalEvent) {
          L.DomEvent.stop(e.originalEvent);
        }
        onSelectRef.current(job.id);
      });

      marker.addTo(layer);
    }
  }, [mapReady, jobs, selectedId]);

  /** Fly to selected job when it changes (e.g. from list). */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedId) return;
    const job = jobs.find((j) => j.id === selectedId);
    if (!job) return;
    map.flyTo([job.lat, job.lng], Math.max(map.getZoom(), 14), {
      duration: 0.45,
    });
  }, [mapReady, selectedId, jobs]);

  return <div ref={containerRef} className={className} />;
}
