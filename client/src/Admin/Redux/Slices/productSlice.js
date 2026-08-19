import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../constants/axiosInstance'

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (gender, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/item/items`)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Something went wrong while fetching products'
      )
    }
  }
)

// ✅ Fetch top best sellers
export const fetchBestSellers = createAsyncThunk(
  'products/fetchBestSellers',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/item/best-sellers`, {
        params: { limit },
      })
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Something went wrong while fetching best sellers'
      )
    }
  }
)

// ✅ Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/item/finditem/${id}`)
      console.log(res.data)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Something went wrong while fetching the product'
      )
    }
  }
)

// ✅ Initial state
const initialState = {
  items: [],           // all products
  bestSellers: [],
  bestSellersLoading: false,
  singleProduct: null, // one product
  loading: true,
  error: null,
}

// ✅ Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = []
      state.error = null
    },
    clearSingleProduct: (state) => {
      state.singleProduct = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellersLoading = true
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellersLoading = false
        state.bestSellers = action.payload
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellersLoading = false
        state.error = action.payload
      })

      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.singleProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProducts, clearSingleProduct } = productSlice.actions
export default productSlice.reducer
