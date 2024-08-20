import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { port } from "../../Data";
function UpdateBrand() {
  const { id } = useParams();
  const [brand, setBrand] = useState({ brand: "" });
  useEffect(() => {
    async function getItemData() {
      const api = await fetch(`${port}/api/get/brand/${id}`, {
        method: "GET",
      });
      if (api.ok) {
        const res = await api.json();
        setBrand(res);
      }
    }
    getItemData();
  }, [id]);
  const updateBrand = async (e) => {
    e.preventDefault();
    const api = await fetch(`${port}/api/update/brand/${id}`, {
      method: "PUT",
      body: JSON.stringify(brand),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (api.ok) {
      const res = await api.json();
      setBrand(res);
    }
  };
  return (
    <div>
      <form action="" className="bg-white w-1/3 border mx-auto p-4 rounded-md">
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          brand title
        </label>
        <input
          type="text"
          name=""
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          value={brand.brand}
          onChange={(e) => setBrand({ brand: e.target.value })}
          placeholder="brand title"
          id=""
        />
        <button
          className="bg-black text-white py-2 w-full rounded-md my-3"
          onClick={updateBrand}
        >
          update
        </button>
      </form>
    </div>
  );
}

export default UpdateBrand;
