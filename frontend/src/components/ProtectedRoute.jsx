// ------------------------------------------------------------
// components/ProtectedRoute.jsx
// Wraps pages that need login. Optionally checks the role.
// Not logged in  -> go to /login
// Wrong role     -> go to that user's own dashboard
// ------------------------------------------------------------
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, dashboardPath } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }
  return children;
}
