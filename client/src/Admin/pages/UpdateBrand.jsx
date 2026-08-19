import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { port } from "../../Data";

async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${port}/api/upload/single?folder=brands`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.imageUrl;
}

function UpdateBrand() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState({ brand: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getItemData() {
      const api = await fetch(`${port}/api/get/brand/${id}`, {
        method: "GET",
      });
      if (api.ok) {
        const res = await api.json();
        setBrand(res);
        setPreview(res.image || "");
      }
    }
    getItemData();
  }, [id]);

  const updateBrand = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let image = brand.image || "";
      if (imageFile) {
        image = await uploadImage(imageFile);
      }
      const api = await fetch(`${port}/api/update/brand/${id}`, {
        method: "PUT",
        body: JSON.stringify({ brand: brand.brand, image }),
        headers: { "Content-Type": "application/json" },
      });
      if (api.ok) {
        const res = await api.json();
        setBrand(res);
        setPreview(res.image || "");
        setImageFile(null);
        toast.success("Brand updated");
        navigate("/admin/brands");
      } else {
        const err = await api.json();
        toast.warn(err.warn || "Update failed");
      }
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={updateBrand}
        className="bg-white w-1/3 border mx-auto p-4 rounded-md"
      >
        <label className="block text-sm capitalize font-semibold my-2">
          brand title
        </label>
        <input
          type="text"
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          value={brand.brand || ""}
          onChange={(e) =>
            setBrand((prev) => ({ ...prev, brand: e.target.value }))
          }
          placeholder="brand title"
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
            setPreview(file ? URL.createObjectURL(file) : brand.image || "");
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

export default UpdateBrand;
