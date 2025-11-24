import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../config/axios";

const ViewProductModal = ({ isOpen, onClose, product, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isLoading: isDeleting } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/products/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      onClose();
    },
  });

  const handleDelete = () => {
    if (product?._id) {
      deleteProduct(product._id);
    }
  };
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) {
      return product.images
        .filter((img) => img && typeof img === "string")
        .map((img) => {
          if (img.startsWith("http")) return img;
          if (img.startsWith("e-market-dh-03e9602f6d1a.herokuapp.com"))
            return `https://${img}`;
          return `https://e-market-dh-03e9602f6d1a.herokuapp.com${
            img.startsWith("/") ? "" : "/"
          }${img}`;
        });
    }
    if (typeof product.images === "string" && product.images) {
      if (product.images.startsWith("http")) return [product.images];
      if (product.images.startsWith("e-market-dh-03e9602f6d1a.herokuapp.com"))
        return [`https://${product.images}`];
      return [
        `https://e-market-dh-03e9602f6d1a.herokuapp.com${
          product.images.startsWith("/") ? "" : "/"
        }${product.images}`,
      ];
    }
    return [];
  }, [product]);

  const categoryNames = useMemo(() => {
    if (
      !product ||
      !Array.isArray(product.categories) ||
      product.categories.length === 0
    )
      return "Uncategorized";
    return product.categories
      .map((c) => (c && (c.name ?? c)) ?? "")
      .filter(Boolean)
      .join(", ");
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#FFF7F3] to-[#FDECEC] rounded-t-xl">
          <h2
            id="view-product-title"
            className="text-2xl font-bold text-gray-900"
          >
            {product.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {images?.[0] ? (
                  <img
                    src={images[0].trim()}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        i === 0 ? "border-[#FF6B6B]" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${product.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {product.title}
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-4xl font-bold text-[#FF6B6B]">
                  {product.prix}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Category</p>
                <span className="inline-flex items-center px-4 py-2 bg-[#FFF3F3] text-[#FF6B6B] rounded-lg font-medium">
                  {categoryNames}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Stock Status</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-[#FFF8F2] text-[#E67A3D]">
                    {product.stock}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 font-medium">
                    Nov 13, 2025
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900 font-medium">
                    Nov 13, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all font-medium disabled:opacity-50 group"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </span>
            </button>
            <button
              onClick={() => onEdit?.(product)}
              type="button"
              className="flex-1 px-6 py-3 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#E05555] transition-colors font-medium"
            >
              Edit Product
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProductModal;

