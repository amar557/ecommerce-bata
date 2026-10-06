import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../constants/axiosInstance";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function useFetchData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = url || "/api/item/items";
      const { data: json } = await axiosInstance.get(endpoint);
      setData(normalizeList(json));
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err?.response?.data?.msg || err?.message || "Failed to load");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteProduct = async function (params) {
    await axiosInstance.delete(`/api/item/deleteItem/${params}`);
    await fetchData();
  };

  return { data, loading, error, deleteProduct, refetch: fetchData };
}

export default useFetchData;
