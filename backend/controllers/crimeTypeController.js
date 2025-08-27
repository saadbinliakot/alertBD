import { pool } from '../db.js';

export const getCrimeTypes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT crime_type_id, name FROM CrimeType');
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching crime types:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
