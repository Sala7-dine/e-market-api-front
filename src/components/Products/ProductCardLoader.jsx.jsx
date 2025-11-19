const ProductSkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200"></div>
          
          {/* Content Skeleton */}
          <div className="p-4">
            {/* Title Skeleton */}
            <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
            
            {/* Info Rows Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            
            {/* Buttons Skeleton */}
            <div className="flex space-x-2">
              <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeletonLoader;