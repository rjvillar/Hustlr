import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import NavbarHome from "./components/NavbarHome.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  const location = useLocation();
  const isHero =
    location.pathname === "/" ||
    location.pathname === "/auth/sign-in" ||
    location.pathname === "/auth/sign-up";

  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => setApiMessage(data.msg))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <AuthProvider>
      <div
        className={`h-full min-h-[calc(100vh-120px)] ${
          isHero ? "bg-[#fcdc73]" : "bg-[#f7f6fb]"
        }`}
      >
        <div className="flex-shrink-0">
          {isHero ? <Navbar /> : <NavbarHome />}
        </div>

        <div className="flex-1">
          <Routes>
            <Route path="/*" element={<Hero />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-jobs"
              element={
                <PrivateRoute>
                  <MyJobs />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
