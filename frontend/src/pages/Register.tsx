import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Citizen",
  });

  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0f1c] relative">
      {/* Background Project Name */}
      <h1 className="absolute text-[6rem] font-extrabold text-[#0a0f1c] opacity-10 select-none">
        AlertBD
      </h1>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0f1429]/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Register</h1>
        <p className="text-gray-300 text-center mb-6">
          Create a new account to start using AlertBD
        </p>

        <div className="flex flex-col gap-5">
          <input
            required
            type="text"
            placeholder="Full Name"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
          <input
            required
            type="email"
            placeholder="Email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
          <input
            required
            type="password"
            placeholder="Password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
          <input
            required
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={inputs.confirmPassword}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
          <input
            type="text"
            placeholder="Phone (optional)"
            name="phone"
            value={inputs.phone}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />

          <select
            name="role"
            value={inputs.role}
            onChange={handleChange}
            className="appearance-none w-full bg-[#0f1429] border-b-2 border-gray-600 text-white py-2 pr-10 focus:outline-none focus:border-white rounded-none"
          >
            <option value="Citizen">Citizen</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-white hover:bg-gray-200 text-[#0a0f1c] rounded-lg font-medium shadow-md transition mt-4"
          >
            Register
          </button>
        </div>

        {err && (
          <p className="text-red-500 text-sm italic mt-2 text-center">{err}</p>
        )}

        <p className="text-gray-400 text-center mt-4">
          Do you have an account?{" "}
          <Link
            to="/login"
            className="text-white hover:text-gray-400 font-medium transition"
          >
            Login Now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
