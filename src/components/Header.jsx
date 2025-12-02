// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { getCart, removeFromCart, updateProductQuantity } from "../features/cartSlice.js";

const Header = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const cartItems = Array.isArray(cart) ? cart : [];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated, cart, logout]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Boutique", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`${
        isHomePage ? "absolute" : "sticky"
      } top-0 z-50 w-full transition-all duration-500 ${
        isScrolled && !isHomePage
          ? "bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-md"
          : ""
      }`}
    >
      <nav className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center space-x-3 group ${isHomePage ? "text-black" : ""}`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${
                isHomePage
                  ? "bg-white/10 group-hover:bg-white/20"
                  : "bg-primary/10 group-hover:bg-primary/20"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">Zendora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isAuthenticated() ? (
            <div className="hidden md:flex text-black gap-6 items-center">
              <div className="relative group">
                <span className="flex items-center gap-3 text-black hover:text-gray-700 transition cursor-pointer">
                  <i className="la la-shopping-cart text-3xl"></i>
                  {isAuthenticated() && <span className="text-sm">{cartItems.length} Items</span>}
                </span>

                <div className="absolute right-0 top-full mt-4 w-[420px] bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <i className="la la-shopping-bag text-2xl text-[#FF6B6B]"></i>
                      <h3 className="text-lg font-semibold text-gray-800">Shopping Cart</h3>
                    </div>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="la la-shopping-cart text-4xl text-gray-300 mb-4 block"></i>
                        <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Add some products to get started
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-80 overflow-y-auto space-y-4">
                          {cartItems.map((item, index) => (
                            <div
                              key={item.productId?._id || index}
                              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                              <img
                                src={
                                  item.productId?.images?.[0]?.startsWith("http")
                                    ? item.productId.images[0]
                                    : `https://res.cloudinary.com/dbrrmsoit/image/upload/${item.productId?.images?.[0] || "placeholder"}`
                                }
                                alt={item.productId?.title || "Product"}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="text-base  text-gray-800 truncate mb-1">
                                  {item.productId?.title || "Unknown Product"}
                                </h4>
                                <p className="text-lg font-bold text-[#FF6B6B]">${item.price}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(
                                        updateProductQuantity({
                                          productId: item.productId?._id,
                                          quantity: item.quantity - 1,
                                        })
                                      ).then(() => dispatch(getCart()));
                                    }}
                                    disabled={item.quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#FF6B6B] hover:text-white rounded-full text-sm font-bold disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-600 transition-all"
                                  >
                                    -
                                  </button>
                                  <span className="text-base font-bold w-10 text-center bg-gray-50 py-1 rounded-lg">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(
                                        updateProductQuantity({
                                          productId: item.productId?._id,
                                          quantity: item.quantity + 1,
                                        })
                                      ).then(() => dispatch(getCart()));
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-[#FF6B6B] hover:text-white rounded-full text-sm font-bold transition-all"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(removeFromCart({ productId: item.productId?._id })).then(
                                    () => dispatch(getCart())
                                  );
                                }}
                                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                              >
                                <i className="la la-trash text-xl"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-600">Total:</span>
                            <span className="text-lg font-bold text-[#FF6B6B]">
                              $
                              {cartItems
                                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                          <Link
                            to="/checkout"
                            className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white py-2 px-2 rounded-xl  text-lg hover:from-[#FF5252] hover:to-[#FF6B6B] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <i className="la la-credit-card mr-2"></i>
                            Checkout
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2 text-black hover:text-gray-700 transition cursor-pointer">
                  <i className="la la-user text-2xl"></i>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <i className="la la-user mr-2"></i>
                      Profile
                    </Link>
                    {user?.role === "seller" && (
                      <Link
                        to="/seller/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <i className="la la-tachometer-alt mr-2"></i>
                        Dashboard
                      </Link>
                    )}
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <i className="la la-cogs mr-2"></i>
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === "user" && (
                      <Link
                        to="/ordersHistory"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <i className="la la-list-alt mr-2"></i>
                        Commandes
                      </Link>
                    )}
                    <Link
                      to="/"
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <i className="la la-sign-out mr-2"></i>
                      Deconnexion
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex text-black gap-6 items-center">
              <div className="relative group">
                <div className="absolute right-0 top-full mt-4 w-96 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <i className="la la-shopping-bag text-2xl text-[#FF6B6B]"></i>
                      <h3 className="text-xl font-bold text-gray-800">Shopping Cart</h3>
                    </div>
                    <div className="text-center py-8">
                      <i className="la la-lock text-4xl text-gray-300 mb-4 block"></i>
                      <p className="text-gray-600 text-lg font-medium mb-2">
                        Please login to view your cart
                      </p>
                      <p className="text-gray-400 text-sm mb-6">
                        Sign in to access your saved items
                      </p>
                      <Link
                        to="/login"
                        className="inline-block bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white py-3 px-8 rounded-xl  text-lg hover:from-[#FF5252] hover:to-[#FF6B6B] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <i className="la la-sign-in mr-2"></i>
                        Login Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="text-sm cursor-pointer relative px-6 py-2.5 text-black  border rounded-full overflow-hidden group"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Sign in
                </span>
              </Link>

              <Link
                to="/register"
                className="text-sm cursor-pointer relative px-6 py-2.5 text-black  border border-black rounded-full overflow-hidden group"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Sign up
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden py-6 border-t animate-fadeIn ${
              isHomePage ? "bg-white/5  backdrop-blur-lg" : "bg-muted/50"
            }`}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    location.pathname === link.path
                      ? isHomePage
                        ? "bg-white/10 text-white"
                        : "bg-primary/10 text-primary"
                      : isHomePage
                        ? "text-white/70 hover:bg-white/5 hover:text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
