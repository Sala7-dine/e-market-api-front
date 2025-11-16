import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/addtocart", { productId, quantity });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async ({_, rejectWithValue }) => {
    try {
      const res = await axios.get("/getcarts");
      return res.data;
    } catch (error) {
        return rejectWithValue(error);
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
      .addCase(getCart.pending, (state)=>{
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
  },
});

export default cartSlice.reducer;
