import { TbEdit } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosEye } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import useFetchData from "../customHooks/useFetchData";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { port } from "../../Data";
function AllProucts() {
  const { data, deleteProduct } = useFetchData();
  const [e, setE] = useState({});
  const navigate = useNavigate();
  // console.log(data);

  return (
    <div className="px-6">
      <div className="flex items-center justify-start gap-3 my-3">
        <h1 className="text-lg font-semibold capitalize my-2">products</h1>
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
      <div className="flex flex-col items-start justify-start">
        <div className="flex min-w-max gap-4 bg-slate-100 w-full py-2 px-4 items-center  justify-between">
          <p className="text-center w-20 capitalize font-semibold ">#</p>
          <p className="text-center w-20 capitalize font-semibold ">title</p>

          <p className="text-center w-20 capitalize font-semibold ">Seller</p>
          <p className="text-center w-20 capitalize font-semibold ">Detail</p>
          <p className="text-center w-20 capitalize font-semibold ">
            Current Stock
          </p>
          <p className="text-center w-20 capitalize font-semibold ">Options</p>
        </div>
        {data.map((item, i) => (
          <div className="flex  gap-4 bg-white w-full py-2 px-4 items-center  justify-between">
            <p className="text-center w-20 capitalize font-semibold ">
              {i + 1}
            </p>
            <p className="text-start w-20 capitalize font-semibold  flex items-center gap-2">
              <img
                src={item.thumbnailImage}
                className="h-10 w-6 object-cover"
                alt=""
              />
              <span className="text-sm text-slate-600 font-normal">
                {item.title}
              </span>
            </p>

            <p className="text-center text-nowrap  w- rounded-3xl  capitalize font-semibold text-sm bg-orange-200 px-2 py-1 text-orange-600 ">
              admin product
            </p>
            <p className="text-center w-20 capitalize  text-slate-500 leading-tight ">
              Base <br /> Price: pkr {item.price} / <br />
              12 Total Sale: 0 <br /> Current Stock: 0
            </p>
            <p className="text-center w-20 capitalize font-semibold ">1</p>
            <p className="text-center w-20 capitalize font-semibold flex flex-col items-center justify-center  gap-2">
              <button
                className="text-sm h-6 grid place-items-center w-6 rounded-full bg-slate-200"
                onClick={() => navigate(`/admin/update-product/${item._id}`)}
              >
                <TbEdit />
              </button>
              <button className="text-sm h-6 grid place-items-center w-6 rounded-full bg-black text-white">
                <MdContentCopy />
              </button>
              <button
                className="text-sm h-6 grid place-items-center w-6 rounded-full bg-red-100 text-red-500"
                onClick={() => deleteProduct(item._id)}
              >
                <RiDeleteBin6Line />
              </button>
              <button className="text-sm h-6 grid place-items-center w-6 rounded-full bg-slate-100 text-slate-400">
                <IoIosEye />
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProucts;
