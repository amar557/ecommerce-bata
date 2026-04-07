import { createSlice } from "@reduxjs/toolkit";
import { getAccessories, getBrands, getCategories } from "../Async/Asynch";

const categories = createSlice({
  name: "brandsandCategory",
  initialState: {
    categories: [],
    loading: false,
    err: "",
    brands: [],
    accessories: [],
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.err = action.payload;
    });
    builder.addCase(getBrands.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
      state.loading = false;
    });
    builder.addCase(getBrands.rejected, (state, action) => {
      state.err = action.payload;
    });
    builder.addCase(getAccessories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAccessories.fulfilled, (state, action) => {
      state.accessories = action.payload || [];
      state.loading = false;
    });
    builder.addCase(getAccessories.rejected, (state, action) => {
      state.err = action.payload;
      state.loading = false;
    });
  },
});
export default categories.reducer;
