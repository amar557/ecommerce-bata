import { NavLink } from "react-router-dom";
import { PiUserLight } from "react-icons/pi";
import { PiPoliceCarLight } from "react-icons/pi";
import { PiHandbagSimpleThin } from "react-icons/pi";
import { categoriesArray } from "../headerData";
import { port } from "../../Data";
import { useEffect, useState } from "react";
function Header() {
  const [open, setOpen] = useState("");
  const [male, setMale] = useState([]);
  const [female, setFemale] = useState([]);
  const getNavData = async (gender) => {
    const api = await fetch(`${port}/api/nav?gender=${gender}`, {
      method: "GET",
    });
    const res = await api.json();
    return res;
  };

  useEffect(() => {
    async function getAsync() {
      const male = await getNavData("male");
      const female = await getNavData("female");
      setFemale(female);
      setMale(male);
    }
    getAsync();
  }, []);
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
    </div>
  );
}

export default Header;
