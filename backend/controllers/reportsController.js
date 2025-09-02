import { pool } from "../db.js";

export const submitReport = async (req, res) => {
  console.log("📦 Incoming payload:", req.body);

  let { user_id, description, crime_type_id, location_name, latitude, longitude } = req.body;

  // Ensure lat/lng are numbers
  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);

  // Validate required fields
  if (
    !user_id ||
    !description ||
    !crime_type_id ||
    !location_name ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    // Check if location already exists (within ~100m)
    const [existing] = await pool.query(
      `SELECT location_id FROM Location
       WHERE ABS(latitude - ?) < 0.001 AND ABS(longitude - ?) < 0.001
       ORDER BY created_at DESC LIMIT 1`,
      [latitude, longitude]
    );

    let location_id;
    if (existing.length > 0) {
      location_id = existing[0].location_id;
    } else {
      const [result] = await pool.query(
        `INSERT INTO Location (latitude, longitude, name, created_at)
         VALUES (?, ?, ?, NOW())`,
        [latitude, longitude, location_name]
      );
      location_id = result.insertId;
    }

    // Insert report
    await pool.query(
      `INSERT INTO CrimeReport (crime_type_id, description, datetime, user_id, location_id, status, created_at)
       VALUES (?, ?, NOW(), ?, ?, "Pending", NOW())`,
      [crime_type_id, description, user_id, location_id]
    );

    console.log("✅ Report submitted:", {
      user_id,
      crime_type_id,
      location_id,
      description,
    });

    res.status(200).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("❌ Error submitting report:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listReports = async (req, res) => {
  const { status } = req.query;

  try {
    const [rows] = await pool.query(
      `SELECT
         CR.report_id,
         CR.description,
         CR.datetime AS timestamp,
         CR.status,
         CT.name AS crime_type,
         L.name AS location_name,
         L.latitude,
         L.longitude
       FROM CrimeReport CR
       JOIN CrimeType CT ON CR.crime_type_id = CT.crime_type_id
       JOIN Location L ON CR.location_id = L.location_id
       WHERE CR.status = ?
       ORDER BY CR.datetime DESC`,
      [status]
    );

    const formatted = rows.map((r) => ({
      report_id: r.report_id,
      crime_type: r.crime_type,
      description: r.description,
      timestamp: r.timestamp,
      status: r.status,
      location: {
        name: r.location_name,
        latitude: r.latitude,
        longitude: r.longitude,
      },
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching reports:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
