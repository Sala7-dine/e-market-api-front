import { useEffect } from "react";

const OrderDetailsModal = ({ order, customId, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!order) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "paid":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "Livrée":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Commande #{customId}</h2>
            <p className="text-sm opacity-90 mt-1">{new Date(order.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition">
                <img
                  src={item.productId?.images?.[0]?.startsWith("http") ? item.productId.images[0] : `https://res.cloudinary.com/dbrrmsoit/image/upload/${item.productId?.images?.[0]}`}
                  alt={item.productId?.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">{item.productId?.title}</h4>
                  <p className="text-2xl font-bold text-[#FF6B6B] mt-1">{item.price} €</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Quantité:</span>
                    <span className="bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-sm font-medium">{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Statut:</span>
            <span className={`px-4 py-2 rounded-full font-medium ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-semibold text-gray-700">Total:</span>
            <span className="text-3xl font-bold text-[#FF6B6B]">{order.totalPrice} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
