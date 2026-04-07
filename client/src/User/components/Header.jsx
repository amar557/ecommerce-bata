import { NavLink } from "react-router-dom";
import { PiHandbagSimpleThin, PiPoliceCarLight, PiUserLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCart } from "../../Admin/Redux/Slices/cartSlice";
import axiosInstance from "../../constants/axiosInstance";
import { useNavigationController } from "../../constants/navigation";
import { categoriesArray } from "../headerData";
import AuthModal from "./AuthModal";

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
      (item?.productId.discountPrice > item?.productId.price
        ? item?.productId.discountPrice
        : item?.productId.price) *
        item?.quantity,
    0
  );
  const getNavData = async (gender) => {
    try {
      const res = await axiosInstance.get(`/api/nav?gender=${gender}`);
      const data = res.data;
      return {
        categories: Array.isArray(data?.categories) ? data.categories : [],
        brands: Array.isArray(data?.brands) ? data.brands : [],
        accessories: Array.isArray(data?.accessories)
          ? data.accessories
          : [],
      };
    } catch (error) {
      console.error(`Error fetching ${gender} nav data:`, error);
      return { categories: [], brands: [], accessories: [] };
    }
  };

  const getCartTotal = async () => {
    try {
      // const res = await axiosInstance.get("/api/cart/total");
      dispatch(fetchCart());
      // setCartTotal(res.data.total || 0);
    } catch (error) {
      console.error("Error fetching cart total:", error);
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

    getCartTotal();
  }, []);

  const handleAuthClick = () => {
    if (user?.name) {
      // Handle logout or navigate to profile
      // You can add logout logic here
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

  const handleAuthSuccess = (userData) => {

  };

  let handleToCart = () => {
    if (!user?.name) {
      toast.info("login first to check cart");
    } else {
      navigateTo("/cart");
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="bg-[#f3f3f3] text-sm w-full ps-10 first-letter:capitalize tracking-wide py-1 border-y font-medium">
          email:amarhussain391@gmail.com
        </div>
        <div className="flex py-2 items-center justify-end relative">
          <img
            onClick={() => navigateTo("/")}
            src="https://www.bata.com.pk/cdn/shop/files/Bata-logo_1.png?v=1686635439&width=500"
            alt=""
            className="h-10 w-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
          />
          <div className="flex text-sm items-center justify-between pe-8  w-[30%]">
            <img
              src="https://www.bata.com.pk/cdn/shop/files/Asset_1.png?v=1695707853"
              alt=""
              className="h-8 w-auto "
            />
            <li className="uppercase font-light border-b border-black list-none  ">
              <NavLink>help</NavLink>
            </li>
            <li
              className="flex flex-col items-center capitalize font-light cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleAuthClick}
            >
              <span className="text-lg">
                <PiUserLight />
              </span>
              <span>{user?.name ? user?.name : "login"}</span>
            </li>
            {user?.name && (
              <li
                className="flex flex-col items-center capitalize font-light cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => navigateTo("/track-order")}
              >
                <span className="text-lg">
                  <PiPoliceCarLight />
                </span>
                <span>track order</span>
              </li>
            )}

            <li
              className="relative flex flex-col items-center  capitalize font-light cursor-pointer"
              onClick={handleToCart}
            >
              <span className="text-lg relative">
                <PiHandbagSimpleThin />

                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </span>

              <span>Rs. {totalPrice}</span>
            </li>
          </div>
        </div>

        <ul className="flex items-center border-y border-slate-300 justify-start gap-3 px-8 flex-wrap">
          <div
            className="relative"
            onMouseEnter={() => setOpen("male")}
            onMouseLeave={() => setOpen("")}
          >
            <li className="font-semibold text-base py-2 uppercase list-none">
              <NavLink
                to={buildProductsUrl("male")}
                className={({ isActive }) =>
                  isActive ? "text-red-600" : "hover:text-slate-900"
                }
              >
                man
              </NavLink>
            </li>
            {(maleNav.categories.length > 0 ||
              maleNav.brands.length > 0 ||
              maleNav.accessories.length > 0) && (
              <div
                className={`absolute flex items-start p-4 justify-start top-10 left-1/2 -translate-x-1/3 bg-white border shadow-sm transition-all space-y-1 min-w-[min(100vw-2rem,520px)] max-w-[90vw] flex-wrap sm:flex-nowrap ${
                  open === "male"
                    ? "opacity-100 z-10 visible"
                    : "opacity-0 -z-10 invisible"
                }`}
              >
                <div className="border-r border-slate-200 pr-2 max-h-72 overflow-y-auto min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  <li className="px-5 py-1 text-slate-500 text-sm list-none">
                    <NavLink
                      to={buildProductsUrl("male")}
                      className="hover:text-red-600"
                    >
                      All products
                    </NavLink>
                  </li>
                  {maleNav.categories.map((cat) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(cat._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("male", {
                          category: cat.category,
                        })}
                      >
                        {cat.category}
                      </NavLink>
                    </li>
                  ))}
                </div>
                <div className="border-r border-slate-200 max-h-72 overflow-y-auto px-2 min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    brands
                  </h3>
                  {maleNav.brands.map((b) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(b._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("male", { brand: b.brand })}
                      >
                        {b.brand}
                      </NavLink>
                    </li>
                  ))}
                </div>
                <div className="max-h-72 overflow-y-auto pl-2 min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    accessories
                  </h3>
                  {maleNav.accessories.map((a) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(a._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("male", {
                          accessory: a.accessory,
                        })}
                      >
                        {a.accessory}
                      </NavLink>
                    </li>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpen("woman")}
            onMouseLeave={() => setOpen("")}
          >
            <li className="font-semibold text-base py-2 uppercase list-none">
              <NavLink
                to={buildProductsUrl("female")}
                className={({ isActive }) =>
                  isActive ? "text-red-600" : "hover:text-slate-900"
                }
              >
                woman
              </NavLink>
            </li>
            {(femaleNav.categories.length > 0 ||
              femaleNav.brands.length > 0 ||
              femaleNav.accessories.length > 0) && (
              <div
                className={`absolute p-4 flex items-start justify-start top-10 left-1/2 -translate-x-1/3 bg-white border shadow-sm transition-all space-y-1 min-w-[min(100vw-2rem,520px)] max-w-[90vw] flex-wrap sm:flex-nowrap ${
                  open === "woman"
                    ? "opacity-100 z-10 visible"
                    : "opacity-0 -z-10 invisible"
                }`}
              >
                <div className="border-r border-slate-200 pr-2 max-h-72 overflow-y-auto min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  <li className="px-5 py-1 text-slate-500 text-sm list-none">
                    <NavLink
                      to={buildProductsUrl("female")}
                      className="hover:text-red-600"
                    >
                      All products
                    </NavLink>
                  </li>
                  {femaleNav.categories.map((cat) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(cat._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("female", {
                          category: cat.category,
                        })}
                      >
                        {cat.category}
                      </NavLink>
                    </li>
                  ))}
                </div>
                <div className="border-r border-slate-200 max-h-72 overflow-y-auto px-2 min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    brands
                  </h3>
                  {femaleNav.brands.map((b) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(b._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("female", { brand: b.brand })}
                      >
                        {b.brand}
                      </NavLink>
                    </li>
                  ))}
                </div>
                <div className="max-h-72 overflow-y-auto pl-2 min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    accessories
                  </h3>
                  {femaleNav.accessories.map((a) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(a._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("female", {
                          accessory: a.accessory,
                        })}
                      >
                        {a.accessory}
                      </NavLink>
                    </li>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpen("kids")}
            onMouseLeave={() => setOpen("")}
          >
            <li className="font-semibold text-base py-2 uppercase list-none">
              <NavLink
                to={buildProductsUrl("kids")}
                className={({ isActive }) =>
                  isActive ? "text-red-600" : "hover:text-slate-900"
                }
              >
                kids
              </NavLink>
            </li>
            {(kidsNav.categories.length > 0 ||
              kidsNav.brands.length > 0 ||
              kidsNav.accessories.length > 0) && (
              <div
                className={`absolute flex items-start p-4 justify-start top-10 left-1/2 -translate-x-1/3 bg-white border shadow-sm transition-all space-y-1 min-w-[min(100vw-2rem,520px)] max-w-[90vw] flex-wrap sm:flex-nowrap ${
                  open === "kids"
                    ? "opacity-100 z-10 visible"
                    : "opacity-0 -z-10 invisible"
                }`}
              >
                <div className="border-r border-slate-200 pr-2 max-h-72 overflow-y-auto min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  <li className="px-5 py-1 text-slate-500 text-sm list-none">
                    <NavLink
                      to={buildProductsUrl("kids")}
                      className="hover:text-red-600"
                    >
                      All products
                    </NavLink>
                  </li>
                  {kidsNav.categories.map((cat) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(cat._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("kids", {
                          category: cat.category,
                        })}
                      >
                        {cat.category}
                      </NavLink>
                    </li>
                  ))}
                </div>
                <div className="border-r border-slate-200 max-h-72 overflow-y-auto px-2 min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    brands
                  </h3>
                  {kidsNav.brands.map((b) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(b._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("kids", { brand: b.brand })}
                      >
                        {b.brand}
                      </NavLink>
                    </li>
                  ))}
                </div>
                <div className="max-h-72 overflow-y-auto pl-2 min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    accessories
                  </h3>
                  {kidsNav.accessories.map((a) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-8 hover:bg-slate-100 cursor-pointer transition-all list-none"
                      key={String(a._id)}
                    >
                      <NavLink
                        to={buildProductsUrl("kids", {
                          accessory: a.accessory,
                        })}
                      >
                        {a.accessory}
                      </NavLink>
                    </li>
                  ))}
                </div>
              </div>
            )}
          </div>

          {categoriesArray.map((item) => (
            <div
              className="relative"
              onMouseEnter={() => setOpen(item.title)}
              onMouseLeave={() => setOpen("")}
              key={item.title}
            >
              <li className="font-semibold text-base py-2 uppercase list-none">
                <NavLink to={item.link}>{item.title}</NavLink>
              </li>
              {item.dynamicAccessories &&
                maleNav.accessories &&
                maleNav.accessories.length > 0 && (
                  <div
                    className={`absolute top-10 left-1/2 -translate-x-1/2 bg-white border shadow-sm transition-all space-y-1 min-w-[200px] max-h-72 overflow-y-auto z-10 ${
                      item.title === open
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                  >
                    {maleNav.accessories.map((a) => (
                      <li
                        className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-10 hover:bg-slate-200 transition-all list-none"
                        key={String(a._id)}
                      >
                        <NavLink
                          to={buildProductsAccessoryOnlyUrl(a.accessory)}
                        >
                          {a.accessory}
                        </NavLink>
                      </li>
                    ))}
                  </div>
                )}
              {item.children && !item.dynamicAccessories && (
                <div
                  className={`absolute top-10 left-1/2 -translate-x-1/2 bg-white border shadow-sm transition-all space-y-1 ${
                    item.title === open
                      ? "opacity-100 z-10 visible"
                      : "opacity-0 -z-10 invisible"
                  }`}
                >
                  {item.children.map((nested) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-10 hover:bg-slate-200 transition-all list-none"
                      key={nested.title}
                    >
                      <NavLink to={nested.link}>{nested.title}</NavLink>
                    </li>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ul>
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
