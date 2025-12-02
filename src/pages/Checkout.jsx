// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCart, selectCartId } from "../features/cartSlice";
import { useAuth } from "../contexts/AuthContext";
import PaymentModal from "../components/PaymentModal";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { cart } = useSelector((state) => state.cart);
  const cartId = useSelector(selectCartId);
  const cartItems = Array.isArray(cart) ? cart : [];

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [discountCode, setDiscountCode] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    agreeTerms: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    dispatch(getCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const shippingCost = 5.0;
  const discount = 0;
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingCost - discount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    dispatch(getCart());
    setShowPaymentModal(false);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://readymadeui.com/images/product1.webp";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://res.cloudinary.com/dbrrmsoit/image/upload/${imageUrl}`;
  };

  return (
    <>
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#E8EEF2] to-[#D5E5F0] relative overflow-visible z-10">
        <Header />
      </section>

      {/* Checkout Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-gray-50 relative z-0">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">Paiement</h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations de livraison
              </h2>

              {/* Delivery/Pickup Options */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex items-center gap-3 px-6 py-4 border-2 rounded-lg text-left transition-all duration-300 ${
                    deliveryMethod === "delivery"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deliveryMethod === "delivery" ? "border-blue-500" : "border-gray-300"
                    }`}
                  >
                    {deliveryMethod === "delivery" && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 ${deliveryMethod === "delivery" ? "text-blue-500" : "text-gray-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">Livraison</span>
                </button>

                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex items-center gap-3 px-6 py-4 border-2 rounded-lg text-left transition-all duration-300 ${
                    deliveryMethod === "pickup"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deliveryMethod === "pickup" ? "border-blue-500" : "border-gray-300"
                    }`}
                  >
                    {deliveryMethod === "pickup" && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 ${deliveryMethod === "pickup" ? "text-blue-500" : "text-gray-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">Retrait</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Adresse email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Entrez votre numéro"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Pays <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 appearance-none"
                    >
                      <option value="">Choisir un pays</option>
                      <option value="Morocco">Maroc</option>
                      <option value="France">France</option>
                      <option value="USA">États-Unis</option>
                      <option value="Canada">Canada</option>
                    </select>
                    <svg
                      className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* City, State, ZIP Code */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ville"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Région</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Région"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Code postal"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    J'ai lu et j'accepte les{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Conditions générales
                    </a>
                    .
                  </label>
                </div>
              </form>
            </div>

            {/* Right Column - Review Cart */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Vérifier votre panier</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Votre panier est vide</div>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={item.productId?._id || index}
                      className="flex gap-4 pb-4 border-b border-gray-200"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={getImageUrl(item.productId?.images?.[0])}
                          alt={item.productId?.title}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.productId?.title || "Produit"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{item.quantity}x</p>
                        <p className="font-semibold text-gray-900">${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount Code */}
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Code de réduction"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-500 placeholder-gray-400"
                  />
                  <button className="text-blue-500 font-medium hover:text-blue-600 transition-colors duration-300">
                    Appliquer
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-semibold text-gray-900">${shippingCost.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Réduction</span>
                    <span className="font-semibold text-gray-900">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms || cartItems.length === 0}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 mb-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Payer maintenant
              </button>

              {/* Security Badge */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Paiement sécurisé - SSL Crypté</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Vos informations financières et personnelles sont sécurisées lors de chaque
                  transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        cartId={cartId}
        total={total}
        couponCode={discountCode}
      />

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#FF6B6B] text-white rounded-full shadow-lg hover:bg-[#ff5252] transition-all duration-300"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
};

export default Checkout;
