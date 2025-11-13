const ViewProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                <button className="aspect-square rounded-lg overflow-hidden border-2 border-blue-600 ring-2 ring-blue-200">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
                    alt="Thumbnail 1"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200"
                    alt="Thumbnail 2"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
                    alt="Thumbnail 3"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Casque Bluetooth Sony WH-1000XM5</h3>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-4xl font-bold text-blue-600">$3599</p>
              </div>

              {/* Category */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Category</p>
                <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  Électronique
                </span>
              </div>

              {/* Stock */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Stock Status</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-yellow-100 text-yellow-700">
                    12 units available
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">
                  Casque antibruit haut de gamme avec technologie de suppression active du bruit. 
                  Offre une qualité sonore exceptionnelle et un confort optimal pour une utilisation prolongée.
                </p>
              </div>

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="text-gray-900 font-medium">68e7b5010bf901dfd66d774a</span>
                </div> */}
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