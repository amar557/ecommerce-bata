import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Custom hook that returns navigation functions
 * for cleaner navigation throughout the app.
 */
export const useNavigationController = () => {
  const navigate = useNavigate();

  const navigateToHome = useCallback(() => navigate("/"), [navigate]);
  const navigateToAbout = useCallback(() => navigate("/about"), [navigate]);
  const navigateToDashboard = useCallback(() => navigate("/dashboard"), [navigate]);
  const navigateToLogin = useCallback(() => navigate("/login"), [navigate]);
  const navigateBack = useCallback(() => navigate(-1), [navigate]);

  /**
   * 🔹 Generic navigation function
   * Allows navigation to any route received dynamically (e.g. from props)
   */
  const navigateTo = useCallback(
    (path, options = {}) => {
      if (!path) {
        console.error("❌ navigateTo: Missing path argument");
        return;
      }
      navigate(path, options);
    },
    [navigate]
  );

  return {
    navigateToHome,
    navigateToAbout,
    navigateToDashboard,
    navigateToLogin,
    navigateBack,
    navigateTo, // ✅ exposed for dynamic routes
  };
};
