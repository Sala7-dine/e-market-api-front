import React from "react";
import StatsCard from "../components/StatsCard";
import { getStatusColor } from "../utils/analytics";

const OverviewTab = ({ stats, orders, setActiveTab }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          color="bg-[#FFF0F0] text-[#FF6B6B]"
          badge={{ text: "+12.5%", className: "text-[#FF6B6B] bg-[#FFF3F3]" }}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          color="bg-[#F0FAFF] text-[#8B7355]"
          badge={{ text: "+8.2%", className: "text-[#8B7355] bg-[#FFF8F2]" }}
        />
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          color="bg-[#F9F5FF] text-[#9B6BFF]"
          badge={{ text: "+3", className: "text-[#8B7355] bg-[#FFF8F2]" }}
        />
        <StatsCard
          title="Items Sold"
          value={(stats?.totalItemsSold ?? 0).toLocaleString()}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          color="bg-[#fff7f0] text-[#E67A3D]"
          badge={{ text: "+24%", className: "text-[#E67A3D] bg-[#FFF7F0]" }}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-sm text-[#8B7355] hover:text-[#6B5335] font-medium"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FFF7F6]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.user?.fullName ?? "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
