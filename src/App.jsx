import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import './App.css'
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import UserList from './pages/admin/UserList.jsx';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Categories from './pages/admin/Categories.jsx';
import Review from './pages/admin/Review.jsx'


import Profile from './pages/Profile.jsx';
import Products from './pages/admin/Products.jsx';
import Cart from "./pages/Cart.jsx";

function App() {

    // const [data, setData] = useState([])

    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/Register" element={<Register />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/seller/dashboard" element={<SellerDashboard />} />
                         <Route path="/profile" element={<Profile />} />
                         <Route path="/cart" element={<Cart />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="users" element={<UserList />} />
                               <Route path="categories" element={<Categories />} />
                                <Route path="products" element={<Products />} />
                                 <Route path="reviews" element={<Review />} />
                    
                           
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>

        </>
    )
}

export default App;


















