import { pool } from '../db.js';

export const submitReport = async (req, res) => {
  const { user_id, location_id, description, crime_type_id } = req.body;

  if (!user_id || !location_id || !description || !crime_type_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await pool.query(
      'INSERT INTO CrimeReport (crime_type_id, description, datetime, user_id, location_id, status, created_at) VALUES (?, ?, NOW(), ?, ?, "Pending", NOW())',
      [crime_type_id, description, user_id, location_id]
    );
    console.log("Received report:", req.body);
    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error('Error submitting report:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
