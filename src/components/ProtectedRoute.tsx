import React from "react";
import ProtectedRouteComponent from "./common/ProtectedRoute";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  return <ProtectedRouteComponent requireAdmin={requireAdmin}>{children}</ProtectedRouteComponent>;
}
