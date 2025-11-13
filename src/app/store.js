import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/usersSlice'


import productReducer from "../features/productSlice"
 const store = configureStore({
    reducer: {
        salah: productReducer,
        users:userReducer
    }
});

export default store;
