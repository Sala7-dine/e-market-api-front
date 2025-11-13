import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice"
 const store = configureStore({
    reducer: {
        salah: productReducer,
    }
});

export default store;