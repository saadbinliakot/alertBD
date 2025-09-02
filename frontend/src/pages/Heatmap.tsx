import { useEffect, useMemo, useState } from "react";
import MapView, { type MapMarker, type RiskSegment } from "../components/LeafletMap.tsx";
import { api, type Report as ApiReport } from "../lib/api";

const defaultCenter: [number, number] = [23.8103, 90.4125]; // Dhaka

function parseLatLng(loc: string): [number, number] | null {
  const parts = loc.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
  return [parts[0], parts[1]];
}

function weightFor(crimeType: string): number {
  const t = crimeType.toLowerCase();
  if (/assault|robbery|homicide|kidnap/.test(t)) return 1.0;
  if (/theft|burglary|fraud/.test(t)) return 0.7;
  return 0.5;
}

function segmentsFromPoints(points: Array<[number, number]>): RiskSegment[] {
  const cell = (lat: number, lng: number) => `${Math.round(lat / 0.002)}:${Math.round(lng / 0.002)}`;
  const bucket: Record<string, Array<[number, number]>> = {};
  points.forEach(([lat, lng]) => {
    const k = cell(lat, lng);
    bucket[k] ||= [];
    bucket[k].push([lat, lng]);
  });

  const segs: RiskSegment[] = [];
  Object.values(bucket).forEach((pts) => {
    const n = pts.length;
    const level: RiskSegment["level"] = n >= 4 ? "high" : n >= 2 ? "medium" : "low";
    pts.forEach(([lat, lng]) => {
      const d = 0.0008;
      segs.push({ from: [lat, lng - d], to: [lat, lng + d], level });
      segs.push({ from: [lat - d, lng], to: [lat + d, lng], level });
    });
  });

  return segs;
}

const Heatmap = () => {
  const [reports, setReports] = useState<ApiReport[]>([]);

  useEffect(() => {
    api.listReports("Verified")
      .then((data) => {
        console.log("Fetched reports:", data);
        setReports(data);
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
        setReports([]);
      });
  }, []);

  const memoized = useMemo(() => {
    const pts: Array<[number, number, number?]> = [];
    const coords: Array<[number, number]> = [];
    const mks: MapMarker[] = [];

    for (const r of reports) {
      console.log("Raw location:", r.location);
      const ll = parseLatLng(r.location);
      if (!ll) continue;

      const w = weightFor(r.crime_type);
      pts.push([ll[0], ll[1], w]);
      coords.push(ll);
      mks.push({
        position: ll,
        title: r.crime_type,
        description: r.description,
      });
    }

    const segs = segmentsFromPoints(coords);
    const ctr = coords.length ? coords[0] : defaultCenter;

    return {
      center: ctr as [number, number],
      heatPoints: pts,
      segments: segs,
      markers: mks,
    };
  }, [reports]);

  const { center, heatPoints, segments, markers } = memoized;

  console.log("Heat points:", heatPoints);
  console.log("Segments:", segments);
  console.log("Markers:", markers);

  return (
    <main className="container py-6">
      <h1 className="text-3xl font-semibold mb-4">City Crime Heatmap</h1>
      <p className="text-muted-foreground mb-4">
        Red = high risk, Yellow = medium, Green = low. Based on verified reports.
      </p>
      <MapView
        center={center}
        zoom={12}
        // markers={markers}
        heatPoints={heatPoints}
        // riskSegments={segments}
        className="h-[70vh]"
      />
    </main>
  );
};

export default Heatmap;
