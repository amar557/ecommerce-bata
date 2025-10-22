import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import Categories from "./Slices/Categories.slice";
import productReducer from "./Slices/productSlice";
import cartReducer from "./Slices/cartSlice";
import authSlice from "./Slices/authSlice";
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    Categories,
     products: productReducer,
        cart: cartReducer,
        auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
