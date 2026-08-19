import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../constants/axiosInstance";


// 🛒 Fetch all cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/api/cart/items`);
    console.log(data,'called ')
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// ➕ Add item to cart (selectedSizeId = size subdoc _id when adding from product details)
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity = 1, selectedSizeId }, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.post("/api/cart/add", {
        productId,
        quantity,
        ...(selectedSizeId != null && selectedSizeId !== "" && { selectedSizeId }),
      });
      dispatch(fetchCart());
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
      await axiosInstance.delete(`/api/cart/${cartItemId}`);
      dispatch(fetchCart(userId));
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Place order (creates order, clears cart). Pass { shippingAddress, paymentMethod }.
export const checkoutUserCart = createAsyncThunk(
  "cart/checkout",
  async ({ shippingAddress, paymentMethod = "cod", embedded = false }, { rejectWithValue, dispatch }) => {
    try {
      if (paymentMethod === "stripe") {
        const { data } = await axiosInstance.post("/api/cart/stripe/create-session", {
          shippingAddress: shippingAddress || {},
          embedded: Boolean(embedded),
        });
        return { ...data, paymentMethod: "stripe", embedded: Boolean(embedded) };
      }
      const { data } = await axiosInstance.post("/api/cart/checkout", {
        shippingAddress: shippingAddress || {},
        paymentMethod: "cod",
      });
      dispatch(fetchCart());
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
      dispatch(fetchCart());
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
      .addCase(checkoutUserCart.fulfilled, (state, action) => {
        // Don't clear cart until Stripe payment is confirmed
        if (action.payload?.paymentMethod !== "stripe") {
          state.items = [];
        }
      })
      .addCase(checkoutUserCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
