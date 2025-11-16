import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice"
import cartReducer from "../features/cartSlice"
 const store = configureStore({
    reducer: {
        salah: productReducer,
        cart: cartReducer,
    }
});

export default store;