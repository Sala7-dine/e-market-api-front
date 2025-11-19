import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../../assets/styles/admin/Products.css";
import { fetchAllProducts ,deleteproduct} from "../../features/productSlice";
import { useDispatch, useSelector } from "react-redux";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchAllProducts());
    console.log("hello")
  }, [dispatch]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

 

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

   const handleDelete = async (id) => {
    try {
      console.log("deleting", id);
      await dispatch(deleteproduct(id)); 
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };
  
const handleViewImages = (product) => {
  setSelectedProduct(product); 
  setShowImageModal(true);     
};



  return (
    <div className="products-container">

      <div className="product-header">
        <h2>Gestion des Produits</h2>
        <p>Gérez votre inventaire de produits</p>
      </div>

      {/* Stats */}
      <div className="stat-product">
        <div className="stat-box">
          <h3>Total Produits</h3>
          <p>{products.length}</p>
        </div>

        <div className="stat-box">
          <h3>En stock</h3>
          <p> {products.filter((product) => product.stock > 0).length} </p>
        </div>

        <div className="stat-box">
          <h3>Rupture</h3>
          <p>10</p>
        </div>

        <div className="stat-box">
          <h3>Valeur du stock</h3>
          <p>
            10
            €
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="products-table-container">

        <table className="products-table">
          <thead>
            <tr>
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
                <td>{product.title}</td>
                <td className="desc">{product.description}</td>
                <td>
                  <span
                    className={`status ${product.stock > 10
                        ? "active"
                        : product.stock > 0
                          ? "warning"
                          : "blocked"
                      }`}
                  >
                    {product.stock} unités
                  </span>
                </td>
                <td>{product.price} €</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => handleViewImages(product)}
                  >
                    <FaEye size={16} color="#A0522D" />
                  </button>
                </td>
                <td>
                 
                  <button
                    className="btn-delete"
                    onClick={() => confirmDelete(product)}
                  >
                    <FaTrash size={16} color="#A0522D" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showImageModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Images - {selectedProduct.title}</h3>

            <button
              className="modal-close"
              onClick={() => setShowImageModal(false)}
            >
              ×
            </button>

            <div className="modal-images">
              {selectedProduct.images.length > 0 ? (
                selectedProduct.images.map((img, index) => (
                  <img src={`${img}`} alt={selectedProduct.title} />

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
              Supprimer le produit{" "}
              <strong>{productToDelete?.name}</strong> ?
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>

              <button
                className="btn-confirm"
                onClick={() => handleDelete(productToDelete._id)}
              >
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
