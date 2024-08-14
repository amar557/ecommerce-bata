import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router";
import { MdShoppingCart } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  return (
    <div className="w-64 h-screen overflow-y-scroll bg-gray-800 text-secondary1 fixed">
      <ul>
        <button
          onClick={() => {
            navigate("/admin");
            toggleMenu();
          }}
          className="flex items-center justify-start gap-3 capitalize p-4 w-full text-left  hover:text-white"
        >
          <span>
            <MdDashboard />
          </span>
          <span>dashboard</span>
        </button>
        <button
          onClick={() => {
            navigate("/admin/orders");
            toggleMenu();
          }}
          className="flex items-center justify-start gap-3 capitalize p-4 w-full text-left  hover:text-white"
        >
          <span>
            <FaArrowTrendUp />
          </span>
          <span>orders</span>
        </button>

        <li>
          <button
            onClick={() => toggleMenu("allProducts")}
            className="flex items-center justify-between p-4 w-full text-left  hover:text-white"
          >
            <div className="flex items-center justify-center gap-3">
              <span>
                <MdShoppingCart />
              </span>
              <span>products</span>
            </div>
            <span
              className={` ${
                openMenu === "allProducts" ? "rotate-90" : "rotate-0 "
              }  overflow-hidden transition-all flex items-center justify-center duration-300`}
            >
              <IoIosArrowForward />
            </span>
          </button>

          <ul
            className={`pl-4 ${
              openMenu === "allProducts" ? "max-h-screen" : "max-h-0 "
            }  overflow-hidden transition-all duration-300`}
          >
            <li
              className="hover:text-white capitalize"
              onClick={() => navigate("/admin/all-products")}
            >
              <button className="block p-2 w-full  text-start capitalize">
                all products
              </button>
            </li>
            <li
              className="hover:text-white capitalize"
              onClick={() => navigate("/admin/add-product")}
            >
              <button className="block p-2 w-full  capitalize text-start">
                add new product
              </button>
            </li>
            <li
              className="hover:text-white capitalize"
              onClick={() => navigate("/admin/brands")}
            >
              <button className="block p-2 w-full  capitalize text-start">
                brands
              </button>
            </li>
            <li
              className="hover:text-white capitalize"
              onClick={() => navigate("/admin/categories")}
            >
              <button className="block p-2 w-full  capitalize text-start">
                categories
              </button>
            </li>
          </ul>
        </li>
        <button
          onClick={() => {
            navigate("/admin/customers");
            toggleMenu();
          }}
          className="flex items-center justify-start gap-3 capitalize p-4 w-full text-left  hover:text-white"
        >
          <span>
            <FaArrowTrendUp />
          </span>
          <span>customers</span>
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
