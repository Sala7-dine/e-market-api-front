import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import hm1 from "../assets/images/hero-1.png";
import hm2 from "../assets/images/hero-2.png";
import bannerBg from "../assets/images/banner-bg.png";
import ctaImage from "../assets/images/cta.png";
import { useDispatch } from "react-redux";
import { addToCart, getCart } from "../features/cartSlice.js";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [_currentSlide, _setCurrentSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});

  const heroImages = [hm1, hm2];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data.data);
      } catch {
        // Ignore error
      }
    };
    fetchProducts();
  }, []);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextHeroSlide = () => {
    setHeroSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevHeroSlide = () => {
    setHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
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

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#E8EEF2] to-[#D5E5F0] min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-6 py-44">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            {/* Left Side - Image */}
            <div className="md:w-1/2 relative">
              {/* Slide Navigation */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-10">
                <button onClick={prevHeroSlide} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <span className="text-gray-600 font-medium">
                  {String(heroSlide + 1).padStart(2, "0")}
                </span>
                <button onClick={nextHeroSlide} className="text-gray-600 hover:text-gray-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Chair Image */}
              <div className="pl-16">
                <img
                  src={heroImages[heroSlide]}
                  alt="Comfort Chair"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl transition-opacity duration-500"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="md:w-1/2 mt-12 md:mt-0 text-center md:text-left">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
                <span className="text-[#FF6B6B] font-serif italic">30% Off</span>
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Luxury Watch</h2>
              <p className="text-xl text-gray-700 mb-8">Collect from Zendora & get 30% Discount.</p>
              <button className="border-2 border-[#FF6B6B] text-[#FF6B6B] px-8 py-3 rounded hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300 font-medium">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
      </section>

      {/* Banner Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div
            className="relative rounded-lg overflow-hidden shadow-xl min-h-[350px] bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerBg})` }}
          ></div>
        </div>
      </section>

      {/* Best Sell Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Best Sell</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular products with amazing deals and quality you can trust.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
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

                  {/* Hover Actions */}
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
                  <h3 className="text-base font-medium text-gray-800 mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.prix}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart[product._id]}
                      className={`text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        addingToCart[product._id] ? "text-green-500" : "text-[#FF6B6B]"
                      }`}
                    >
                      {addingToCart[product._id] ? "✓ Added!" : "+ Add To Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Winter Discount CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left Side - Image */}
            <div className="md:w-1/2">
              <img src={ctaImage} alt="Winter Discount" className="w-full h-auto rounded-lg" />
            </div>

            {/* Right Side - Content */}
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-4 leading-relaxed">
                Discover amazing deals on premium furniture and home decor items.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Winter Discount
                <br />
                Up to 20%
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Transform your home with our carefully curated collection of modern furniture and
                accessories.
              </p>
              <button className="border-2 border-[#FF6B6B] text-[#FF6B6B] px-6 py-2 text-sm rounded hover:bg-[#FF6B6B] hover:text-white transition-colors duration-300 font-medium">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">All Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of premium products designed for modern living.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product._id || index} className="group">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {product.stock === 0 && (
                    <span className="absolute top-3 right-3 bg-[#FF6B6B] text-white text-[10px] font-semibold w-12 h-12 rounded-full flex items-center justify-center leading-tight z-10">
                      Sold
                      <br />
                      Out
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

                  {/* Hover Actions */}
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
                  <h3 className="text-base font-medium text-gray-800 mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.prix}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart[product._id] || product.stock === 0}
                      className={`text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        addingToCart[product._id] ? "text-green-500" : "text-[#FF6B6B]"
                      }`}
                    >
                      {addingToCart[product._id] ? "✓ Added!" : "+ Add To Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
