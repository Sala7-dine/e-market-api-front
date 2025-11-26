import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUserOrders } from "../features/orderSlice";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const {
    orders,
    loading,
    page: currentPage,
    totalPages,
  } = useSelector((state) => state.order);

  // const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes les commandes");

  const [openOrderId, setOpenOrderId] = useState(null);

  const toggleOrder = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  useEffect(() => {
    dispatch(getUserOrders({ page: currentPage, limit: 5 }));
  }, [dispatch, currentPage]);

  // console.log("Redux orders:", orders);
  // console.log("Type of orders:", typeof orders);
  // console.log("Is array?:", Array.isArray(orders));
  // console.log("Orders length:", orders?.length);

  const filteredOrders = (orders || [])
    .filter((o) => o._id.toLowerCase().includes(search.toLowerCase()))
    .filter((o) =>
      statusFilter === "Toutes les commandes" ? true : o.status === statusFilter
    );

  console.log("oredres", filteredOrders);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#E8EEF2] p-6">
        {/* <div className="text-sm text-gray-500 mb-4 cursor-pointer">
          Accueil /{" "}
          <span className="text-[#FF6B6B] font-medium cursor-pointer">
            Historique des Commandes
          </span>
        </div> */}

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Historique des Commandes</h1>
        <p className="text-gray-600 mb-8">
          Consultez et suivez toutes vos commandes en un seul endroit
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="bg-white rounded-xl p-5 shadow-sm h-max">
            {/* Search */}
            <div className="mb-6">
              <label className="text-gray-700 font-medium text-sm">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Numéro de commande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:bg-[#FF6B6B] focus:outline-none"
              />
            </div>

            {/* Filter by status */}
            <div className="mb-6">
              <label className="text-gray-700 font-medium text-sm">
                Filtrer par statut
              </label>
              <div className="flex flex-col gap-2 mt-3 text-sm">
                {[
                  "Toutes les commandes",
                  "pending",
                  "paid",
                  "shipped",
                  "Livrée",
                  "cancelled",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setStatusFilter(item)}
                    className={`text-left px-3 py-2 rounded-lg hover:bg-pink-100 ${
                      statusFilter === item
                        ? "bg-pink-50 text-[#FF6B6B] font-medium"
                        : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders list */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Order card */}

            {loading && <p>Chargement...</p>}

            {!loading && filteredOrders.length === 0 && (
              <p className="text-gray-600">Aucune commande trouvée.</p>
            )}
            {!loading &&
              filteredOrders.map((order) => {
                const date = new Date(order.createdAt);

              const customId =
                date.getFullYear() +
                (date.getMonth() + 1).toString().padStart(2, "0") +
                date.getDate().toString().padStart(2, "0") +
                "-" +
                date.getHours().toString().padStart(2, "0") +
                date.getMinutes().toString().padStart(2, "0");
                return(
                <div
                  key={order._id}
                  className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between"
                >
                  {/* Left */}
                  <div className="flex gap-4 items-center">
                    {/* <img
                    src={order.items[0].image}
                    alt="product"
                    className="w-20 h-20 object-cover rounded-lg"
                  /> */}

                    <div>
                      <h3 className="text-[#8B7355] font-semibold">
                        Commande #{customId}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} article(s)</span>
                      </div>
                      <p className="text-[#8B7355] font-semibold mt-1">
                        Total: {order.totalPrice} €
                      </p>
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

                    <button
                      onClick={() => toggleOrder(order._id)}
                      className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FF6B6B]"
                    >
                      {openOrderId === order._id
                        ? "Fermer ↑"
                        : "Voir la commande →"}
                    </button>
                  </div>

                  {openOrderId === order._id && (
                    <div className="mt-4 bg-white rounded-xl shadow-md p-4 border border-gray-200">
                      <div className="max-h-80 overflow-y-auto space-y-4">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-sm"
                          >
                            <img
                              src={
                                item.productId?.images?.[0]?.startsWith("http")
                                  ? item.productId.images[0]
                                  : `https://res.cloudinary.com/dbrrmsoit/image/upload/${item.productId?.images?.[0]}`
                              }
                              className="w-20 h-20 object-cover rounded-lg"
                            />

                            <div className="flex-1">
                              <h4 className="text-base text-gray-800">
                                {item.productId?.title}
                              </h4>
                              <p className="text-lg font-bold text-[#FF6B6B]">
                                {item.price} €
                              </p>

                              <div className="text-sm text-gray-600 mt-2">
                                Quantité : {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-700">
                            Total :
                          </span>
                          <span className="text-lg font-bold text-[#FF6B6B]">
                            {order.totalPrice} €
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )})}

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                className="px-3 py-1 border rounded-lg cursor-pointer"
                disabled={currentPage === 1}
                onClick={() =>
                  dispatch(getUserOrders({ page: currentPage - 1, limit: 5 }))
                }
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 border rounded-lg
              ${currentPage === i + 1 ? "bg-[#FF6B6B] text-white" : ""}`}
                  onClick={() =>
                    dispatch(getUserOrders({ page: i + 1, limit: 5 }))
                  }
                >
                  {i + 1}
                </button>
              ))}

              {/* <button className="px-3 py-1 border rounded-lg bg-[#FF6B6B] text-white">
                2
              </button> */}
              <button
                className="px-3 py-1 border rounded-lg cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={() =>
                  dispatch(getUserOrders({ page: currentPage + 1, limit: 5 }))
                }
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
