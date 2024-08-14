import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import Categories from "./Slices/Categories.slice";
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    Categories,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
