import { pool } from "../db.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


export const register = (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Check if user already exists
  const checkQuery = "SELECT * FROM `user` WHERE email = ? OR name = ?";
  pool.query(checkQuery, [email, name], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert user
    const insertQuery =
      "INSERT INTO `user` (`name`, `email`, `password_hash`, `phone`, `role`) VALUES (?)";
    const values = [
      name, 
      email, 
      hash, 
      phone || null, 
      role || "Citizen"
    ];

    pool.query(insertQuery, [values], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res)=>{
    // Check user exists
    const { name, email, password, phone, role } = req.body;

    const q = "SELECT * FROM `user` WHERE email = ?"
    pool.query(q, [email], (err,data)=>{
        if (err) return res.json(err);
        if(data.length === 0) return res.status(404).json("User not found")
        
        // Check password
        const user = data[0]
        const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash)
        
        if (!isPasswordCorrect) return res.status(400).json("Wrong email or password")
    
        const token = jwt.sign({id:user.user_id}, "jwtkey")
        const { password_hash, ...other } = user

        res.cookie("access_token", token, {httpOnly:true}).status(200).json(other)

    })
}

export const logout = (req, res)=>{
    
}