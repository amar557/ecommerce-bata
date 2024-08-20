import { useEffect, useState } from "react";
import { port } from "../../Data";

function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchData(params) {
    const api = await fetch(`${port}/api/item/items`, {
      method: "GET",
    });
    const res = await api.json();
    setData(res);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const deleteProduct = async function (params) {
    const api = await fetch(`${port}/api/item/deleteItem/${params}`, {
      method: "DELETE",
    });
    const res = await api.json();
    // setData(res);
    if (api.ok) {
      fetchData();
    }
  };

  return { data, deleteProduct };
}

export default useFetchData;
