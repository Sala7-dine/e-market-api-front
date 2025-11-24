import React from "react";
import { getImageUrl } from "../../../utils/imageHelper";

const AnalyticsTab = ({ revenueByMonth, bestSellers }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Overview (Last 6 Months)
          </h3>
          {revenueByMonth.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {revenueByMonth.map((data, idx) => {
                const maxRevenue = Math.max(...revenueByMonth.map((d) => d.revenue));
                const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-semibold text-[#FF6B6B]">
                      ${(data.revenue / 1000).toFixed(1)}k
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#FF6B6B] to-[#FF8A8A] rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                      title={`$${data.revenue.toLocaleString()}`}
                    />
                    <div className="text-xs font-medium text-gray-600">{data.month}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          {bestSellers.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No sales data available
            </div>
          ) : (
            <div className="space-y-4">
              {bestSellers.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FFF3F3] text-[#FF6B6B] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#FF6B6B]">
                    ${product.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
