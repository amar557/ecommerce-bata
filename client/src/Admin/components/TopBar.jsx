import { IoMenu } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { TbBellRinging } from "react-icons/tb";
import Sugesstion from "./Sugesstion";
import { CiLogout } from "react-icons/ci";
import profile from "../../assets/profile.webp";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
function TopBar() {
  const [showpofile, setShowProfile] = useState(false);
  const hanleLoginPopUp = function () {
    setShowProfile((show) => !show);
  };
  return (
    <div className="w-full py-5 px-5 flex items-center justify-between w-full">
      <div className="text-blue-500 text-xl h-10 w-10 hover:cursor-pointer hover:bg-blue-100 rounded-full flex items-center justify-center">
        <IoMenu />
      </div>
      <div className="flex items-center justify-between gap-4">
        <button className="text-red-600 bg-red-200 uppercase font-medium px-8 rounded-md  py-2">
          clear cache
        </button>
        <div className="relative group">
          <span className="relative text-blue-500  text-xl">
            <TbWorld />
          </span>
          <Sugesstion>visit store</Sugesstion>
        </div>
        <span className="text-blue-500 text-xl">
          <TbBellRinging />
        </span>
        <select name="" id="" className="text-blue-500 outline-none border-0">
          <option value="us-dollars">US-dollars</option>
        </select>
        <select name="" id="" className="text-blue-500 outline-none border-0">
          <option value="us-dollars">english</option>
        </select>
        <div
          className="flex items-center hover:text-blue-500 cursor-pointer justify-center gap-2 group relative "
          onClick={hanleLoginPopUp}
        >
          <img
            src={profile}
            className="h-8 w-8 rounded-full object-cover"
            alt=""
          />
          <span className="text-sm font-medium"> code paul</span>
          <button>
            <IoMdArrowDropdown />
          </button>
          {showpofile && (
            <ul className="absolute top-8 right-0 w-40 bg-white  shadow-sm border  text-black">
              <li className="text-sm font-medium p-2">loged in 20 min ago</li>
              <li className="flex items-center justify-start ps-2 gap-3  py-2 hover:bg-slate-100 px-1">
                <span className="text-sm">
                  <FiUser />
                </span>
                <span className="capitalize ">profile</span>
              </li>
              <li className="flex items-center justify-start ps-2 gap-3  py-2 hover:bg-slate-100 px-1 border-b-red-300 border-b">
                <span className="text-sm">
                  <FiUser />
                </span>
                <span className="capitalize text-sm text-nowrap">
                  login activities
                </span>
              </li>
              <li className="flex items-center justify-start  my-2  text-red-500 ps-2 gap-3  py-2 hover:bg-slate-100 px-1">
                <span className="text-sm">
                  <CiLogout />
                </span>
                <span className="capitalize text-sm text-nowrap">logout</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
