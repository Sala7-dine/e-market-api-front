import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../config/axios";

const AddProductModal = ({ isOpen, onClose, categories = [] }) => {
  const queryClient = useQueryClient();

  const createProductApi = async (formDataToSend) => {
    const res = await axios.post("/products/create", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };

  const { mutate: createProduct, isLoading, isError, error } = useMutation({
    mutationKey: ["products"],
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      onClose();
      resetForm();
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prix: "",
    stock: "",
    categories: [],
  });
  const [images, setImages] = useState([]);

  // Category selector state
  const [catQuery, setCatQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", prix: "", stock: "", categories: [] });
    setImages([]);
    setCatQuery("");
    setDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const toggleCategory = (id) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(id);
      return {
        ...prev,
        categories: exists ? prev.categories.filter((c) => c !== id) : [...prev.categories, id],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("prix", formData.prix);
    formDataToSend.append("stock", formData.stock);
    formData.categories.forEach((categoryId) => {
      formDataToSend.append("categories[]", categoryId);
    });
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });
    createProduct(formDataToSend);
  };

  if (!isOpen) return null;

  // filtered categories by search
  const filteredCats = categories.filter((c) => c.name.toLowerCase().includes(catQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#FFF7F3] to-[#FDECEC] rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-600">Fill product details and choose categories</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {isError && (
            <div className="text-red-600 text-sm">
              {typeof error === "object" ? JSON.stringify(error, null, 2) : String(error)}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category — improved selector */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>

            {/* Selected tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.categories.map((catId) => {
                const c = categories.find((x) => x._id === catId) || categories.find((x) => x.id === catId);
                return (
                  <span key={catId} className="flex items-center space-x-2 bg-[#FFF3F3] text-[#FF6B6B] px-3 py-1 rounded-full text-sm">
                    <span>{c ? c.name : catId}</span>
                    <button
                      type="button"
                      onClick={() => toggleCategory(catId)}
                      className="-mr-1 p-1 hover:bg-white/60 rounded-full"
                      aria-label="Remove category"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Control */}
            <button
              type="button"
              onClick={() => setDropdownOpen((s) => !s)}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus:ring-2 focus:ring-[#FF6B6B]"
            >
              <span className="text-sm text-gray-700">{formData.categories.length ? `${formData.categories.length} selected` : "Select categories"}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-3 border-b border-gray-100">
                  <input
                    type="search"
                    value={catQuery}
                    onChange={(e) => setCatQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>
                <div className="max-h-44 overflow-auto p-2 space-y-1">
                  {filteredCats.length === 0 ? (
                    <div className="text-sm text-gray-500 p-2">No categories found</div>
                  ) : (
                    filteredCats.map((category) => (
                      <label key={category._id ?? category.id} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category._id ?? category.id)}
                          onChange={() => toggleCategory(category._id ?? category.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 flex justify-end">
                  <button type="button" onClick={() => setDropdownOpen(false)} className="px-3 py-1 text-sm font-medium text-[#8B7355]">Done</button>
                </div>
              </div>
            )}
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FF6B6B] transition-colors cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload-styled" />
              <label htmlFor="image-upload-styled" className="cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-[#FF6B6B] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#E05555] transition-colors font-medium disabled:opacity-50">{isLoading ? "Adding..." : "Add Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
