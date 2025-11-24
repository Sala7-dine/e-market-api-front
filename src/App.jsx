import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import UserList from "./pages/admin/UserList.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Categories from "./pages/admin/Categories.jsx";

import Reviews from "./pages/admin/Reviews.jsx";
// import Review from "./pages/admin/Review.jsx";
import OrdersHistory from "./pages/OrdersHistory.jsx";

import Profile from "./pages/Profile.jsx";
import Products from "./pages/admin/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Checkout from "./pages/Checkout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/users" element={<UserList />} />
              <Route element={<ProtectedRoute roles={["seller"]} />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/ordersHistory" element={<OrdersHistory />} />
              </Route>
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="users" element={<UserList />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="products" element={<Products />} />
                  <Route path="reviews" element={<Reviews />} />
                </Route>
              </Route>
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
