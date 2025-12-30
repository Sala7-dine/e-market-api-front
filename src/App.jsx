// eslint-disable-next-line no-unused-vars
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import clientLogger from "./utils/clientLogger";
import "./utils/axiosLogger";
import performanceTracker from "./utils/performanceTracker";

// Lazy load pages for better performance
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const UserList = lazy(() => import("./pages/admin/UserList.jsx"));
const SellerDashboard = lazy(() => import("./pages/seller/SellerDashboard.jsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const Categories = lazy(() => import("./pages/admin/Categories.jsx"));
const Reviews = lazy(() => import("./pages/admin/Reviews.jsx"));
const OrdersHistory = lazy(() => import("./pages/OrdersHistory.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Products = lazy(() => import("./pages/admin/Products.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Forbidden = lazy(() => import("./pages/Forbidden.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const LogsViewer = lazy(() => import("./pages/admin/LogsViewer.jsx"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

// Initialiser le logger et performance tracking
clientLogger.info("Application started");
performanceTracker.startTimer("app-initialization");

// Configure React Query with optimized cache settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache garbage collection after 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on reconnect
      retry: 1, // Retry failed requests once
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

const App = () => (
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="" element={<Dashboard />} />
                  <Route path="users" element={<UserList />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="products" element={<Products />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="logs" element={<LogsViewer />} />
                </Route>
              </Route>
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Suspense>
      </QueryClientProvider>
    </BrowserRouter>
  </>
);

export default App;
