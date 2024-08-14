import { CgMathPlus } from "react-icons/cg";
import { IoMdSearch } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router";

function Customers() {
  const navigate = useNavigate();
  return (
    <div className="mx-6 ">
      <div className="flex items-center my-2 justify-between w-full">
        <h2 className="capitalize font-semibold text-xl">add product</h2>
        <button
          className="bg-black uppercase  rounded-sm text-white flex gap-1  py-2 px-4 items-center justify-center"
          onClick={() => navigate("/addcustomer")}
        >
          <CgMathPlus />
          <span className="font-semibold text-sm  ">add customer</span>
        </button>
      </div>
      <div className="w-full bg-white py-4 shadow-sm rounded-sm ">
        <div className="flex items-center  justify-between px-4 gap-3">
          <h1 className="text-lg font-semibold capitalize"> brands</h1>
          <div className="border flex items-stretch justify-center ps-2 overflow-hidden rounded-md h-10">
            <input
              type="search"
              name=""
              id=""
              placeholder="search here"
              className="  placeholder:capitalize placeholder:text-slate-500 placeholder:font-medium  outline-none "
            />
            <button className="bg-black p-3 text-white  h-full  text-base">
              <IoMdSearch />
            </button>
          </div>
        </div>
        <div className="flex  gap-2 bg-slate-100  py-2 px-4 items-center mt-4 mx-2  justify-between">
          <p className="text-center w-1/5 capitalize font-semibold ">#</p>
          <p className="text-center w-1/5 capitalize font-semibold ">name</p>
          <p className="text-center w-1/5 capitalize font-semibold ">phone</p>
          <p className="text-center w-1/5 capitalize font-semibold ">
            last login
          </p>

          <p className="text-center w-1/5 capitalize font-semibold ">status</p>

          <p className="text-center w-1/5 capitalize font-semibold ">Options</p>
        </div>
        <div className="flex  gap-2 bg-white  py-2 px-4 items-center mt-4 mx-2  justify-between">
          <p className="text-center w-1/5 capitalize  ">1</p>
          <p className="text-center w-1/5 capitalize  ">amar</p>
          <p className="text-center w-1/5 capitalize  ">15645465487</p>
          <p className="text-center w-1/5 capitalize  ">1 day ago</p>

          <p className="text-center w-1/5 capitalize ">online</p>

          <p className="text-center w-1/5 capitalize font-semibold flex  items-center justify-center  gap-2">
            <button className="text-sm h-6 grid place-items-center w-6 rounded-full bg-slate-200">
              <TbEdit />
            </button>

            <button className="text-sm h-6 grid place-items-center w-6 rounded-full bg-red-100 text-red-500">
              <RiDeleteBin6Line />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Customers;
