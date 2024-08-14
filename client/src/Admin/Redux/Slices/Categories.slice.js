import { createSlice } from "@reduxjs/toolkit";
import { getBrands, getCategories } from "../Async/Asynch";

const categories = createSlice({
  name: "brandsandCategory",
  initialState: {
    categories: [],
    loading: false,
    err: "",
    brands: [],
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
  },
});
export default categories.reducer;
