import { IoMdSearch } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router";
import { port } from "../../Data";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategoryItem, getCategories } from "../Redux/Async/Asynch";
import { toast } from "react-toastify";

async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${port}/api/upload/single?folder=categories`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.imageUrl;
}

function Categories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((select) => select.Categories);
  const [category, setCategory] = useState({ category: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const listCategory = async function (e) {
    e.preventDefault();
    if (!category.category.trim()) {
      toast.warn("Category title is required");
      return;
    }
    setSaving(true);
    try {
      let image = category.image || "";
      if (imageFile) {
        image = await uploadImage(imageFile);
      }
      const api = await fetch(`${port}/api/list/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category.category, image }),
      });
      const res = await api.json();
      if (res.warn) toast.warn(res.warn);
      if (res.msg) toast.success(typeof res.msg === "string" ? res.msg : "Category saved");
      if (api.ok) {
        dispatch(getCategories());
        setCategory({ category: "", image: "" });
        setImageFile(null);
        setPreview("");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-6 bg-slate-100 p-4">
      <h1 className="text-lg font-semibold capitalize">all Categories</h1>
      <p className="capitalize">
        you have total {categories && categories.length} Categories
      </p>
      <div className="gap-4 flex items-start justify-center my-4">
        <div className="w-3/5 bg-white py-4 shadow-sm rounded-sm">
          <div className="flex items-center justify-between px-4 gap-3">
            <h1 className="text-lg font-semibold capitalize">Categories</h1>
            <div className="border flex items-stretch justify-center ps-2 overflow-hidden rounded-md h-10">
              <input
                type="search"
                placeholder="search here"
                className="placeholder:capitalize placeholder:text-slate-500 placeholder:font-medium outline-none"
              />
              <button type="button" className="bg-black p-3 text-white h-full text-base">
                <IoMdSearch />
              </button>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-100 py-2 px-4 items-center mt-4 mx-2 justify-between">
            <p className="text-center w-1/6 capitalize font-semibold">#</p>
            <p className="text-center w-1/6 capitalize font-semibold">image</p>
            <p className="text-center w-1/5 capitalize font-semibold">title</p>
            <p className="text-center w-1/5 capitalize font-semibold">Options</p>
          </div>
          {categories &&
            categories.length > 0 &&
            categories.map((cat, i) => (
              <div
                className="flex gap-2 bg-white py-2 px-4 items-center mx-2 justify-between"
                key={cat._id || i}
              >
                <p className="text-center w-1/6 capitalize font-semibold">{i + 1}</p>
                <div className="w-1/6 flex justify-center">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.category}
                      className="h-10 w-10 rounded object-cover border"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
                <p className="text-center w-1/5 capitalize font-semibold">
                  {cat.category}
                </p>
                <p className="text-center w-20 capitalize font-semibold flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="text-sm h-6 grid place-items-center w-6 rounded-full bg-slate-200"
                    onClick={() => navigate(`/admin/update/category/${cat._id}`)}
                  >
                    <TbEdit />
                  </button>
                  <button
                    type="button"
                    className="text-sm h-6 grid place-items-center w-6 rounded-full bg-deepRed-100 text-deepRed-500"
                    onClick={() => dispatch(deleteCategoryItem(cat._id))}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </p>
              </div>
            ))}
        </div>
        <div className="w-2/5 bg-white p-4">
          <h1 className="text-lg font-bold capitalize">add Categories</h1>
          <form onSubmit={listCategory}>
            <label className="block text-sm capitalize font-semibold my-2">
              title*
            </label>
            <input
              type="text"
              className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, category: e.target.value }))
              }
              value={category.category}
              placeholder="category title"
            />
            <label className="block text-sm capitalize font-semibold my-2">
              image
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm border rounded-md bg-slate-50 p-2"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setPreview(file ? URL.createObjectURL(file) : "");
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 h-24 w-24 rounded object-cover border"
              />
            )}
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white py-2 w-full rounded-md my-3 disabled:opacity-60"
            >
              {saving ? "publishing..." : "publish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Categories;
