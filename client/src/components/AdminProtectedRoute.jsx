import { Navigate } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth";

export default function AdminProtectedRoute({ children }) {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return children;
}

