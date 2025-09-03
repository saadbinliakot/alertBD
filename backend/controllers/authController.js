import { pool } from "../db.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM `user` WHERE email = ? OR name = ?",
      [email, name]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json("User already exists");
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert user
    const values = [name, email, hash, phone || null, role || "Citizen"];
    await pool.query(
      "INSERT INTO `user` (`name`, `email`, `password_hash`, `phone`, `role`) VALUES (?)",
      [values]
    );

    console.log("User registered:", email);
    return res.status(200).json("User has been created.");
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json("Internal server error");
  }
};
export const login = async (req, res) => {
  console.log("Login route hit");
  console.log("Request body:", req.body);

  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM `user` WHERE email = ?", [email]);

    console.log("User query result:", rows);

    if (rows.length === 0) {
      console.log("User not found");
      return res.status(404).json("User not found");
    }

    const user = rows[0];
    const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash);
    console.log("Password correct:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong email or password");
    }

    const token = jwt.sign({ id: user.user_id }, "jwtkey");
    const { password_hash, ...other } = user;

    console.log("Sending response:", other);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Lax",
    }).status(200).json(other);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json("Internal server error");
  }
};

export const logout = async (req, res)=>{
    
  res.clearCookie("access_token", {
    sameSite:"None",
    secure:true
  }).status(200).json("User has been logged out.")
}