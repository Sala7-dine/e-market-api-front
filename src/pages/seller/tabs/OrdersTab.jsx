import React, { useState } from "react";
import Pagination from "../../../components/Pagination";
import { getStatusColor } from "../utils/analytics";

const OrdersTab = ({ orders, pagination, onPageChange, onStatusChange, isUpdatingStatus, orderStatus, setOrderStatus }) => {
  const [editingOrderId, setEditingOrderId] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    onStatusChange(orderId, newStatus);
    setEditingOrderId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Search orders..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FFF7F6]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.user?.fullName ?? "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span>{item.productId?.title || item.productName}</span>
                          <span className="text-gray-500">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.orderTotal}</td>
                  <td className="px-6 py-4">
                    {editingOrderId === order._id ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B]"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditingOrderId(editingOrderId === order._id ? null : order._id)}
                      className="text-[#8B7355] hover:text-[#6B5335] text-sm font-medium"
                    >
                      {editingOrderId === order._id ? "Cancel" : "Edit Status"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(pagination?.totalPages ?? 0) > 1 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={pagination?.currentPage ?? 1}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={onPageChange}
              hasNext={(pagination?.currentPage ?? 1) < (pagination?.totalPages ?? 1)}
              hasPrev={(pagination?.currentPage ?? 1) > 1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
