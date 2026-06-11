import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  CLAIM_ROLE,
  getDecodedToken,
  getToken,
  isTokenExpired,
  removeToken,
} from "@/lib/auth";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

const normalizeRole = (role?: string | null) => role?.trim().toLowerCase() ?? "";

const getLegacyStoredRole = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  return normalizeRole(localStorage.getItem("role"));
};

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    removeToken();
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const decodedToken = getDecodedToken();

  if (decodedToken && isTokenExpired()) {
    removeToken();
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const currentRole = normalizeRole(decodedToken?.[CLAIM_ROLE]) || getLegacyStoredRole();
  const normalizedAllowedRoles = allowedRoles?.map(normalizeRole) ?? [];

  if (!currentRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(currentRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
