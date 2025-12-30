import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { addToCart, getCart } from "../features/cartSlice";
import { useAuth } from "../contexts/AuthContext";
import pro1 from "../assets/images/pro-1.png";
import pro2 from "../assets/images/pro-2.png";
import pro3 from "../assets/images/pro-3.png";
import pro4 from "../assets/images/pro-4.png";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("comments");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (product && !isAddingToCart) {
      setIsAddingToCart(true);
      dispatch(addToCart({ productId: product._id, quantity }))
        .then(() => dispatch(getCart()))
        .finally(() => {
          setTimeout(() => setIsAddingToCart(false), 500);
        });
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return pro1;
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://res.cloudinary.com/dbrrmsoit/image/upload/${imageUrl}`;
  };

  // Images temporaires pour la galerie
  const tempImages = [pro1, pro2, pro3, pro4];

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Product not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="bg-white relative overflow-visible z-10">
        <Header />
      </section>

      {/* Product Detail Section */}
      <section className="py-16 bg-white relative z-0">
        <div className="container mx-auto px-6">
          <Link to="/" className="text-[#FF6B6B] hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#FF6B6B]">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800">Product</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Product Images */}
            <div className="flex flex-col h-full">
              {/* Main Image */}
              <div className="mb-4 flex-1">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.title}
                  className="w-full h-96 object-contain rounded-lg bg-gray-50"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-3 overflow-hidden flex-1">
                    <div className="flex gap-3 transition-transform duration-300">
                      {tempImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                            selectedImage === index
                              ? "border-[#FF6B6B]"
                              : "border-gray-300 hover:border-[#FF6B6B]"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div>
              <p className="text-gray-500 text-sm mb-1">Product</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {product.description ||
                  "High-quality product with excellent features and modern design."}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">${product.prix}</span>
                {product.stock < 5 && product.stock > 0 && (
                  <span className="bg-[#FF6B6B] text-white text-xs px-3 py-1 rounded">
                    Limited Stock
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Stock Info */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Stock: {product.stock} available</p>
                {product.averageRating && (
                  <p className="text-gray-600 text-sm">Rating: {product.averageRating}/5</p>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={decreaseQuantity}
                      className="px-3 py-2 text-sm hover:bg-gray-100 rounded-l-full transition-colors duration-300"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-12 text-sm text-center border-x border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="px-3 py-2 text-sm hover:bg-gray-100 rounded-r-full transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 mb-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B6B] transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span className="text-xs">Compare</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B6B] transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs">Add to wishlist</span>
                </button>
              </div>

              {/* Add to Cart Button */}
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full max-w-xs px-6 py-3 text-sm rounded-full font-medium transition-all duration-200 mb-4 flex items-center justify-center gap-2 ${
                    isAddingToCart
                      ? "bg-green-500 text-white"
                      : "bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Added
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              ) : (
                <button className="w-full max-w-xs px-6 py-3 text-sm border-2 border-gray-300 text-gray-600 rounded-full font-medium mb-4 cursor-not-allowed">
                  Out of Stock
                </button>
              )}

              {/* Payment Methods */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-700 text-sm font-medium mb-4">Guaranteed safe checkout</p>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                    VISA
                  </div>
                  <div className="h-6 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                    MC
                  </div>
                  <div className="h-6 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                    PP
                  </div>
                  <div className="h-6 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                    GPay
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Tabs Navigation */}
          <div className="flex items-center justify-center gap-8 mb-12 border-b border-gray-200">
            {["description", "comments", "reviews", "shipping", "size"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 pb-4 transition-colors duration-300 capitalize ${
                  activeTab === tab
                    ? "text-gray-900 border-b-2 border-gray-900 font-medium"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab === "shipping" ? "Shipping Policy" : tab === "size" ? "Size Chart" : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-600 leading-relaxed">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                  praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                  excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                  officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                  rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                  eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
                  possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
                  quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
                  voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic
                  tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias
                  consequatur aut perferendis doloribus asperiores repellat. In a free hour, when
                  our power of choice is untrammelled and when nothing prevents our being able to do
                  what we like best, every pleasure is to be welcomed and every pain avoided. But in
                  certain circumstances and owing to the claims of duty or the obligations of
                  business it will frequently occur that pleasures have to be repudiated and
                  annoyances accepted. The wise man therefore always holds in these matters to this
                  principle of selection: he rejects pleasures to secure other greater pleasures, or
                  else he endures pains to avoid worse pains.
                </p>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">0 Comments</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white text-sm rounded hover:bg-[#ff5252] transition-colors duration-300">
                    <span>Login</span>
                  </button>
                </div>
                <p className="text-center text-gray-400 py-12">Be the first to comment.</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <p className="text-gray-600 leading-relaxed">No reviews yet.</p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <p className="text-gray-600 leading-relaxed">
                  Free shipping on orders over $50. Standard delivery takes 3-5 business days.
                </p>
              </div>
            )}

            {activeTab === "size" && (
              <div>
                <p className="text-gray-600 leading-relaxed">Size chart information goes here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Related Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover more products you might like</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tempImages.map((image, index) => (
              <div key={index} className="group">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Product</p>
                  <h3 className="text-base font-medium text-gray-800 mb-2">
                    Related Product {index + 1}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${50 + index * 10}.00</span>
                    </div>
                    <button className="text-[#FF6B6B] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      + Add To Cart
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

export default ProductDetail;
