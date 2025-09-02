import { pool } from "../db.js";

// Save a new location (place name + coordinates)
export const saveLocation = async (req, res) => {
  const { latitude, longitude, name } = req.body;

  if (!latitude || !longitude || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Location (latitude, longitude, name, created_at)
       VALUES (?, ?, ?, NOW())`,
      [latitude, longitude, name]
    );

    res.status(200).json({ location_id: result.insertId });
  } catch (err) {
    console.error("Error saving location:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get the latest location by place name
export const getLatestLocationByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Missing name" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT location_id, latitude, longitude
       FROM Location
       WHERE name = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No location found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching location:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
