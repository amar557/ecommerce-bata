import { port } from "../../../Data";
import { createAsyncThunk } from "@reduxjs/toolkit";

// export const  = async function (e) {};
export const deleteCategoryItem = createAsyncThunk(
  "deleteCategoryItem",
  async (categoryId, { dispatch }) => {
    const api = await fetch(`${port}/api/delete/category/${categoryId}`, {
      method: "DELETE",
    });
    const res = await api.json();

    if (api.ok) {
      dispatch(getCategories());
    }
    return res;
  }
);

export const getCategories = createAsyncThunk("get/categories", async (e) => {
  const api = await fetch(`${port}/api/get/categories`, {
    method: "GET",
  });
  const inJson = await api.json();
  return inJson;
});

export const getBrands = createAsyncThunk("list/brand", async (brand) => {
  try {
    const list = await fetch(`${port}/api/get/brands`, {
      method: "GET",
    });

    // console.log(list);
    if (list.ok) {
      const res = await list.json();
      // console.log(res);
      return res;
    }
  } catch (error) {
    return error;
  }
});

export const deleteBrand = createAsyncThunk(
  "/brand/delete",
  async (id, { dispatch }) => {
    const item = await fetch(`${port}/api/delete/brand/${id}`, {
      method: "DELETE",
    });
    if (item.ok) {
      dispatch(getBrands());
      const res = await item.json();

      // console.log(res);
    }
  }
);
