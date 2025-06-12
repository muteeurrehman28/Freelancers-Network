import React from "react";
import { Navigate } from "react-router-dom";

export const RoleRoute = ({ element: Element, allowed }) => {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) return <Navigate to="/login" replace />;
  const user = JSON.parse(userRaw);
  if (allowed && !allowed.includes(user.role)) return <Navigate to="/" replace />;
  return <Element />;
};
