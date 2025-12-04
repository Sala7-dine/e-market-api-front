import { useState } from "react";
import { getCart, removeFromCart, updateProductQuantity } from "../features/cartSlice";
import { useDispatch } from "react-redux";
import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../config/axios";
import PaymentModal from "../components/PaymentModal";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  //on recupere le panier et l'état depuis le store
  // const {cart} = useSelector((state) => state.cart);
  // const loading = useSelector((state) => state.loading);
  const fetchCartApi = async () => {
    const res = await axios.get("/carts/getcarts");
    return res.data.data[0];
  };

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartApi,
  });
  const cartItems = cartData?.items || [];
  const cartId = cartData?._id;

  // useEffect(() => {
  //   dispatch(getCart());
  // }, [dispatch]);

  // Calcul du total

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.08; // 8% de taxe
  const estimatedTax = subtotal * taxRate;
  const total = subtotal + estimatedTax;

  //mette à jours la quantité
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateProductQuantity({ productId, quantity })).then(() => dispatch(getCart()));
  };

  // Supprimer un article
  const removeItem = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  return (
    <div className="min-h-screen bg-[#F5F0EC] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">Your Shopping Cart</h1>
          <p className="text-gray-500">Review your items before checkout</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste des articles */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6"
                >
                  {/* Image du produit */}
                  <img
                    src={
                      item.productId?.images?.[0]?.startsWith("http")
                        ? item.productId.images[0]
                        : `https://res.cloudinary.com/dbrrmsoit/image/upload/${item.productId?.images?.[0] || "placeholder"}`
                    }
                    alt={item.productId?.title || "Product"}
                    className="w-28 h-28 rounded-xl object-cover"
                  />

                  {/* Informations du produit */}
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-gray-800 mb-1">
                      {item.productId?.title || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{item.categories}</p>
                    <p className="text-xl font-medium text-gray-800">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Contrôles de quantité */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 mr-2">Quantity:</span>
                      <button
                        onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                        disabled={!item.productId?._id}
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                        disabled={!item.productId?._id}
                      >
                        +
                      </button>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => removeItem(item.productId?._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                      disabled={!item.productId?._id}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Résumé de commande */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-8">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">Order Summary</h2>

              {/* Détails des prix */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between text-xl font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={cartItems.length === 0}
                className="w-full bg-[#8A6B58] text-white py-4 rounded-full font-medium hover:bg-[#725744] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                <ShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </button>

              {/* Bouton continuer les achats */}
              <button
                onClick={() => navigate("/")}
                className="w-full border border-gray-300 text-gray-700 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>

              {/* Message de livraison gratuite */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Free shipping on orders over $200
              </p>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cartId={cartId}
        total={total}
      />
    </div>
  );
}
