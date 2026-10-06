import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../constants/axiosInstance";

function isSilentArg(arg) {
  return Boolean(arg && typeof arg === "object" && arg.silent);
}

// 🛒 Fetch all cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (arg, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/cart/items`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ➕ Add / update item in cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (
    { productId, quantity = 1, selectedSizeId },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/cart/add", {
        productId,
        quantity,
        ...(selectedSizeId != null &&
          selectedSizeId !== "" && { selectedSizeId }),
      });
      // Refresh populated cart without full-page loading state
      await dispatch(fetchCart({ silent: true }));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ❌ Remove item
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async ({ cartItemId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/cart/${cartItemId}`);
      return { cartItemId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Place order (creates order, clears cart). Pass { shippingAddress, paymentMethod }.
export const checkoutUserCart = createAsyncThunk(
  "cart/checkout",
  async (
    { shippingAddress, paymentMethod = "cod", embedded = false },
    { rejectWithValue, dispatch }
  ) => {
    try {
      if (paymentMethod === "stripe") {
        const { data } = await axiosInstance.post(
          "/api/cart/stripe/create-session",
          {
            shippingAddress: shippingAddress || {},
            embedded: Boolean(embedded),
          }
        );
        return {
          ...data,
          paymentMethod: "stripe",
          embedded: Boolean(embedded),
        };
      }
      const { data } = await axiosInstance.post("/api/cart/checkout", {
        shippingAddress: shippingAddress || {},
        paymentMethod: "cod",
      });
      await dispatch(fetchCart({ silent: true }));
      return { ...data, paymentMethod: "cod" };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const confirmStripePayment = createAsyncThunk(
  "cart/confirmStripe",
  async (sessionId, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post("/api/cart/stripe/confirm", {
        sessionId,
      });
      await dispatch(fetchCart({ silent: true }));
      return data;
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
  reducers: {
    updateCartItemQuantityLocal(state, action) {
      const { cartItemId, quantity } = action.payload || {};
      const item = state.items.find((i) => String(i._id) === String(cartItemId));
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state, action) => {
        // Only show full-page loader on first load, not on silent refresh
        if (!isSilentArg(action.meta.arg) && state.items.length === 0) {
          state.loading = true;
        }
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const id = action.payload?.cartItemId;
        state.items = state.items.filter(
          (item) => String(item._id) !== String(id)
        );
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(checkoutUserCart.fulfilled, (state, action) => {
        if (action.payload?.paymentMethod !== "stripe") {
          state.items = [];
        }
      })
      .addCase(checkoutUserCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { updateCartItemQuantityLocal } = cartSlice.actions;
export default cartSlice.reducer;
