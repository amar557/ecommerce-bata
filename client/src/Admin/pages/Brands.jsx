import { useEffect, useState } from "react";
import { IoIosEye, IoMdSearch } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteBrand, getBrands } from "../Redux/Async/Asynch";
import { port } from "../../Data";

function Brands() {
  const [brand, setBrand] = useState({ brand: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { brands, err, loading } = useSelector((select) => select.Categories);
  useEffect(() => {
    dispatch(getBrands());
  }, []);
  const handleSubmit = async function (e) {
    e.preventDefault();
    const list = await fetch(`${port}/api/list/brand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brand),
    });

    const res = await list.json();
    toast.warn(res.warn);
    toast.success(res.msg);
    if (list.ok) {
      dispatch(getBrands());
      setBrand({ brand: "" });
      console.log(res);
    }
  };
  console.log(brand);
  return (
    <div className="mx-6  bg-slate-100 p-4">
      <h1 className="text-lg font-semibold capitalize">all brands</h1>
      <p className="capitalize ">
        you have total {brands && brands.length} brands
      </p>
      <div className="gap-4 flex items-start justify-center my-4">
        <div className="w-3/5 bg-white py-4 shadow-sm rounded-sm ">
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
            <p className="text-center w-1/5 capitalize font-semibold ">title</p>

            <p className="text-center w-1/5 capitalize font-semibold ">
              Options
            </p>
          </div>
          {brand &&
            brands.length > 0 &&
            brands.map((item, i) => (
              <div className="flex  gap-2 bg-white  py-2 px-4 items-center  mx-2  justify-between">
                <p className="text-center w-1/5 capitalize font-semibold ">
                  {i + 1}
                </p>
                <p className="text-center w-1/5 capitalize font-semibold ">
                  {item.brand}
                </p>

                <p className="text-center w-20 capitalize font-semibold flex  items-center justify-center  gap-2">
                  <button
                    className="text-sm h-6 grid place-items-center w-6 rounded-full bg-slate-200"
                    onClick={() => navigate(`/admin/update/brand/${item._id}`)}
                  >
                    <TbEdit />
                  </button>

                  <button
                    className="text-sm h-6 grid place-items-center w-6 rounded-full bg-red-100 text-red-500"
                    onClick={() => dispatch(deleteBrand(item._id))}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </p>
              </div>
            ))}
        </div>
        <div className="w-2/5 bg-white p-4">
          <h1 className="text-lg font-bold capitalize">add brand</h1>
          <form action="">
            <label
              htmlFor=""
              className="block text-sm capitalize font-semibold my-2"
            >
              title*
            </label>
            <input
              type="text"
              name=""
              className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
              onChange={(e) => setBrand({ brand: e.target.value })}
              value={brand.brand}
              placeholder="brand title"
              id=""
            />
            <button
              className="bg-black text-white py-2 w-full rounded-md my-3"
              onClick={handleSubmit}
            >
              publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Brands;
