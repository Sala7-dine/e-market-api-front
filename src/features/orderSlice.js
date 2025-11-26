import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ cartId, couponCode }, { rejectWithValue }) => {
    try {
      const payload = couponCode ? { couponCode } : {};
      const res = await axios.post(`/orders/addOrder/${cartId}`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/orders/getOrder?page=${page}&limit=${limit}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalItems: 0,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      });

    // .addCase(getUserOrders.fulfilled, (state, action) => {

    //   if (Array.isArray(action.payload)) {
    //     state.orders = action.payload;
    //     state.page = 1;
    //     state.totalPages = 1;
    //     state.totalItems = action.payload.length;
    //   }
    //   // Si le payload est l'objet complet
    //   else {
    //     state.orders = action.payload.orders || [];
    //     state.page = action.payload.page || 1;
    //     state.totalPages = action.payload.totalPages || 1;
    //     state.totalItems = action.payload.totalItems || 0;
    //   }
    // });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
