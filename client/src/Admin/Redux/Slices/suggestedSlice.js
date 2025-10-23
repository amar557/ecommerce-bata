import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../../constants/axiosInstance'


// -----------------------------
// 🎯 Async thunk to fetch suggestions
// -----------------------------
export const fetchSuggestedItems = createAsyncThunk(
  "suggested/fetchSuggestedItems",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/item/suggestions/${productId}`);
      return response.data.data; // ✅ assuming your API returns { data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch suggested items"
      );
    }
  }
);

// -----------------------------
// 🧠 Slice
// -----------------------------
const suggestedSlice = createSlice({
  name: "suggested",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSuggestions: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedItems.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchSuggestedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuggestions } = suggestedSlice.actions;
export default suggestedSlice.reducer;
