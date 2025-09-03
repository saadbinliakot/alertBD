import { pool } from '../db.js';

export const getReports = async (req, res) => {
  const status = req.query.status;

  console.log("Admin fetching reports with status:", status);

  try {
    const [rows] = await pool.query(
      `SELECT 
        cr.report_id,
        cr.description,
        cr.status,
        cr.user_id,
        cr.created_at,
        ct.name AS crime_type,
        l.name AS location_name,
        l.latitude,
        l.longitude
      FROM CrimeReport cr
      JOIN Location l ON cr.location_id = l.location_id
      JOIN CrimeType ct ON cr.crime_type_id = ct.crime_type_id
      WHERE cr.status = ?`,
      [status]
    );

    const formatted = rows.map((r) => ({
      report_id: r.report_id,
      crime_type: r.crime_type,
      description: r.description,
      status: r.status,
      user_id: r.user_id,
      created_at: r.created_at,
      location: {
        name: r.location_name,
        latitude: r.latitude,
        longitude: r.longitude,
      },
    }));

    console.log(`Found ${formatted.length} report(s) with status '${status}'`);
    res.status(200).json(formatted);
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

