import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { useNavigate, useLocation } from "react-router";
import { MdShoppingCart } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="w-64 h-screen overflow-y-scroll bg-gray-800 text-secondary1 fixed">
      <ul>
        <button
          onClick={() => {
            navigate("/admin");
            toggleMenu();
          }}
          className={`flex items-center justify-start gap-3 capitalize p-4 w-full text-left hover:text-white ${
            isActive("/admin") && location.pathname === "/admin" ? "text-white" : ""
          }`}
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
          className={`flex items-center justify-start gap-3 capitalize p-4 w-full text-left hover:text-white ${
            isActive("/admin/orders") ? "text-white" : ""
          }`}
        >
          <span>
            <FaArrowTrendUp />
          </span>
          <span>orders</span>
        </button>

        <li>
          <button
            onClick={() => toggleMenu("allProducts")}
            className={`flex items-center justify-between p-4 w-full text-left hover:text-white ${
              isActive("/admin/all-products") || 
              isActive("/admin/add-product") || 
              isActive("/admin/brands") || 
              isActive("/admin/categories") ||
              isActive("/admin/accessories") ||
              isActive("/admin/update-product") ||
              isActive("/admin/update/category") ||
              isActive("/admin/update/brand") ||
              isActive("/admin/update/accessory")
                ? "text-white" : ""
            }`}
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
              className={`hover:text-white capitalize ${
                isActive("/admin/all-products") ? "text-white" : ""
              }`}
              onClick={() => navigate("/admin/all-products")}
            >
              <button className="block p-2 w-full text-start capitalize">
                all products
              </button>
            </li>
            <li
              className={`hover:text-white capitalize ${
                isActive("/admin/add-product") ? "text-white" : ""
              }`}
              onClick={() => navigate("/admin/add-product")}
            >
              <button className="block p-2 w-full capitalize text-start">
                add new product
              </button>
            </li>
            <li
              className={`hover:text-white capitalize ${
                isActive("/admin/brands") ? "text-white" : ""
              }`}
              onClick={() => navigate("/admin/brands")}
            >
              <button className="block p-2 w-full capitalize text-start">
                brands
              </button>
            </li>
            <li
              className={`hover:text-white capitalize ${
                isActive("/admin/categories") ? "text-white" : ""
              }`}
              onClick={() => navigate("/admin/categories")}
            >
              <button className="block p-2 w-full capitalize text-start">
                categories
              </button>
            </li>
            <li
              className={`hover:text-white capitalize ${
                isActive("/admin/accessories") ? "text-white" : ""
              }`}
              onClick={() => navigate("/admin/accessories")}
            >
              <button className="block p-2 w-full capitalize text-start">
                accessories
              </button>
            </li>
          </ul>
        </li>
        <button
          onClick={() => {
            navigate("/admin/customers");
            toggleMenu();
          }}
          className={`flex items-center justify-start gap-3 capitalize p-4 w-full text-left hover:text-white ${
            isActive("/admin/customers") ? "text-white" : ""
          }`}
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
