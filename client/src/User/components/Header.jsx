import { NavLink } from "react-router-dom";
import { PiUserLight } from "react-icons/pi";
import { PiPoliceCarLight } from "react-icons/pi";
import { PiHandbagSimpleThin } from "react-icons/pi";
import { categoriesArray } from "../headerData";
import { useState } from "react";
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="bg-[#f3f3f3] text-sm w-full ps-10 first-letter:capitalize tracking-wide py-1 border-y font-medium">
        email:amarhussain391@gmail.com
      </div>
      <div className="flex py-2 items-center justify-end relative">
        <img
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
          <li className="flex flex-col items-center gap- capitalize font-light">
            <span className="text-lg">
              <PiUserLight />
            </span>
            <span>login</span>
          </li>
          <li className="flex flex-col items-center gap- capitalize font-light">
            <span className="text-lg">
              <PiPoliceCarLight />
            </span>
            <span>track order</span>
          </li>
          <li className="flex flex-col items-center gap- capitalize font-light">
            <span className="text-lg">
              <PiHandbagSimpleThin />
            </span>
            <span>rs.0</span>
          </li>
        </div>
      </div>
      <ul className="flex items-center border-y border-slate-300 justify-start gap-3 px-8">
        <li className="font-semibold text-base py-2 uppercase">
          <NavLink className={"/man"}>man</NavLink>
        </li>
        <li className="font-semibold text-base py-2 uppercase">
          <NavLink className={"/man"}>woman</NavLink>
        </li>
        {categoriesArray.map((item) => (
          <div
            className="relative"
            onMouseEnter={() => setOpen(item.title)}
            onMouseLeave={() => setOpen("")}
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
    </div>
  );
}

export default Header;
