import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/carts/addtocart", { productId, quantity });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCart = createAsyncThunk("cart/getCart", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/carts/getcarts");

    return res.data.data[0];
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const _res = await axios.delete(`carts/deleteProduct/${productId}`);

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
      const _res = await axios.put(`carts/updateCart/${productId}`, {
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
  initialState: { cart: null, cartId: null, loading: false, error: null },
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
        // Ensure cart is always an array
        if (Array.isArray(action.payload)) {
          state.cart = action.payload;
        } else if (action.payload?.items && Array.isArray(action.payload.items)) {
          state.cart = action.payload.items;
        } else {
          // Refresh cart data after adding
          state.cart = state.cart || [];
        }
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
        state.cart = action.payload.items;
        state.cartId = action.payload._id;
        state.error = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // remove from product
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart = state.cart.filter((item) => item.productId?._id !== action.payload);
        }
      })
      //update Product Quantity
      .addCase(updateProductQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, quantity } = action.payload;
        if (state.cart) {
          const item = state.cart.find((i) => i.productId?._id === productId);
          if (item) {
            item.quantity = quantity;
          }
        }
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;

export const selectCartCount = (state) => {
  const { cart } = state.cart;
  if (Array.isArray(cart)) {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  return 0;
};

export const selectCartId = (state) => state.cart.cartId;
