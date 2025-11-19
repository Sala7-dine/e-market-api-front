import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectCategories,
  selectProductsError,
  selectProductsLoading,
} from "../../features/productSlice";
import ProductSkeletonLoader from "../../components/Products/ProductCardLoader.jsx.jsx";
import AddProductModal from "../../components/Products/AddProductModal.jsx";
import EditProductModal from "../../components/Products/EditProductModal.jsx";
import ViewProductModal from "../../components/Products/ViewProductModal.jsx";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  
  // Make productList safe: accept array or object shapes (data / list)
  const productList = Array.isArray(products)
    ? products
    : products?.data ?? products?.list ?? [];

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const [stats] = useState({
    totalRevenue: 24580.5,
    orders: 342,
    products: 68,
    visitors: 12543,
  });

  const [recentOrders] = useState([
    {
      id: "ORD-2501",
      customer: "Sarah Johnson",
      product: "Premium Cotton T-Shirt",
      amount: 29.99,
      status: "pending",
      date: "Nov 12, 2025",
    },
    {
      id: "ORD-2502",
      customer: "Michael Chen",
      product: "Designer Jeans",
      amount: 79.99,
      status: "processing",
      date: "Nov 12, 2025",
    },
    {
      id: "ORD-2503",
      customer: "Emma Davis",
      product: "Leather Jacket",
      amount: 199.99,
      status: "shipped",
      date: "Nov 11, 2025",
    },
    {
      id: "ORD-2504",
      customer: "James Wilson",
      product: "Cotton T-Shirt",
      amount: 29.99,
      status: "delivered",
      date: "Nov 10, 2025",
    },
  ]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "products",
      label: "Products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ];

  // console.log(error);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard Error:', error);
    return <div className="text-red-600">Error: {typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error)}</div>;
  }

  console.log(productList[0]?.images?.[0]);
  // console.log(products.images[0]);
console.log(error);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {sidebarOpen ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  SellerHub
                </span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div
              className={`flex items-center ${
                sidebarOpen ? "space-x-3" : "justify-center"
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                JD
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    john@example.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      +12.5%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Revenue
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      +8.2%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.orders}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      +3
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Products
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.products}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                      +24%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Visitors
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.visitors.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Orders
                    </h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Order ID
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Customer
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Product
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Amount
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Status
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.product}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ${order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsAddOpen(true);
                  }}
                  className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Product</span>
                </button>
              </div>

              {loading ? (
                <ProductSkeletonLoader />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id ?? product.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={
                              product.images[0].startsWith('http')
                                ? product.images[0]
                                : product.images[0].startsWith('e-market-dh-03e9602f6d1a.herokuapp.com')
                                ? `https://${product.images[0]}`
                                : `https://e-market-dh-03e9602f6d1a.herokuapp.com${product.images[0].startsWith('/') ? '' : '/'}${product.images[0]}`
                            }
                            alt={product.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">
                          {product.title}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-gray-900">
                              ${product.prix}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Stock:</span>
                            <span
                              className={`font-semibold ${
                                (product.stock ?? 0) < 20
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {product.stock ?? 0} units
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsEditOpen(true);
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsViewOpen(true);
                            }}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Order ID
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Customer
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Product
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Amount
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Status
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Date
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.product}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ${order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.date}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Revenue Overview
                  </h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Chart visualization area</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Best Sellers
                  </h3>
                  <div className="space-y-4">
                    {productList.slice(0, 3).map((product) => (
                      <div
                        key={product._id ?? product.id}
                        className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={
                                product.images && product.images.length > 0
                                  ? (product.images[0].startsWith('http')
                                      ? product.images[0]
                                      : product.images[0].startsWith('e-market-dh-03e9602f6d1a.herokuapp.com')
                                      ? `https://${product.images[0]}`
                                      : `https://e-market-dh-03e9602f6d1a.herokuapp.com${product.images[0].startsWith('/') ? '' : '/'}${product.images[0]}`)
                                  : product.image || ''
                              }
                              alt={product.title ?? product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.title ?? product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {product.sold ?? 0} sold
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          $
                          {(
                            (product.prix ?? product.price ?? 0) *
                            (product.sold ?? 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        categories={categories}
      />
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
