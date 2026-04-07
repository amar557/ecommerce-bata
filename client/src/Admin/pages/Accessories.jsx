import { IoMdSearch } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router";
import { port } from "../../Data";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccessoryItem, getAccessories } from "../Redux/Async/Asynch";
import { toast } from "react-toastify";

function Accessories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessories } = useSelector((select) => select.Categories);
  const [row, setRow] = useState({ accessory: "" });

  useEffect(() => {
    dispatch(getAccessories());
  }, [dispatch]);

  const listAccessory = async function (e) {
    e.preventDefault();
    const api = await fetch(`${port}/api/list/accessory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    const res = await api.json();
    toast.warn(res.warn);
    toast.success(res.msg?.msg || res.msg || "Saved");
    if (api.ok) {
      dispatch(getAccessories());
      setRow({ accessory: "" });
    }
  };

  return (
    <div className="mx-6 bg-slate-100 p-4">
      <h1 className="text-lg font-semibold capitalize">all accessories</h1>
      <p className="capitalize">
        you have total {accessories?.length ?? 0} accessories
      </p>
      <div className="gap-4 flex items-start justify-center my-4">
        <div className="w-3/5 bg-white py-4 shadow-sm rounded-sm">
          <div className="flex items-center justify-between px-4 gap-3">
            <h1 className="text-lg font-semibold capitalize">Accessories</h1>
            <div className="border flex items-stretch justify-center ps-2 overflow-hidden rounded-md h-10">
              <input
                type="search"
                placeholder="search here"
                className="placeholder:capitalize placeholder:text-slate-500 placeholder:font-medium outline-none"
              />
              <button
                type="button"
                className="bg-black p-3 text-white h-full text-base"
              >
                <IoMdSearch />
              </button>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-100 py-2 px-4 items-center mt-4 mx-2 justify-between">
            <p className="text-center w-1/5 capitalize font-semibold">#</p>
            <p className="text-center w-1/5 capitalize font-semibold">title</p>
            <p className="text-center w-1/5 capitalize font-semibold">
              Options
            </p>
          </div>
          {accessories &&
            accessories.length > 0 &&
            accessories.map((a, i) => (
              <div
                className="flex gap-2 bg-white py-2 px-4 items-center mx-2 justify-between"
                key={a._id || i}
              >
                <p className="text-center w-1/5 capitalize font-semibold">
                  {i + 1}
                </p>
                <p className="text-center w-1/5 capitalize font-semibold">
                  {a.accessory}
                </p>
                <p className="text-center w-20 capitalize font-semibold flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="text-sm h-6 grid place-items-center w-6 rounded-full bg-slate-200"
                    onClick={() =>
                      navigate(`/admin/update/accessory/${a._id}`)
                    }
                  >
                    <TbEdit />
                  </button>
                  <button
                    type="button"
                    className="text-sm h-6 grid place-items-center w-6 rounded-full bg-red-100 text-red-500"
                    onClick={() => dispatch(deleteAccessoryItem(a._id))}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </p>
              </div>
            ))}
        </div>
        <div className="w-2/5 bg-white p-4">
          <h1 className="text-lg font-bold capitalize">add accessory</h1>
          <form onSubmit={listAccessory}>
            <label className="block text-sm capitalize font-semibold my-2">
              title*
            </label>
            <input
              type="text"
              className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
              onChange={(e) => setRow({ accessory: e.target.value })}
              value={row.accessory}
              placeholder="e.g. Wallets, Belts"
            />
            <button
              type="submit"
              className="bg-black text-white py-2 w-full rounded-md my-3"
            >
              publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Accessories;
