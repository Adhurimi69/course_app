// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    if (allowedRoles.includes(role)) {
      return children;
    } else {
      return <Navigate to={`/${role}s/courses`} replace />;
    }
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
