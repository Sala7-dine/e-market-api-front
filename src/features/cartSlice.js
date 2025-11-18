import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      console.log("productId", productId);
      console.log("productQuantité", quantity);
      const res = await axios.post("/carts/addtocart", { productId, quantity });
      console.log("res", res);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/carts/getcarts");
      console.log("res get", res.data.data[0].items);

      return res.data.data[0].items;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`carts/deleteProduct/${productId}`);
      console.log("res remove", res);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      console.log("inside update");
      const res = await axios.put(`carts/updateCart/${productId}`, {
        quantity,
      });
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null, loading: false, error: null },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // remove from product
      .addCase(removeFromCart.fulfilled, (state, action) => {
        console.log("action.payload :", action.payload);
        if (state.cart) {
          state.cart = state.cart.filter(
            (item) => item.productId !== action.payload
          );
        }
      })
      //update Product Quantity
      .addCase(updateProductQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload 2:", action.payload);
        const { productId, quantity } = action.payload;
        if (state.cart && state.cart.items) {
          const item = state.cart.items.find((i) => i.productId === productId);
          if (item) {
            item.quantity = quantity;
          }
        }
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Update rejected:", action.payload);
      });
  },
});

export default cartSlice.reducer;

export const selectCartCount = (state) =>
  state.cart.cart?.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
