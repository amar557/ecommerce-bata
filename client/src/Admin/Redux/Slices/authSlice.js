import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../constants/axiosInstance";

// 🕒 Check token expiration (via API)
export const checkTokenExpiration = createAsyncThunk(
  "auth/checkTokenExpiration",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found in localStorage. Logging out...");
        dispatch(logoutUser());
        return rejectWithValue("No token found");
      }

      // Add token to Authorization header if not automatically handled
      const res = await axiosInstance.get("/api/auth/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Token check response:", res);

      if (res.status === 200 && res.data) {
        console.log("✅ Token is valid — user is still logged in.");
        return res.data;
      } else {
        console.warn("⚠️ Unexpected response — logging out...");
        dispatch(logoutUser());
        return rejectWithValue("Unexpected response");
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403 || status === 404) {
          console.error("❌ Token expired or invalid — logging out...");
          dispatch(logoutUser());
          return rejectWithValue("Token expired or invalid");
        }
        console.error("⚠️ Server error:", error.response.data);
        return rejectWithValue(error.response.data || "Server error");
      } else if (error.request) {
        console.error("⚠️ No response received from server:", error.request);
        return rejectWithValue("No response from server");
      } else {
        console.error("⚠️ Error setting up request:", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);
// 🔐 Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🧾 Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/register", userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔁 Update user profile
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/users/${userId}`, updates);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🚪 Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(authSlice.actions.clearUser());
  }
);

const savedUser = localStorage.getItem("user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
