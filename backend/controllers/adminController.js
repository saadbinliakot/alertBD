import { pool } from '../db.js';

export const getReports = async (req, res) => {
  const status = req.query.status?.toLowerCase();

  console.log("Admin fetching reports with status:", status);

  try {
    const [rows] = await pool.query(
      "SELECT * FROM CrimeReport WHERE status = ?",
      [status]
    );

    console.log(`Found ${rows.length} report(s) with status '${status}'`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching reports:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const approveReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    await pool.query(
      'UPDATE CrimeReport SET status = "Verified" WHERE report_id = ?',
      [reportId]
    );
    res.status(200).json({ message: "Report Verified" });
  } catch (err) {
    console.error("Error approving report:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const [result] = await pool.query(
      "DELETE FROM CrimeReport WHERE report_id = ?",
      [reportId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({ message: "Report rejected and deleted" });
  } catch (err) {
    console.error("Error deleting report:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

