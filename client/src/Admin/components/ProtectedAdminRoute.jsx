import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function getStoredAdmin() {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const parsed = JSON.parse(storedUser);
      if (parsed?.admin) return true;
    }
  } catch {
    // ignore invalid localStorage user
  }
  const adminFlag = localStorage.getItem("admin");
  return adminFlag === "true" || adminFlag === true;
}

function ProtectedAdminRoute() {
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token || localStorage.getItem("token"));
  const isAdmin = Boolean(user?.admin || getStoredAdmin());

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
