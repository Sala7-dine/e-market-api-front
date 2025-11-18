import { useMemo } from "react";

const ViewProductModal = ({ isOpen, onClose, product, onEdit }) => {
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) {
      return product.images
        .filter(img => img && typeof img === "string")
        .map(img => {
          if (img.startsWith("http")) return img;
          if (img.startsWith("e-market-dh-03e9602f6d1a.herokuapp.com")) return `https://${img}`;
          return `https://e-market-dh-03e9602f6d1a.herokuapp.com${img.startsWith("/") ? "" : "/"}${img}`;
        });
    }
    if (typeof product.images === "string" && product.images) {
      if (product.images.startsWith("http")) return [product.images];
      if (product.images.startsWith("e-market-dh-03e9602f6d1a.herokuapp.com")) return [`https://${product.images}`];
      return [`https://e-market-dh-03e9602f6d1a.herokuapp.com${product.images.startsWith("/") ? "" : "/"}${product.images}`];
    }
    return [];
  }, [product]);

  // prepare a joined string of category names (safe)
  const categoryNames = useMemo(() => {
    if (!product || !Array.isArray(product.categories) || product.categories.length === 0) return "Uncategorized";
    // map to names, filter falsy, then join. Choose separator here: ", " or " — "
    return product.categories
      .map(c => (c && (c.name ?? c)) ?? "")
      .filter(Boolean)
      .join(", ");
  }, [product]);

  if (!isOpen || !product) return null;

  console.log(images[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="view-product-title" className="text-2xl font-bold text-gray-900">
            {product.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={images?.[0]?.trim()}
                  alt={product.title}
                  onError={(e) => {
                    console.error("Image failed to load:", e.currentTarget.src);
                    console.log("images[0] value:", images && images[0]);
                  }}
                  onLoad={() => console.log("Image loaded OK:", images && images[0])}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${i === 0 ? "border-blue-600" : "border-gray-200"}`}
                    >
                      <img src={src} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{product.title}</h3>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-4xl font-bold text-blue-600">{product.prix}</p>
              </div>

              {/* Category */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Category</p>
                <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  {categoryNames}
                </span>
              </div>

              {/* Stock */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Stock Status</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-yellow-100 text-yellow-700">
                    {product.stock}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 font-medium">Nov 13, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900 font-medium">Nov 13, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => onEdit?.(product)}
              type="button"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
