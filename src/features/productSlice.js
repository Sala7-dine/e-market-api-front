// src/redux/productSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

// const initialState = {
//   products: [
//     {
//       id: 1,
//       name: "Wireless Headphones",
//       price: 59.99,
//       image: "https://picsum.photos/200?random=1",
//       category: "Electronics",
//     },
//     {
//       id: 2,
//       name: "Smart Watch",
//       price: 89.99,
//       image: "https://picsum.photos/200?random=2",
//       category: "Wearables",
//     },
//     {
//       id: 3,
//       name: "Running Shoes",
//       price: 49.99,
//       image: "https://picsum.photos/200?random=3",
//       category: "Sports",
//     },
//   ],
// };

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/products", productData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
0;

export const selectAllProducts = (state) => state.products.products;
// export const { addProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;
