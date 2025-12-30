// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useDispatch } from "react-redux";
import { addToCart, getCart } from "../features/cartSlice.js";
import { useAuth } from "../contexts/AuthContext";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("best-selling");
  const [itemsPerPage, setItemsPerPage] = useState(18);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/products");
      setProducts(response.data.data || []);
    } catch {
      // Error loading products
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data.data || []);
    } catch {
      // Error loading categories
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (addingToCart[product._id]) return;

    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .then(() => dispatch(getCart()))
      .finally(() => {
        setTimeout(() => {
          setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
        }, 500);
      });
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const productName = product?.title || "";
      const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return (a?.prix || 0) - (b?.prix || 0);
        case "price-high-low":
          return (b?.prix || 0) - (a?.prix || 0);
        case "newest":
          return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
        default:
          return 0;
      }
    })
    .slice(0, itemsPerPage);

  return (
    <div className="font-sans">
      {/* Page Header with Hero Section */}
      <section className="bg-gradient-to-br from-[#E8EEF2] to-[#D5E5F0] relative overflow-visible z-10">
        <Header />

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Tous les Produits</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Link to="/" className="hover:text-[#FF6B6B] transition-colors duration-300">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-[#FF6B6B] font-medium">Boutique</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-20 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl"></div>
      </section>

      {/* Shop Content */}
      <section className="py-20 bg-white relative z-0">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-1/4">
              {/* Search */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rechercher</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher dans notre boutique"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#FF6B6B] transition-colors duration-300"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Custom Menu */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-600 text-sm hover:text-[#FF6B6B] transition-colors duration-300"
                    >
                      À propos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="text-gray-600 text-sm hover:text-[#FF6B6B] transition-colors duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-600 text-sm hover:text-[#FF6B6B] transition-colors duration-300"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Categories */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Catégories</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`text-sm hover:text-[#FF6B6B] transition-colors duration-300 ${
                        selectedCategory === null ? "text-[#FF6B6B] font-medium" : "text-gray-600"
                      }`}
                    >
                      Tous les produits
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`text-sm hover:text-[#FF6B6B] transition-colors duration-300 ${
                          selectedCategory === category.id
                            ? "text-[#FF6B6B] font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Section */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-4 lg:mb-0">
                  <button className="p-2 text-[#FF6B6B] border border-[#FF6B6B] rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <span className="text-gray-600 text-sm">
                    Affichage de {Math.min(filteredProducts.length, itemsPerPage)} sur{" "}
                    {filteredProducts.length} résultats
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Afficher:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#FF6B6B]"
                    >
                      <option value={18}>18</option>
                      <option value={36}>36</option>
                      <option value={54}>54</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Trier par</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#FF6B6B]"
                    >
                      <option value="best-selling">Meilleures ventes</option>
                      <option value="price-low-high">Prix: Croissant</option>
                      <option value="price-high-low">Prix: Décroissant</option>
                      <option value="newest">Plus récents</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B6B]"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <div key={product._id || index} className="group">
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {product.stock < 5 && (
                          <span className="absolute top-3 right-3 bg-[#FF6B6B] text-white text-[10px] font-semibold w-12 h-12 rounded-full flex items-center justify-center z-10">
                            Sale
                          </span>
                        )}
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={
                              product.images?.[0]?.startsWith("http")
                                ? product.images[0]
                                : `https://res.cloudinary.com/dbrrmsoit/image/upload/${product.images?.[0] || "placeholder"}`
                            }
                            alt={product.title}
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300 shadow-md">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </button>
                          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300 shadow-md">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300 shadow-md"
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
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Product</p>
                        <h3 className="text-base font-medium text-gray-800 mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">${product.prix}</span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart[product._id]}
                            className={`text-sm font-medium opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 ${
                              addingToCart[product._id] ? "text-green-500" : "text-[#FF6B6B]"
                            }`}
                          >
                            {addingToCart[product._id] ? "✓ Added!" : "+ Ajouter au panier"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF6B6B] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#ff5252] transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

export default Shop;
