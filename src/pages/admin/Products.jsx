// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import "../../assets/styles/admin/Products.css";
import { fetchAllProducts, deleteproduct } from "../../features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, currentPage, totalPages, limit } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchAllProducts({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteproduct(id));
      dispatch(fetchAllProducts({ page: currentPage, limit }));
      setShowDeleteModal(false);
    } catch {
      // Error deleting product
    }
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleViewImages = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  if (loading) return <p>Chargement...</p>;

  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="products-container">
      <div className="product-header">
        <h2>Gestion des Produits</h2>
        <p>Gérez votre inventaire de produits</p>
      </div>
      {/* Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produit</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Prix</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.title}</td>
                <td className="desc">{product.description}</td>
                <td>
                  <span
                    className={`status ${
                      product.stock > 10 ? "active" : product.stock > 0 ? "warning" : "blocked"
                    }`}
                  >
                    {product.stock} unités
                  </span>
                </td>
                <td>{product.prix} €</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewImages(product)}>
                    <FaEye size={16} color="#5a9ed1" />
                  </button>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => confirmDelete(product)}>
                    <FaTrash size={16} color="#FF6F61" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(fetchAllProducts({ page, limit }))}
          hasPrev={currentPage > 1}
          hasNext={currentPage < totalPages}
        />
      </div>

      {/* Modals */}
      {showImageModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Images - {selectedProduct.title}</h3>

            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              ×
            </button>

            <div className="modal-images">
              {selectedProduct.images?.length > 0 ? (
                selectedProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={
                      img?.startsWith("http")
                        ? img
                        : `https://res.cloudinary.com/dbrrmsoit/image/upload/${img}`
                    }
                    alt={selectedProduct.title}
                    className="modal-image-item"
                  />
                ))
              ) : (
                <p>Aucune image disponible</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirmer la suppression</h3>
            <p>
              Supprimer le produit <strong>{productToDelete?.name}</strong> ?
            </p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>

              <button className="btn-confirm" onClick={() => handleDelete(productToDelete._id)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
