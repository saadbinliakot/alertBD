import { useEffect, useState } from "react";
import type { Report } from "../lib/api";
import axios from "axios";

const Admin = () => {
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/admin/reports?status=pending", {
        withCredentials: true,
      })
      .then((res) => setPendingReports(res.data))
      .catch((err) => console.error("Failed to fetch pending reports:", err));
  }, []);

  const handleApprove = async (reportId: number) => {
    try {
      await axios.put(`http://localhost:3001/api/reports/${reportId}/approve`, {
        withCredentials: true,
      });
      setPendingReports((prev) => prev.filter((r) => r.report_id !== reportId));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleRejectClick = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!selectedReportId) return;

    try {
      await axios.put(
        `http://localhost:3001/api/reports/${selectedReportId}/reject`,
        {},
        { withCredentials: true }
      );
      setPendingReports((prev) =>
        prev.filter((r) => r.report_id !== selectedReportId)
      );
    } catch (err) {
      console.error("Rejection failed:", err);
    } finally {
      setShowRejectDialog(false);
      setSelectedReportId(null);
    }
  };

  const cancelReject = () => {
    setShowRejectDialog(false);
    setSelectedReportId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Gradient Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-800/50 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-12 py-6 bg-transparent z-50">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
          Alert
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            BD
          </span>{" "}
          Admin
        </h1>
        <div className="flex gap-4">
          <a
            href="/home"
            className="text-white/90 px-5 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
          >
            Home
          </a>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 mt-24 px-6 pb-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          {pendingReports.length === 0 ? (
            <p className="text-gray-300 text-lg text-center mt-12">
              No pending reports.
            </p>
          ) : (
            <ul className="space-y-6">
              {pendingReports.map((r) => (
                <li
                  key={r.report_id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-semibold text-lg">
                      <span className="text-blue-400">{r.crime_type}</span>
                    </span>
                    {r.timestamp && (
                      <span className="text-gray-300 text-sm">
                        {new Date(r.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-200 mb-2">
                    <strong>Description:</strong> {r.description}
                  </p>
                  {r.location && (
                    <p className="text-gray-300 text-sm mb-4">
                      <strong>Location:</strong> {r.location.name}<br />
                      <strong>Coordinates:</strong> {r.location.latitude}, {r.location.longitude}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(r.report_id)}
                      className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow hover:opacity-90 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectClick(r.report_id)}
                      className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold shadow hover:opacity-90 transition"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Reject Confirmation Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Confirm Rejection</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to reject and permanently delete this report?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelReject}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Reject
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

export default Admin;
