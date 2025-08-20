import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Reports from "./pages/Reports";
// import Alert from "./pages/Alert";
// import Admin from "./pages/Admin";

// Home page
const Entry = () => (
  <div className="h-screen flex items-center justify-center bg-[#0a0f1c] text-gray-100 relative">
    {/* Background Project Name */}
    <h1 className="absolute text-[6rem] font-extrabold text-[#0a0f1c] opacity-10 select-none">
      AlertBD
    </h1>

    {/* Dashboard Box */}
    <div className="relative z-10 w-full max-w-md bg-[#0f1429]/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-white mb-2">Welcome to AlertBD</h1>
      <p className="text-gray-300 text-center mb-6">
        Access your account or register to start monitoring alerts and reports.
      </p>

      {/* Inputs with underlines */}
      <div className="w-full flex flex-col gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white py-2"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <Link
          to="/login"
          className="w-full px-6 py-3 bg-white hover:bg-gray-200 text-[#0a0f1c] rounded-lg font-medium shadow-md text-center transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium shadow-md text-center transition"
        >
          Register
        </Link>
      </div>
    </div>
  </div>
);

// Set up routes
const router = createBrowserRouter([
  { path: "/", element: <Entry /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // { path: "/report", element: <Report /> },
  // { path: "/alert", element: <Alert /> },
  // { path: "/admin", element: <Admin /> },
]);



const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;


