import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number; location_id: number } | null>(null);
  const [description, setDescription] = useState("");
  const [crimeTypeId, setCrimeTypeId] = useState<number>(1);
  const [crimeTypes, setCrimeTypes] = useState<{ crime_type_id: number; name: string }[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);


  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchLatestLocation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/user/location/latest?name=${encodeURIComponent(
            currentUser.name
          )}`
        );
        const { latitude, longitude, location_id } = res.data;
        if (latitude && longitude && location_id) {
          setLocation({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
            location_id: location_id,
          });
        }
      } catch (err) {
        console.error("Failed to fetch latest location:", err);
      }
    };

    const fetchCrimeTypes = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/crime-types");
        setCrimeTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch crime types:", err);
      }
    };

    fetchLatestLocation();
    fetchCrimeTypes();
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !location.location_id) {
      alert("Location not available");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/reports", {
        user_id: currentUser.user_id,
        location_id: location.location_id,
        description,
        crime_type_id: crimeTypeId,
      });

      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert("Error submitting report");
    }
  };

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
      {/* Floating gradient blobs (same style as LandingPage) */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-800/50 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-12 py-6 bg-transparent z-50">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
          Alert<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">BD</span>
        </h1>
        <div className="flex gap-4">
          <a
            href="/home"
            className="text-white/90 px-5 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
          >
            Home
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Report Form Section */}
      <main className="flex flex-1 items-center justify-center px-6 relative z-10 mt-20">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
          <h1 className="text-4xl font-extrabold text-white mb-6">
            Submit a <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Report</span>
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Crime type */}
            <div>
              <label className="block mb-2 text-gray-200 font-medium">Crime Type</label>
              <select
                value={crimeTypeId}
                onChange={(e) => setCrimeTypeId(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-white/20 bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {crimeTypes.map((type) => (
                  <option key={type.crime_type_id} value={type.crime_type_id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-gray-200 font-medium">Description</label>
              <textarea
                placeholder="Describe what happened..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="w-full p-3 rounded-lg border border-white/20 bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!location}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition ${
                location
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Report
            </button>
          </form>

          {location && (
            <p className="text-gray-300 mt-4 text-sm">
              📍 Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
          )}
        </div>
      </main>
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Report Submitted</h2>
            <p className="text-gray-700 mb-6">
              Your report has been successfully submitted. Thank you for helping keep Bangladesh safe.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="text-center text-gray-300 py-6 bg-transparent relative z-10">
        © {new Date().getFullYear()} AlertBD. All rights reserved.
      </footer>
    </div>
  );
};

export default Reports;
