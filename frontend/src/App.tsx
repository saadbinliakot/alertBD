import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import RequireAdmin from "./components/RequireAdmin";
import { AuthContextProvider } from "./context/authContext";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Background floating dark blue blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-800/50 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-12 py-6 bg-transparent z-50">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
          AlertBD
        </h1>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="text-white/90 px-5 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-start text-left px-16 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg flex flex-wrap items-center gap-2">
            <span className="mr-2">Introducing</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              AlertBD
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed">
            A next-generation disaster alert and resource coordination platform,
            built to keep communities safe in real-time.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
            <a
              href="#learn-more"
              className="text-white px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-300 py-6 bg-transparent relative z-10">
        © {new Date().getFullYear()} AlertBD. All rights reserved.
      </footer>
    </div>
  );
};

// Routes
const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <Home /> },
  { path: "/report", element: <Reports /> },
  { path: "/admin", element: <RequireAdmin><Admin /></RequireAdmin> },
  { path: "*", element: <div className="text-white p-8">404 - Page Not Found</div> },
]);

const App: React.FC = () => (
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
);

export default App;