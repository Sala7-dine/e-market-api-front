import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

// fetch seller products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/products");
      // console.log(res);
      
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/products/create", productData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: { products: [], loading: false, error: null },

  reducers: {},
  extraReducers: (builder) => {
    // fetch seller products cases
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // create product cases
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});


export const selectProducts = (state) => state.products.products;
;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;


export default productSlice.reducer;
