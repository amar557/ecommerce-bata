import { NavLink } from "react-router-dom";
import { PiGearSixLight, PiHandbagSimpleThin, PiPoliceCarLight, PiUserLight } from "react-icons/pi";
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
            src={logo}
            alt="Bata"
            className="h-[4rem] w-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          />
          <div className="flex text-sm items-center gap-4 pe-8 relative z-10">
            <img
              src={logo}
              alt="Bata"
              className="h-[4rem] w-auto"
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
            {user?.admin && (
              <li
                className="flex flex-col items-center capitalize font-light cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => navigateTo("/admin")}
              >
                <span className="text-lg">
                  <PiGearSixLight />
                </span>
                <span>admin</span>
              </li>
            )}
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
                  <span className="absolute -top-3 -right-3 bg-deepRed-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </span>

              <span>PKR {totalPrice}</span>
            </li>
          </div>
        </div>

        <ul className="relative z-20 flex items-center border-y border-slate-300 justify-start gap-3 px-8 flex-wrap overflow-visible">
          <div
            className="relative"
            onMouseEnter={() => setOpen("male")}
            onMouseLeave={() => setOpen("")}
          >
            <li className="font-semibold text-base py-2 uppercase list-none">
              <NavLink
                to={buildProductsUrl("male")}
                className={({ isActive }) =>
                  isActive ? "text-deepRed-600" : "hover:text-slate-900"
                }
              >
                man
              </NavLink>
            </li>
            {open === "male" &&
              (maleNav.categories.length > 0 ||
                maleNav.brands.length > 0 ||
                maleNav.accessories.length > 0) && (
              <div className="absolute left-0 top-full z-50 flex items-start p-4 justify-start bg-white border shadow-md space-y-1 min-w-[min(100vw-2rem,520px)] max-w-[90vw] flex-wrap sm:flex-nowrap">
                <div className="border-r border-slate-200 pr-2 max-h-72 overflow-y-auto min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  <li className="px-5 py-1 text-slate-500 text-sm list-none">
                    <NavLink
                      to={buildProductsUrl("male")}
                      className="hover:text-deepRed-600"
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
                  isActive ? "text-deepRed-600" : "hover:text-slate-900"
                }
              >
                woman
              </NavLink>
            </li>
            {open === "woman" &&
              (femaleNav.categories.length > 0 ||
                femaleNav.brands.length > 0 ||
                femaleNav.accessories.length > 0) && (
              <div className="absolute left-0 top-full z-50 flex items-start p-4 justify-start bg-white border shadow-md space-y-1 min-w-[min(100vw-2rem,520px)] max-w-[90vw] flex-wrap sm:flex-nowrap">
                <div className="border-r border-slate-200 pr-2 max-h-72 overflow-y-auto min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  <li className="px-5 py-1 text-slate-500 text-sm list-none">
                    <NavLink
                      to={buildProductsUrl("female")}
                      className="hover:text-deepRed-600"
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
                  isActive ? "text-deepRed-600" : "hover:text-slate-900"
                }
              >
                kids
              </NavLink>
            </li>
            {open === "kids" &&
              (kidsNav.categories.length > 0 ||
                kidsNav.brands.length > 0 ||
                kidsNav.accessories.length > 0) && (
              <div className="absolute left-0 top-full z-50 flex items-start p-4 justify-start bg-white border shadow-md space-y-1 min-w-[min(100vw-2rem,520px)] max-w-[90vw] flex-wrap sm:flex-nowrap">
                <div className="border-r border-slate-200 pr-2 max-h-72 overflow-y-auto min-w-[140px]">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  <li className="px-5 py-1 text-slate-500 text-sm list-none">
                    <NavLink
                      to={buildProductsUrl("kids")}
                      className="hover:text-deepRed-600"
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
                open === item.title &&
                maleNav.accessories?.length > 0 && (
                  <div className="absolute left-0 top-full z-50 bg-white border shadow-md space-y-1 min-w-[200px] max-h-72 overflow-y-auto">
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
              {item.children &&
                !item.dynamicAccessories &&
                open === item.title && (
                <div className="absolute left-0 top-full z-50 bg-white border shadow-md space-y-1">
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
