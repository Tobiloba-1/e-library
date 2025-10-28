import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Explore from "./pages/Explore";
import Auth from "./AuthComponent/Auth";
import Navbar from "./AuthComponent/Navbar";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user exists in localStorage at startup
    const storedUser = localStorage.getItem("user");
    if (storedUser) setIsAuthenticated(true);
  }, []);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/auth" replace />
          }
        />

        {/* Auth Page */}
        <Route
          path="/auth"
          element={
            !isAuthenticated ? (
              <Auth setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

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
