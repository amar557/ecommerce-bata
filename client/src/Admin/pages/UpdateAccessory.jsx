import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { port } from "../../Data";

function UpdateAccessory() {
  const { id } = useParams();
  const [doc, setDoc] = useState({ accessory: "" });

  const updateAccessory = async function (e) {
    e.preventDefault();
    const api = await fetch(`${port}/api/update/accessory/${id}`, {
      method: "PUT",
      body: JSON.stringify(doc),
      headers: { "Content-Type": "application/json" },
    });
    const data = await api.json();
    if (api.ok) setDoc(data);
  };

  useEffect(() => {
    async function load() {
      const api = await fetch(`${port}/api/get/accessory/${id}`, {
        method: "GET",
      });
      if (api.ok) {
        const j = await api.json();
        setDoc(j);
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
          onChange={(e) => setDoc({ ...doc, accessory: e.target.value })}
          placeholder="accessory title"
        />
        <button
          type="submit"
          className="bg-black text-white py-2 w-full rounded-md my-3"
        >
          update
        </button>
      </form>
    </div>
  );
}

export default UpdateAccessory;
