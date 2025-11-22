import React from "react";

export default function OrderHistory() {
  return (
    <div className="min-h-screen bg-[#E8EEF2] p-6">
      <div className="text-sm text-gray-500 mb-4">Accueil / <span className="text-[#FF6B6B] font-medium">Historique des Commandes</span></div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">Historique des Commandes</h1>
      <p className="text-gray-600 mb-8">Consultez et suivez toutes vos commandes en un seul endroit</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="bg-white rounded-xl p-5 shadow-sm h-max">
          {/* Search */}
          <div className="mb-6">
            <label className="text-gray-700 font-medium text-sm">Rechercher</label>
            <input
              type="text"
              placeholder="Numéro de commande..."
              className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:bg-[#FF6B6B] focus:outline-none"
            />
          </div>

          {/* Filter by status */}
          <div className="mb-6">
            <label className="text-gray-700 font-medium text-sm">Filtrer par statut</label>
            <div className="flex flex-col gap-2 mt-3 text-sm">
              {[
                "Toutes les commandes",
                "En attente",
                "En cours",
                "Expédiée",
                "Livrée",
                "Annulée",
              ].map((item) => (
                <button
                  key={item}
                  className={`text-left px-3 py-2 rounded-lg hover:bg-pink-100 ${
                    item === "Toutes les commandes" ? "bg-pink-50 text-[#FF6B6B] font-medium" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Période</label>
            <select className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:bg-[#FF6B6B] focus:outline-none">
              <option>Tous</option>
              <option>Ce mois</option>
              <option>3 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
        </div>

        {/* Orders list */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Order card */}
          {[
            {
              id: "#547998",
              date: "28 Oct 2025",
              articles: 1,
              total: "259.00 €",
              status: "Livrée",
              img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200",
            },
            {
              id: "#547845",
              date: "24 Oct 2025",
              articles: 4,
              total: "449.99 €",
              status: "Livrée",
              img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
            },
            {
              id: "#547654",
              date: "19 Oct 2025",
              articles: 2,
              total: "99.90 €",
              status: "Expédiée",
              img: "https://images.unsplash.com/photo-1528701800489-20be3c2a73b8?w=200",
            },
          ].map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between"
            >
              {/* Left */}
              <div className="flex gap-4 items-center">
                <img
                  src={order.img}
                  alt="product"
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                  <h3 className="text-[#8B7355] font-semibold">Commande {order.id}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                    <span>{order.date}</span>
                    <span>•</span>
                    <span>{order.articles} article(s)</span>
                  </div>
                  <p className="text-[#8B7355] font-semibold mt-1">Total: {order.total}</p>
                </div>
              </div>

              {/* Status + Button */}
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${
                    order.status === "Livrée"
                      ? "text-green-600 border-green-300 bg-green-50"
                      : "text-purple-600 border-purple-300 bg-purple-50"
                  }`}
                >
                  {order.status}
                </span>

                <button className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FF6B6B]">
                  Voir la commande →
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button className="px-3 py-1 border rounded-lg">&lt;</button>
            <button className="px-3 py-1 border rounded-lg">1</button>
            <button className="px-3 py-1 border rounded-lg bg-[#FF6B6B] text-white">2</button>
            <button className="px-3 py-1 border rounded-lg">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
