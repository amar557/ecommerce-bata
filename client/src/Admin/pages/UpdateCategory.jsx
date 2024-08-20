import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { port } from "../../Data";
function UpdateCategory() {
  let { id } = useParams();
  const [category, setCategory] = useState({ category: "" });
  // console.log(category);
  // console.log(category);
  const updateCategory = async function (e, ind) {
    e.preventDefault();
    console.log(category);
    const api = await fetch(`${port}/api/update/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await api.json();
    console.log(data);
    console.log(api);
    if (api.ok) {
      setCategory(data);
    }
  };
  useEffect(() => {
    async function getCategory() {
      const api = await fetch(`${port}/api/get/category/${id}`, {
        method: "GET",
      });
      if (api.ok) {
        const category = await api.json();
        setCategory(category);
      }
    }
    getCategory();
  }, [id]);
  return (
    <div>
      <form action="" className="bg-white w-1/3 border mx-auto p-4 rounded-md">
        <label
          htmlFor=""
          className="block text-sm capitalize font-semibold my-2"
        >
          category title
        </label>
        <input
          type="text"
          name=""
          value={category.category}
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          onChange={(e) => setCategory({ category: e.target.value })}
          placeholder="category title"
          id=""
        />
        <button
          className="bg-black text-white py-2 w-full rounded-md my-3"
          onClick={(e) => updateCategory(e, category._id)}
        >
          update
        </button>
      </form>
    </div>
  );
}

export default UpdateCategory;
