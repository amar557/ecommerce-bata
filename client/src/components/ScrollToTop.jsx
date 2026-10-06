import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll window to top whenever the route (pathname or search) changes. */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
