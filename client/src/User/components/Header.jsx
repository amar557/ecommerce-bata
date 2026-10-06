import { Link, useLocation } from "react-router-dom";
import {
  PiGearSixLight,
  PiHandbagSimpleThin,
  PiPoliceCarLight,
  PiUserLight,
  PiQuestionLight,
} from "react-icons/pi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCart } from "../../Admin/Redux/Slices/cartSlice";
import axiosInstance from "../../constants/axiosInstance";
import { useNavigationController } from "../../constants/navigation";
import { categoriesArray } from "../headerData";
import AuthModal from "./AuthModal";
import logo from "../../assets/logo2.png";

/** Same filter semantics as the all-products page: gender + optional category/brand/accessory names in the query string. */
function buildProductsUrl(gender, { category, brand, accessory } = {}) {
  const params = new URLSearchParams();
  params.set("gender", gender);
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (accessory) params.set("accessory", accessory);
  return `/products?${params.toString()}`;
}

/** Products page filtered by accessory name only (all genders). */
function buildProductsAccessoryOnlyUrl(accessoryName) {
  const params = new URLSearchParams();
  params.set("accessory", accessoryName);
  return `/products?${params.toString()}`;
}

/** Active state must match query params — not just /products pathname. */
function isNavLinkActive(to, location) {
  const [pathPart, queryPart = ""] = String(to).split("?");
  if (location.pathname !== pathPart) return false;

  const expected = new URLSearchParams(queryPart);
  const current = new URLSearchParams(location.search);
  const expectedKeys = [...expected.keys()];

  if (expectedKeys.length === 0) {
    // Bare /products — active only when no product filters are set
    return !["gender", "category", "brand", "accessory", "offer"].some((k) =>
      current.get(k)
    );
  }

  return expectedKeys.every((key) => current.get(key) === expected.get(key));
}

function MegaMenuColumn({ title, children }) {
  return (
    <div className="min-w-[160px] max-h-72 overflow-y-auto px-2 first:pl-0 last:pr-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 px-3">
        {title}
      </h3>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function MegaMenuLink({ to, children, onNavigate }) {
  return (
    <li className="list-none">
      <Link
        to={to}
        onClick={onNavigate}
        className="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-deepRed-50 hover:text-deepRed-700 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function NavItemLink({ to, children, isOpen }) {
  const location = useLocation();
  const active = isNavLinkActive(to, location);

  return (
    <Link
      to={to}
      className={`relative inline-flex items-center px-1 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
        active || isOpen
          ? "text-deepRed-600"
          : "text-gray-800 hover:text-deepRed-600"
      }`}
    >
      {children}
      <span
        className={`absolute left-0 right-0 bottom-0 h-0.5 bg-deepRed-600 transition-transform origin-left ${
          active || isOpen ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}

function GenderMegaMenu({ gender, nav, open, setOpen, label }) {
  const hasContent =
    (nav.categories?.length || 0) > 0 ||
    (nav.brands?.length || 0) > 0 ||
    (nav.accessories?.length || 0) > 0;
  const isOpen = open === gender;
  const close = () => setOpen("");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(gender)}
      onMouseLeave={() => setOpen("")}
    >
      <NavItemLink to={buildProductsUrl(gender)} isOpen={isOpen}>
        {label}
      </NavItemLink>

      {isOpen && hasContent && (
        <div className="absolute left-0 top-full z-[60]">
          {/* Hover bridge so the menu does not close between link and panel */}
          <div className="h-2 w-full" />
          <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-white p-5 shadow-xl min-w-[min(100vw-2rem,540px)] max-w-[90vw] flex-wrap sm:flex-nowrap">
            <div className="sm:border-r sm:border-gray-100 sm:pr-3">
              <MegaMenuColumn title="Categories">
                <MegaMenuLink to={buildProductsUrl(gender)} onNavigate={close}>
                  All products
                </MegaMenuLink>
                {(nav.categories || []).map((cat) => (
                  <MegaMenuLink
                    key={String(cat._id)}
                    to={buildProductsUrl(gender, { category: cat.category })}
                    onNavigate={close}
                  >
                    {cat.category}
                  </MegaMenuLink>
                ))}
              </MegaMenuColumn>
            </div>
            <div className="sm:border-r sm:border-gray-100 sm:px-3">
              <MegaMenuColumn title="Brands">
                {(nav.brands || []).map((b) => (
                  <MegaMenuLink
                    key={String(b._id)}
                    to={buildProductsUrl(gender, { brand: b.brand })}
                    onNavigate={close}
                  >
                    {b.brand}
                  </MegaMenuLink>
                ))}
              </MegaMenuColumn>
            </div>
            <div className="sm:pl-3">
              <MegaMenuColumn title="Accessories">
                {(nav.accessories || []).map((a) => (
                  <MegaMenuLink
                    key={String(a._id)}
                    to={buildProductsUrl(gender, { accessory: a.accessory })}
                    onNavigate={close}
                  >
                    {a.accessory}
                  </MegaMenuLink>
                ))}
              </MegaMenuColumn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderAction({ icon: Icon, label, onClick, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-0.5 min-w-[3.25rem] text-gray-700 hover:text-deepRed-600 transition-colors"
    >
      <span className="relative text-xl leading-none">
        <Icon />
        {badge > 0 && (
          <span className="absolute -top-2 -right-2.5 bg-deepRed-600 text-white text-[10px] font-bold rounded-full min-w-[1.15rem] h-[1.15rem] px-1 flex items-center justify-center shadow-sm">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="text-[11px] font-medium capitalize tracking-wide max-w-[4.5rem] truncate">
        {label}
      </span>
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState("");
  const [maleNav, setMaleNav] = useState({
    categories: [],
    brands: [],
    accessories: [],
  });
  const [femaleNav, setFemaleNav] = useState({
    categories: [],
    brands: [],
    accessories: [],
  });
  const [kidsNav, setKidsNav] = useState({
    categories: [],
    brands: [],
    accessories: [],
  });
  const { navigateTo } = useNavigationController();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "signin" });
  const { items } = useSelector((state) => state.cart);
  const cartCount = items?.length || 0;
  const totalPrice = items?.reduce(
    (sum, item) =>
      sum +
      (item?.productId?.discountPrice > item?.productId?.price
        ? item?.productId?.discountPrice
        : item?.productId?.price || 0) *
        (item?.quantity || 0),
    0
  );

  const getNavData = async (gender) => {
    try {
      const res = await axiosInstance.get(`/api/nav?gender=${gender}`);
      const data = res.data;
      return {
        categories: Array.isArray(data?.categories) ? data.categories : [],
        brands: Array.isArray(data?.brands) ? data.brands : [],
        accessories: Array.isArray(data?.accessories) ? data.accessories : [],
      };
    } catch (error) {
      console.error(`Error fetching ${gender} nav data:`, error);
      return { categories: [], brands: [], accessories: [] };
    }
  };

  useEffect(() => {
    async function fetchData() {
      const [maleData, femaleData, kidsData] = await Promise.all([
        getNavData("male"),
        getNavData("female"),
        getNavData("kids"),
      ]);
      setMaleNav(maleData);
      setFemaleNav(femaleData);
      setKidsNav(kidsData);
    }
    fetchData();
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAuthClick = () => {
    if (user?.name) {
      console.log("User is already logged in");
    } else {
      setAuthModal({ isOpen: true, mode: "signin" });
    }
  };

  const handleSwitchMode = () => {
    setAuthModal((prev) => ({
      isOpen: true,
      mode: prev.mode === "signin" ? "signup" : "signin",
    }));
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: "signin" });
  };

  const handleAuthSuccess = () => {};

  const handleToCart = () => {
    if (!user?.name) {
      toast.info("login first to check cart");
    } else {
      navigateTo("/cart");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="flex items-center shrink-0 focus:outline-none"
              aria-label="Bazar home"
            >
              <img
                src={logo}
                alt="Bazar"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </button>

            <div className="flex items-center gap-3 sm:gap-5">
              <HeaderAction
                icon={PiQuestionLight}
                label="Help"
                onClick={() => navigateTo("/contact")}
              />
              <HeaderAction
                icon={PiUserLight}
                label={user?.name ? user.name : "Login"}
                onClick={handleAuthClick}
              />
              {user?.admin && (
                <HeaderAction
                  icon={PiGearSixLight}
                  label="Admin"
                  onClick={() => navigateTo("/admin")}
                />
              )}
              {user?.name && (
                <HeaderAction
                  icon={PiPoliceCarLight}
                  label="Orders"
                  onClick={() => navigateTo("/track-order")}
                />
              )}
              <button
                type="button"
                onClick={handleToCart}
                className="group flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 pl-3 pr-4 py-1.5 hover:border-deepRed-300 hover:bg-deepRed-50 transition-colors"
              >
                <span className="relative text-xl text-gray-800 group-hover:text-deepRed-600">
                  <PiHandbagSimpleThin />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-deepRed-600 text-white text-[10px] font-bold rounded-full min-w-[1.15rem] h-[1.15rem] px-1 flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    Cart
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    PKR {Number(totalPrice || 0).toLocaleString("en-PK")}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Category nav — no overflow-x-auto so dropdowns are not clipped */}
        <nav className="border-t border-gray-100 bg-white overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
            <ul className="relative z-20 flex items-center gap-5 sm:gap-7 flex-wrap overflow-visible">
              <li className="list-none">
                <GenderMegaMenu
                  gender="male"
                  label="Men"
                  nav={maleNav}
                  open={open}
                  setOpen={setOpen}
                />
              </li>
              <li className="list-none">
                <GenderMegaMenu
                  gender="female"
                  label="Women"
                  nav={femaleNav}
                  open={open}
                  setOpen={setOpen}
                />
              </li>
              <li className="list-none">
                <GenderMegaMenu
                  gender="kids"
                  label="Kids"
                  nav={kidsNav}
                  open={open}
                  setOpen={setOpen}
                />
              </li>

              {categoriesArray.map((item) => {
                const isOpen = open === item.title;
                const nestItems = item.dynamicAccessories
                  ? maleNav.accessories || []
                  : item.children || [];
                const hasNest = nestItems.length > 0;

                return (
                  <li
                    key={item.title}
                    className="relative list-none"
                    onMouseEnter={() => setOpen(item.title)}
                    onMouseLeave={() => setOpen("")}
                  >
                    <NavItemLink to={item.link} isOpen={isOpen}>
                      {item.title}
                    </NavItemLink>

                    {isOpen && hasNest && (
                      <div className="absolute left-0 top-full z-[60]">
                        <div className="h-2 w-full" />
                        <ul className="min-w-[200px] max-h-72 overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                          {item.dynamicAccessories
                            ? nestItems.map((a) => (
                                <MegaMenuLink
                                  key={String(a._id)}
                                  to={buildProductsAccessoryOnlyUrl(a.accessory)}
                                  onNavigate={() => setOpen("")}
                                >
                                  {a.accessory}
                                </MegaMenuLink>
                              ))
                            : nestItems.map((nested) => (
                                <MegaMenuLink
                                  key={nested.title}
                                  to={nested.link}
                                  onNavigate={() => setOpen("")}
                                >
                                  {nested.title}
                                </MegaMenuLink>
                              ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={handleCloseAuth}
        mode={authModal.mode}
        onSwitchMode={handleSwitchMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Header;
