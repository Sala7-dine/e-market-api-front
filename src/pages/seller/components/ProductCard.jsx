import React from "react";
import { getImageUrl } from "../../../utils/imageHelper";

const ProductCard = ({ product, onEdit, onView }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images?.[0] && (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-gray-900">${product.prix}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stock:</span>
            <span className={`font-semibold ${product.stock < 20 ? "text-[#FF6B6B]" : "text-gray-900"}`}>
              {product.stock} units
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-[#FFF6F6] text-[#8B7355] py-2 rounded-lg hover:bg-[#FFF2F2] transition-colors text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onView(product)}
            className="flex-1 bg-[#FF6B6B] text-white py-2 rounded-lg hover:bg-[#E05555] transition-colors text-sm font-medium"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
