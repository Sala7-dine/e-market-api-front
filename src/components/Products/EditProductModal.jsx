import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
  selectProductsLoading,
  selectProductsError,
  fetchProducts,
} from "../../features/productSlice";

// Simple custom multi-select (no external libs) for better UX than native <select multiple>
const MultiSelectCategories = ({ categories = [], value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleOption = (id) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="min-h-[44px] w-full border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((s) => !s)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((s) => !s); }}
      >
        <div className="flex-1 flex flex-wrap gap-2">
          {value.length === 0 && (
            <span className="text-sm text-gray-400">Select categories...</span>
          )}
          {value.map((id) => {
            const cat = categories.find((c) => c._id === id) || categories.find((c) => c.id === id);
            return (
              <div key={id} className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-2">
                <span>{cat ? cat.name : id}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleOption(id); }}
                  aria-label={`Remove ${cat ? cat.name : id}`}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div className="text-sm text-gray-500">▾</div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 p-3">
          <input
            className="w-full px-3 py-2 border border-gray-200 rounded mb-2"
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-48 overflow-auto">
            {filtered.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.includes(cat._id)}
                  onChange={() => toggleOption(cat._id)}
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500 px-2 py-2">No categories</div>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded bg-gray-100 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EditProductModal = ({ isOpen, onClose, product, categories = [] }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prix: "",
    stock: "",
    categories: [],
  });

  // new images stored as { file, preview }
  const [images, setImages] = useState([]);
  // existingImages stored as { id, url }
  const [existingImages, setExistingImages] = useState([]);
  // track removed existing image ids to tell backend which to delete
  const [removedExistingImages, setRemovedExistingImages] = useState([]);

  // base used to build absolute url when product gives relative paths
  const baseUrl = "https://e-market-dh-03e9602f6d1a.herokuapp.com";

  useEffect(() => {
    if (product) {
      // normalize categories
      const cats = Array.isArray(product.categories)
        ? product.categories.map((cat) => (cat._id || cat))
        : product.categories
        ? [product.categories]
        : [];

      setFormData({
        title: product.title || "",
        description: product.description || "",
        prix: product.prix || product.price || "",
        stock: product.stock || "",
        categories: cats,
      });

      // normalize existing images into { id, url }
      const normalized = (product.images || []).map((img) => {
        if (!img) return null;
        if (typeof img === "string") {
          const url = img.startsWith("http") ? img : `${baseUrl}${img.startsWith("/") ? "" : "/"}${img}`;
          const id = img; // keep original string as id (backend should accept this id or filename)
          return { id, url };
        }
        // img is object
        const url = img.url || img.path || img.src || img.preview || "";
        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
        const id = img._id || img.id || img.filename || fullUrl;
        return { id, url: fullUrl };
      }).filter(Boolean);

      setExistingImages(normalized);
      setRemovedExistingImages([]);
      // clear new images previews when product changes
      setImages((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.preview));
        return [];
      });
    }
  }, [product]);

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      images.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleCategoriesChange = (newValue) => {
    setFormData((fd) => ({ ...fd, categories: newValue }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...mapped]);
    // reset input so same file can be picked again if needed
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setRemovedExistingImages((prev) => [...prev, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product) return;

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("prix", formData.prix);
    form.append("stock", formData.stock);

    // categories
    (formData.categories || []).forEach((c) => form.append("categories[]", c));

    // keep existing images (those not removed)
    existingImages.forEach((img) => form.append("existingImages[]", img.id));
    // inform backend what to remove
    removedExistingImages.forEach((id) => form.append("removedImages[]", id));

    // new images
    images.forEach((item) => form.append("images", item.file));

    dispatch(updateProduct({ id: product._id, productData: form })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(fetchProducts());
        handleClose();
      }
    });
  };

  const handleClose = () => {
    // revoke previews
    images.forEach((p) => URL.revokeObjectURL(p.preview));
    setImages([]);
    setExistingImages([]);
    setRemovedExistingImages([]);
    setFormData({ title: "", description: "", prix: "", stock: "", categories: [] });
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className=" flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="text-red-600 text-sm">
              {typeof error === "object" ? JSON.stringify(error, null, 2) : error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                name="prix"
                min="0"
                step="0.01"
                value={formData.prix}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <MultiSelectCategories
              categories={categories}
              value={formData.categories}
              onChange={handleCategoriesChange}
            />
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img src={image.url} alt="Existing" className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                        title="Remove this image"
                        aria-label={`Remove image`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload product images"
              />

              <div>
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm text-gray-600">Click to upload new images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>

            {/* New Images Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((item, index) => (
                  <div key={index} className="relative group">
                    <img src={item.preview} alt={`New Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                      aria-label={`Remove new image ${index + 1}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
