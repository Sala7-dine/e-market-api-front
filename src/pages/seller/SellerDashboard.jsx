import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategories, selectCategories } from "../../features/productSlice";
import AddProductModal from "../../components/Products/AddProductModal";
import EditProductModal from "../../components/Products/EditProductModal";
import ViewProductModal from "../../components/Products/ViewProductModal";
import { useAuth } from "../../contexts/AuthContext";
import { useSellerData } from "./hooks/useSellerData";
import { calculateRevenueByMonth, calculateBestSellers } from "./utils/analytics";
import Sidebar from "./components/Sidebar";
import OverviewTab from "./tabs/OverviewTab";
import ProductsTab from "./tabs/ProductsTab";
import OrdersTab from "./tabs/OrdersTab";
import AnalyticsTab from "./tabs/AnalyticsTab";

const TAB_LABELS = {
  overview: "Overview",
  products: "Products",
  orders: "Orders",
  analytics: "Analytics",
};

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  const { logout } = useAuth();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const {
    products,
    productPagination,
    isLoadingProducts,
    productsError,
    stats,
    orders,
    orderPagination,
    updateStatus,
    isUpdatingStatus,
  } = useSellerData(productPage, orderPage, orderStatus);

  const revenueByMonth = useMemo(() => calculateRevenueByMonth(orders), [orders]);
  const bestSellers = useMemo(() => calculateBestSellers(orders, products), [orders, products]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoadingProducts) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-[#E8EEF2] to-[#D5E5F0]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="text-red-600">
        Error: {typeof productsError === "object" ? JSON.stringify(productsError, null, 2) : String(productsError)}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#ffffff]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} logout={logout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{TAB_LABELS[activeTab]}</h1>
                <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-white/60 rounded-lg transition-colors relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B6B] rounded-full"></span>
              </button>
              <Link to="/profile" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "overview" && <OverviewTab stats={stats} orders={orders} setActiveTab={setActiveTab} />}
          
          {activeTab === "products" && (
            <ProductsTab
              products={products}
              isLoading={isLoadingProducts}
              pagination={productPagination}
              onPageChange={setProductPage}
              onAddProduct={() => {
                setSelectedProduct(null);
                setIsAddOpen(true);
              }}
              onEditProduct={(product) => {
                setSelectedProduct(product);
                setIsEditOpen(true);
              }}
              onViewProduct={(product) => {
                setSelectedProduct(product);
                setIsViewOpen(true);
              }}
            />
          )}
          
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              pagination={orderPagination}
              onPageChange={setOrderPage}
              onStatusChange={(orderId, status) => updateStatus({ orderId, status })}
              isUpdatingStatus={isUpdatingStatus}
              orderStatus={orderStatus}
              setOrderStatus={setOrderStatus}
            />
          )}
          
          {activeTab === "analytics" && (
            <AnalyticsTab revenueByMonth={revenueByMonth} bestSellers={bestSellers} />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} categories={categories} />
      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
      />
      <ViewProductModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onEdit={(p) => {
          setIsViewOpen(false);
          setSelectedProduct(p);
          setIsEditOpen(true);
        }}
      />
    </div>
  );
};

export default SellerDashboard;
