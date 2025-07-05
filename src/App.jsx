import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/config";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import VotePage from "./components/voting/voting";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/SIgnup";

export default function App() {
  useEffect(() => {
    // Sign out user on app load to force landing on signup/home
    signOut(auth).catch((error) => {
      console.error("Error signing out on app start:", error);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Only voters */}
        <Route
          path="/voter"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <VotePage />
            </ProtectedRoute>
          }
        />

        {/* Only admins */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
