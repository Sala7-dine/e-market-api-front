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
      console.error('Full API Error (fetchCategories):', error);
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
      // console.log(res);

      return res.data;
    } catch (error) {
      console.error('Full API Error (fetchProducts):', error);
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
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      console.error('Full API Error (createProduct):', error);
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
  async (_, { rejectWithValue }) => {
    try {
      console.log("helllo merime el mecaniqy");
      const res = await axios.get("/products");
      console.log("all products ", res.data.data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/products/update/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      console.error('Full API Error (updateProduct):', error);
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);
export const  deleteproduct= createAsyncThunk("products/deleteproduct",
 async(id,{rejectWithValue})=>{
  try{
    const response = await axios.delete(`/products/delete/${id}`);
  console.log("res remove", response);
      return id;

  }
  catch(error){
    console.error('Full API Error (deleterproduct):', error);
      return rejectWithValue(error.response?.data || error.message);

  }
 }
)

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

  initialState: { products: [], categories: [], loading: false, error: null },

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
          : action.payload?.data ?? action.payload?.list ?? [];
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
          : action.payload?.data ?? action.payload?.list ?? [];
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
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete product :
       .addCase(deleteproduct.fulfilled,(state,acton)=>{
        state.products=state.products.filter((product)=>product._id!==acton.payload);

       })
  },
});

export const selectProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;
