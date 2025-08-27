import { useContext, useEffect, useMemo, useRef, useState } from "react";
import MapView from "../components/LeafletMap";
import type { MapMarker, RiskSegment } from "../components/LeafletMap";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasRequestedLocation = useRef(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || hasRequestedLocation.current) return;
    hasRequestedLocation.current = true;
    setShowLocationDialog(true);
  }, [currentUser]);

  const handleLocationConfirm = () => {
    setShowLocationDialog(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);

          try {
            await axios.post("http://localhost:3001/api/user/location", {
              latitude: coords[0],
              longitude: coords[1],
              name: currentUser.name,
            });
          } catch (err) {
            console.error("Failed to save location:", err);
          }
        },
        (err) => console.warn("Location denied:", err)
      );
    }
  };

  const handleLocationCancel = () => {
    setShowLocationDialog(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/reports?status=approved", { withCredentials: true })
      .then((res) => setReports(res.data))
      .catch((err) => console.error("Failed to fetch reports:", err));
  }, []);

  const reportMarkers: MapMarker[] = useMemo(() => {
    return reports.map((r) => {
      const [lat, lng] = r.location.split(",").map(Number);
      return {
        position: [lat, lng],
        title: r.crime_type,
        description: r.description,
      };
    });
  }, [reports]);

  const riskSegments: RiskSegment[] = useMemo(() => {
    const buckets: Record<string, { count: number; lat: number; lng: number }> = {};

    reports.forEach((r) => {
      const [lat, lng] = r.location.split(",").map(Number);
      const key = `${Math.round(lat / 0.002)}:${Math.round(lng / 0.002)}`;
      if (!buckets[key]) buckets[key] = { count: 0, lat, lng };
      buckets[key].count += 1;
    });

    const segments: RiskSegment[] = [];
    Object.values(buckets).forEach(({ count, lat, lng }) => {
      const level: RiskSegment["level"] =
        count >= 4 ? "high" : count >= 2 ? "medium" : "low";
      const d = 0.0008;
      segments.push({ from: [lat, lng - d], to: [lat, lng + d], level });
      segments.push({ from: [lat - d, lng], to: [lat + d, lng], level });
    });

    return segments;
  }, [reports]);

  const heatPoints: Array<[number, number, number]> = useMemo(() => {
    return reports.map((r) => {
      const [lat, lng] = r.location.split(",").map(Number);
      const weight =
        r.crime_type.toLowerCase().match(/assault|robbery|homicide|kidnap/) ? 1.0 :
        r.crime_type.toLowerCase().match(/theft|burglary|fraud/) ? 0.7 :
        0.5;
      return [lat, lng, weight];
    });
  }, [reports]);

  const userMarker: MapMarker[] = userLocation
    ? [{ position: userLocation, title: "You are here", description: "Current Location", isUser: true }]
    : [];

  const handleLogout = () => {
    try {
      logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Floating gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-800/50 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-12 py-6 bg-transparent z-50">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
          Alert<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">BD</span>
        </h1>
        <div className="flex gap-4">
          <a href="/report" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition">Report</a>
          {currentUser?.role === "Admin" && (
            <a href="/admin" className="px-5 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">Admin</a>
          )}
          <button onClick={handleLogout} className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition">Logout</button>
        </div>
      </nav>

      {/* Map Section */}
      <main className="flex-1 mt-24 px-12 pb-12 relative z-10">
        <div className="h-[calc(100vh-8rem)] rounded-2xl border border-white/20 overflow-hidden shadow-xl bg-white/10 backdrop-blur-lg">
          <MapView
            center={userLocation || [23.8103, 90.4125]}
            zoom={12}
            markers={[...reportMarkers, ...userMarker]}
            riskSegments={riskSegments}
            heatPoints={heatPoints}
            className="h-full w-full"
          />
        </div>
      </main>

      {/* Location Dialog */}
      {showLocationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Enable Location Tracking</h2>
            <p className="text-gray-700 mb-6">
              Do you want to allow location tracking to improve safety alerts?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleLocationCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLocationConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
