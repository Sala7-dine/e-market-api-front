import ProductCard from "../components/ProductCard";
import ProductSkeletonLoader from "../../../components/Products/ProductCardLoader.jsx";
import Pagination from "../../../components/Pagination";

const ProductsTab = ({
  products,
  isLoading,
  pagination,
  onPageChange,
  onAddProduct,
  onEditProduct,
  onViewProduct,
}) => (
  // console.log('ProductsTab - pagination:', pagination);
  // console.log('ProductsTab - onPageChange:', onPageChange);

  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button
        onClick={onAddProduct}
        className="ml-4 bg-[#FF6B6B] text-white px-6 py-2 rounded-lg hover:bg-[#E05555] transition-colors flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Product</span>
      </button>
    </div>

    {isLoading ? (
      <ProductSkeletonLoader />
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id ?? product.id}
              product={product}
              onEdit={onEditProduct}
              onView={onViewProduct}
            />
          ))}
        </div>

        {(pagination?.totalPages ?? 0) > 1 && (
          <Pagination
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={onPageChange}
            hasNext={(pagination?.currentPage ?? 1) < (pagination?.totalPages ?? 1)}
            hasPrev={(pagination?.currentPage ?? 1) > 1}
          />
        )}
      </>
    )}
  </div>
);
export default ProductsTab;
