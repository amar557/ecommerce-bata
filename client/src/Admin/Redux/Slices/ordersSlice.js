import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../constants/axiosInstance";

// Fetch all orders (admin)
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (arg, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/cart/admin/orders");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update order status (admin) — updates local state, no full reload
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/cart/admin/order/${orderId}/status`,
        { status }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        const silent =
          action.meta.arg &&
          typeof action.meta.arg === "object" &&
          action.meta.arg.silent;
        if (!silent && state.items.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const order = action.payload?.order;
        if (!order?._id) return;
        const idx = state.items.findIndex(
          (o) => String(o._id) === String(order._id)
        );
        if (idx >= 0) {
          state.items[idx] = { ...state.items[idx], ...order };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
