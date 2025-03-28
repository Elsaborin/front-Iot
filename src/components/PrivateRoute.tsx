// PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;