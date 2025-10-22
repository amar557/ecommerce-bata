import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../constants/axiosInstance";


// 🛒 Fetch all cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/cart/${userId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// ➕ Add item to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ userId, productId, quantity = 1 }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.post("/cart/add", { userId, productId, quantity });
      // Refresh cart after adding
      dispatch(fetchCart(userId));
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ❌ Remove item
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async ({ cartItemId, userId }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/cart/${cartItemId}`);
      dispatch(fetchCart(userId));
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Checkout (clear all)
export const checkoutUserCart = createAsyncThunk(
  "cart/checkout",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.post(`/cart/checkout/${userId}`);
      dispatch(fetchCart(userId));
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Add/Remove/Checkout errors
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(checkoutUserCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
