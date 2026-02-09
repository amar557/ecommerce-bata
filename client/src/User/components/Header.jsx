import { NavLink, useNavigate } from "react-router-dom";
import { PiUserLight } from "react-icons/pi";
import { PiPoliceCarLight } from "react-icons/pi";
import { PiHandbagSimpleThin } from "react-icons/pi";
import { categoriesArray } from "../headerData";
import { useEffect, useState } from "react";
import axiosInstance from "../../constants/axiosInstance";
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigationController } from "../../constants/navigation";
import { fetchCart } from "../../Admin/Redux/Slices/cartSlice";
import { toast } from "react-toastify";
function Header() {
  const [open, setOpen] = useState("");
  const [male, setMale] = useState([]);
  const [female, setFemale] = useState([]);
  const { navigateTo } = useNavigationController();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "signin" });
  const {
    items,
    error: cartError,
    loading: cartLoading,
  } = useSelector((state) => state.cart);
  console.log(user);

  const cartCount = items?.length || 0;
  const totalPrice = items?.reduce(
    (sum, item) =>
      sum +
      (item?.productId.discountPrice < item?.productId.price
        ? item?.productId.discountPrice
        : item?.productId.price) *
        item?.quantity,
    0
  );
  const getNavData = async (gender) => {
    try {
      const res = await axiosInstance.get(`/api/nav?gender=${gender}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching ${gender} nav data:`, error);
      return [];
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
      const [maleData, femaleData] = await Promise.all([
        getNavData("male"),
        getNavData("female"),
      ]);
      setMale(maleData);
      setFemale(femaleData);
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

        <ul className="flex items-center border-y border-slate-300 justify-start gap-3 px-8">
          <li className="font-semibold text-base py-2 uppercase">
            <NavLink className={"/man"}>man</NavLink>
          </li>
          <div
            className="relative"
            onMouseEnter={() => setOpen("male")}
            onMouseLeave={() => setOpen("")}
          >
            <li className="font-semibold text-base py-2 uppercase">
              <NavLink className={""}>man</NavLink>
            </li>
            {male && male.length > 0 && (
              <div
                className={`absolute flex items-start p-4 justify-start top-10 left-1/2 -translate-x-1/3 bg-white border shadow-sm transition-all space-y-1 ${
                  open === "male"
                    ? "opacity-100 z-10 visible"
                    : "opacity-0 -z-10 invisible"
                }`}
              >
                <div className="border-r">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  {male &&
                    male.length > 0 &&
                    male.map((nested) => (
                      <li
                        className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-20  hover:bg-slate-200 cursor-pointer transition-all"
                        key={nested.title}
                      >
                        <NavLink to={nested}>{nested.category}</NavLink>
                      </li>
                    ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    brands
                  </h3>
                  {male &&
                    male.length > 0 &&
                    male.map((nested) => (
                      <li
                        className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-10 hover:bg-slate-200 cursor-pointer transition-all pe-20"
                        key={nested.title}
                      >
                        <NavLink to={nested}>{nested.brand}</NavLink>
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
            <li className="font-semibold text-base py-2 uppercase">
              <NavLink className={""}>woman</NavLink>
            </li>
            {female && female.length > 0 && (
              <div
                className={`absolute p-4 flex items-start justify-start top-10 left-1/2 -translate-x-1/3 bg-white border shadow-sm transition-all space-y-1 ${
                  open === "woman"
                    ? "opacity-100 z-10 visible"
                    : "opacity-0 -z-10 invisible"
                }`}
              >
                <div className="border-r">
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    categories
                  </h3>
                  {female &&
                    female.length > 0 &&
                    female.map((nested) => (
                      <li
                        className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-10 hover:bg-slate-200 cursor-pointer transition-all pe-20"
                        key={nested.title}
                      >
                        <NavLink to={nested}>{nested.category}</NavLink>
                      </li>
                    ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold px-5 capitalize mb-3">
                    brands
                  </h3>
                  {female &&
                    female.length > 0 &&
                    female.map((nested) => (
                      <li
                        className="px-5 pe-20 py-1 text-slate-600 hover:text-slate-900 text-nowrap  hover:bg-slate-200 cursor-pointer transition-all"
                        key={nested.title}
                      >
                        <NavLink to={nested}>{nested.brand}</NavLink>
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
              <li className="font-semibold text-base py-2 uppercase">
                <NavLink className={item.link}>{item.title}</NavLink>
              </li>
              {item.children && (
                <div
                  className={`absolute top-10 left-1/2 -translate-x-1/2 bg-white border shadow-sm transition-all space-y-1 ${
                    item.title === open
                      ? "opacity-100 z-10 visible"
                      : "opacity-0 -z-10 invisible"
                  }`}
                >
                  {item.children.map((nested) => (
                    <li
                      className="px-5 py-1 text-slate-600 hover:text-slate-900 text-nowrap pe-10 hover:bg-slate-200 transition-all"
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
