import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAppContext();
  const location = useLocation();

  if (!user.isLoggedIn) {
    const redirectTo = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ redirectTo }} />;
  }

  return children;
}
