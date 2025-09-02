import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import L, { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; 

export type MapMarker = {
  position: [number, number];
  title: string;
  description?: string;
  isUser?: boolean;
};

export type RiskSegment = {
  from: [number, number];
  to: [number, number];
  level: "low" | "medium" | "high";
};

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  riskSegments?: RiskSegment[];
  heatPoints?: Array<[number, number, number?]>;
  className?: string;
}

const MapView = forwardRef<any, MapViewProps>(
  ({ center, zoom = 13, markers = [], riskSegments = [], heatPoints = [], className }, ref) => {
    const mapRef = useRef<LeafletMap | null>(null);
    const layerGroupRef = useRef<LayerGroup | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const heatLayerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      recenterMap: (latlng: [number, number]) => {
        mapRef.current?.setView(latlng, zoom);
      },
    }));

    useEffect(() => {
      if (containerRef.current && !mapRef.current) {
        mapRef.current = L.map(containerRef.current).setView(center, zoom);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
        layerGroupRef.current = L.layerGroup().addTo(mapRef.current);

        // Fix rendering issues on initial load
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      }
    }, []);

    useEffect(() => {
      if (!mapRef.current || !layerGroupRef.current) return;

      // Clear marker and segment layers
      layerGroupRef.current.clearLayers();

      // Render markers
      markers.forEach((m) => {
        if (m.isUser) {
          L.circleMarker(m.position, {
            radius: 10,
            color: "#2563eb",
            fillColor: "#2563eb",
            fillOpacity: 0.8,
          }).addTo(layerGroupRef.current!);
        } else {
          L.marker(m.position)
            .bindPopup(`<strong>${m.title}</strong><br/>${m.description || ""}`)
            .addTo(layerGroupRef.current!);
        }
      });

      // // Render risk segments
      // riskSegments.forEach((seg) => {
      //   const color =
      //     seg.level === "high" ? "#ef4444" :
      //     seg.level === "medium" ? "#f59e0b" :
      //     "#10b981";
      //   L.polyline([seg.from, seg.to], {
      //     color,
      //     weight: 6,
      //     opacity: 0.8,
      //   }).addTo(layerGroupRef.current!);
      // });

      // Remove previous heat layer if it exists
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }

      // Render heatmap directly on the map
      if (heatPoints.length > 0) {
        heatLayerRef.current = (L as any).heatLayer(heatPoints, {
          radius: 35,
          blur: 20,
          maxZoom: 17,
          gradient: {
            0.4: "yellow",
            0.7: "orange",
            1.0: "red"
          },
          opacity: 0.4,
          scaleRadius: false
        }).addTo(mapRef.current);
      }
    }, [markers, riskSegments, heatPoints]);

    return <div ref={containerRef} className={className || "h-full w-full"} />;
  }
);

export default MapView;
