import { pool } from '../db.js';

export const saveLocation = async (req, res) => {
  const { latitude, longitude, name } = req.body;

  if (!latitude || !longitude || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Location (latitude, longitude, name, created_at) VALUES (?, ?, ?, NOW())',
      [latitude, longitude, name]
    );

    res.status(200).json({ location_id: result.insertId });
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLatestLocationByName = async (req, res) => {
  const { name } = req.query;
  console.log("Received name:", name);

  if (!name) return res.status(400).json({ error: "Missing name" });

  try {
    const query = `
      SELECT location_id, latitude, longitude
      FROM Location
      WHERE name = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    console.log("Running query:", query);

    const [rows] = await pool.query(query, [name]);
    console.log("Query result:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No location found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};