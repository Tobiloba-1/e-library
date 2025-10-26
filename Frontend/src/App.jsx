import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Explore from "./pages/Explore";
import Auth from "./AuthComponent/Auth";
import Navbar from "./AuthComponent/Navbar";

export default function App() {
  // make auth reactive so UI updates on login/logout
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("user")
  );

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* When not authenticated redirect root to /auth so only auth page is available */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected routes */}
        <Route
          path="/assessment"
          element={
            isAuthenticated ? <Quiz /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/explore"
          element={
            isAuthenticated ? <Explore /> : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </Router>
  );
}
