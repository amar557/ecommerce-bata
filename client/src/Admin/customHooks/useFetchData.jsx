import { useEffect, useState } from "react";
import { port } from "../../Data";

function useFetchData(url) {
  const [data, setData] = useState([]);

  async function fetchData() {
    const endpoint = url || `${port}/api/item/items`;
    const api = await fetch(endpoint, {
      method: "GET",
    });
    const json = await api.json();
    setData(Array.isArray(json) ? json : []);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const deleteProduct = async function (params) {
    const api = await fetch(`${port}/api/item/deleteItem/${params}`, {
      method: "DELETE",
    });
    if (api.ok) {
      fetchData();
    }
  };

  return { data, deleteProduct };
}

export default useFetchData;
