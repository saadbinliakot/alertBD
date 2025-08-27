import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [err, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(inputs);
      console.log("Login successful, navigating to /home");
      navigate("/home");
    } catch (error: any) {
      setError(error.response?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Background floating blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-800/50 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-12 py-6 bg-transparent z-10">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
          AlertBD
        </h1>
        <div className="flex gap-4">
        </div>
      </nav>

      {/* Login Card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#0f1429]/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-white text-center mb-2">Login</h1>
          <p className="text-gray-300 text-center mb-6">
            Enter your credentials to access your account
          </p>

          {/* Input fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
            />

            <button
              type="submit"
              className="w-full px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-medium shadow-md transition mt-4"
            >
              Login
            </button>

            {err && (
              <p className="text-red-500 text-sm italic mt-2 text-center">{err}</p>
            )}
          </form>

          {/* Register Link */}
          <p className="text-gray-400 text-center mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-white font-medium hover:text-gray-400 transition"
            >
              Register
            </Link>
          </p>

          {/* Optional: Forgot password */}
          <div className="text-sm text-gray-400 text-center mt-2">
            <a href="#" className="hover:text-white transition">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-300 py-6 bg-transparent relative z-10">
        © {new Date().getFullYear()} AlertBD. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
