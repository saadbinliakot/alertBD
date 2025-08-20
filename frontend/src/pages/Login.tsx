
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [inputs, setInputs] = useState({
        email:"",
        password:"",
    })

    const [err, setError] = useState(null)

    const navigate = useNavigate()

    const handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3001/auth/login", inputs)
            navigate("/")
        } catch(err){
            setError(err.response.data)
        }

}
  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0f1c] relative">
      {/* Background Project Name */}
      <h1 className="absolute text-[6rem] font-extrabold text-[#0a0f1c] opacity-10 select-none">
        AlertBD
      </h1>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0f1429]/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Login</h1>
        <p className="text-gray-300 text-center mb-6">
          Enter your credentials to access your account
        </p>

        {/* Input fields with underline */}
        <div className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="email"
            name="email"
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
        </div>

        {/* Login Button */}
        <button onClick={handleSubmit} className="w-full px-6 py-3 bg-white hover:bg-gray-200 text-[#0a0f1c] rounded-lg font-medium shadow-md transition mt-4">
          Login
        </button>
        {err && (
        <p className="text-red-500 text-sm italic mt-2 text-center">
            {err}
        </p>
        )}

        {/* Register Link */}
        <p className="text-gray-400 text-center mt-4">
          Don’t have an account? {" "}
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
  );
};

export default Login;
