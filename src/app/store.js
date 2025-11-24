import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/usersSlice'
import categoryReducer from '../features/categorySlice'
import productReducer from "../features/productSlice"
import cartReducer from "../features/cartSlice"
import reviewReducer from "../features/reviewSlice"
import orderReducer from "../features/orderSlice"

 const store = configureStore({
    reducer: {
        products: productReducer,
        users:userReducer,
        categories:categoryReducer,
        cart: cartReducer,
        reviews: reviewReducer,
        order: orderReducer,

    }
});

export default store;
