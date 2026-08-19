import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { port } from "../../Data";

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

function UpdateCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ category: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const updateCategory = async function (e) {
    e.preventDefault();
    setSaving(true);
    try {
      let image = category.image || "";
      if (imageFile) {
        image = await uploadImage(imageFile);
      }
      const api = await fetch(`${port}/api/update/category/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          category: category.category,
          image,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await api.json();
      if (api.ok) {
        setCategory(data);
        setPreview(data.image || "");
        setImageFile(null);
        toast.success("Category updated");
        navigate("/admin/categories");
      } else {
        toast.warn(data.warn || "Update failed");
      }
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    async function getCategory() {
      const api = await fetch(`${port}/api/get/category/${id}`, {
        method: "GET",
      });
      if (api.ok) {
        const data = await api.json();
        setCategory(data);
        setPreview(data.image || "");
      }
    }
    getCategory();
  }, [id]);

  return (
    <div>
      <form
        onSubmit={updateCategory}
        className="bg-white w-1/3 border mx-auto p-4 rounded-md"
      >
        <label className="block text-sm capitalize font-semibold my-2">
          category title
        </label>
        <input
          type="text"
          value={category.category || ""}
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          onChange={(e) =>
            setCategory((prev) => ({ ...prev, category: e.target.value }))
          }
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
            setPreview(file ? URL.createObjectURL(file) : category.image || "");
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
          {saving ? "updating..." : "update"}
        </button>
      </form>
    </div>
  );
}

export default UpdateCategory;
