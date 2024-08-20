import { LuFileText } from "react-icons/lu";
import { PiUser } from "react-icons/pi";
import { IoKey } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import { useState } from "react";
function Profile() {
  const [active, setActive] = useState("Profile");
  const bar = [
    {
      title: "Profile",
      icon: <PiUser />,
    },
    {
      title: "Login Activities",
      icon: <LuFileText />,
    },
    {
      title: "Change Password",
      icon: <IoKey />,
    },
    {
      title: "Logout From Other Devices",
      icon: <CiLogout />,
    },
  ];
  return (
    <div className="flex items-center justify-center gap-5 mt-12">
      <div className="flex flex-col items-center justify-center w-1/3 py-4 gap-2 shadow-lg p-8">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt=""
          className="h-20 w-auto  rounded-full -mt-12"
        />
        <h3 className="font-semibold text-base ">codepul team</h3>
        <h3 className="font-medium text-sm ">codepulteam@gmail.com</h3>
        <ul className="mt-8  w-full space-y-1">
          {bar.map((item) => (
            <li
              className={`py-2 hover:bg-blue-50 transition-all ${
                active === item.title && "bg-blue-200"
              }  px-2 cursor-pointer rounded-md text-blue-500 flex items-center justify-start gap-3`}
              onClick={() => setActive(item.title)}
            >
              <span>{item.icon}</span>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
      <ProfileBasic />
    </div>
  );
}

export default Profile;

const ProfileBasic = function () {
  return (
    <div className="p-2 grow shadow-md">
      <div className="flex items-center justify-between px-4 py-3 border-b mb-3">
        <h2 className="capitalize font-bold text-lg">personal information</h2>
        <button className="flex items-center justify-center gap-2 bg-black text-white px-3 py-2 rounded-md capitalize">
          <span>edit</span>
          <span>
            <TbEdit />
          </span>
        </button>
      </div>
      <h1 className="bg-slate-100 font-medium text-base capitalize py-1 px-1 text-black w-full ">
        basics
      </h1>
      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">Name </p>
        <p className=" text-start w-1/2">codepul team</p>
      </div>
      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">Email </p>
        <p className="self-start w-1/2 text-start"> codepulteam@gmail.com</p>
      </div>
      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">User </p>
        <p className="self-start w-1/2 text-start"> Type admin</p>
      </div>
      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">Last Password Change</p>
        <p className="self-start w-1/2 text-start"> Not Change Yet</p>
      </div>
      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">Last Login </p>
        <p className="self-start w-1/2 text-start"> Aug 24, 2024 04:55 pm</p>
      </div>
    </div>
  );
};
