import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

// fetch categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/categories");
      return res.data;
    } catch (error) {
      console.error("Full API Error (fetchCategories):", error);
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// fetch seller products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/seller/products");

      return res.data;
    } catch (error) {
      console.error("Full API Error (fetchProducts):", error);
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/products/create", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Full API Error (createProduct):", error);
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/products?page=${page}&limit=${limit}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/products?page=${page}&limit=${limit}`);
      return res.data; // on reçoit {data, totalPages, totalItems, currentPage}
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteproduct = createAsyncThunk(
  "products/deleteproduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/products/delete/${id}`);
      return id;
    } catch (error) {
      console.error("Full API Error (deleterproduct):", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const fetchProductById = createAsyncThunk(
//   "products/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`/products/${id}`);
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    categories: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },

  reducers: {},
  extraReducers: (builder) => {
    // fetch categories cases
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.data ?? action.payload?.list ?? []);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // fetch seller products cases
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize to array
        state.products = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.data ?? action.payload?.list ?? []);
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

      // FETCH ALL Products :
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;

        // Liste des produits
        state.products = action.payload.data;

        // Pagination
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalItems = action.payload.pagination.totalProducts;
        state.limit = action.payload.pagination.limit;
      })

      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete product :
      .addCase(deleteproduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload);
        state.totalItems -= 1;
      });
  },
});

export const selectProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;
