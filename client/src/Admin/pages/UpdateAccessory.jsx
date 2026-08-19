import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { port } from "../../Data";

async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${port}/api/upload/single?folder=accessories`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.imageUrl;
}

function UpdateAccessory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState({ accessory: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const updateAccessory = async function (e) {
    e.preventDefault();
    setSaving(true);
    try {
      let image = doc.image || "";
      if (imageFile) {
        image = await uploadImage(imageFile);
      }
      const api = await fetch(`${port}/api/update/accessory/${id}`, {
        method: "PUT",
        body: JSON.stringify({ accessory: doc.accessory, image }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await api.json();
      if (api.ok) {
        setDoc(data);
        setPreview(data.image || "");
        setImageFile(null);
        toast.success("Accessory updated");
        navigate("/admin/accessories");
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
    async function load() {
      const api = await fetch(`${port}/api/get/accessory/${id}`, {
        method: "GET",
      });
      if (api.ok) {
        const j = await api.json();
        setDoc(j);
        setPreview(j.image || "");
      }
    }
    load();
  }, [id]);

  return (
    <div>
      <form
        onSubmit={updateAccessory}
        className="bg-white w-1/3 border mx-auto p-4 rounded-md"
      >
        <label className="block text-sm capitalize font-semibold my-2">
          accessory title
        </label>
        <input
          type="text"
          value={doc.accessory || ""}
          className="block p-3 placeholder:capitalize border rounded-md focus:border-blue-200 focus:border outline-none bg-slate-50 w-full"
          onChange={(e) =>
            setDoc((prev) => ({ ...prev, accessory: e.target.value }))
          }
          placeholder="accessory title"
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
            setPreview(file ? URL.createObjectURL(file) : doc.image || "");
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

export default UpdateAccessory;
