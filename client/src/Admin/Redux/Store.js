import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import Categories from "./Slices/Categories.slice";
import productReducer from "./Slices/productSlice";
import cartReducer from "./Slices/cartSlice";
import authSlice from "./Slices/authSlice";
import suggestedReducer from "./Slices/suggestedSlice";
import ordersReducer from "./Slices/ordersSlice";

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    Categories,
    products: productReducer,
    cart: cartReducer,
    auth: authSlice,
    suggested: suggestedReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
