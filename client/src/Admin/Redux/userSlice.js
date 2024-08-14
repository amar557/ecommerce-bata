import { createSlice } from "@reduxjs/toolkit";
// import { userData } from "./User.async";

const user = createSlice({
  initialState: {
    token: "",
    userName: "",
    admin: false,
    msg: "",
    loading: false,
  },
  name: "user",
  reducers: {
    increment: (state) => {
      state = state + 1;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(userData.pending, (state, action) => {
    //   state.loading = true;
    // });
    // builder.addCase(userData.fulfilled, (state, action) => {
    //   state.msg = action.payload.user.msg;
    //   state.token = action.payload.user.token;
    //   state.userName = action.payload.user.name;
    //   state.admin = action.payload.user.admin;
    //   state.loading = false;
    //   console.log(action.payload);
    // });
    // builder.addCase(userData.rejected, (state, action) => {
    //   state.msg = action.payload.msg;
    // });
  },
});
export const { _ } = user.actions;
export default user.reducer;
