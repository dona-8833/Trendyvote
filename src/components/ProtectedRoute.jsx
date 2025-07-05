// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !userData || !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
