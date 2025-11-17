import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/usersSlice'
import categoryReducer from '../features/categorySlice'


import productReducer from "../features/productSlice"
 const store = configureStore({
    reducer: {
        salah: productReducer,
        users:userReducer,
        categories:categoryReducer
    }
});

export default store;
