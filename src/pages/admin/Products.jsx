import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../../assets/styles/admin/Products.css";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "iPhone 14 Pro",
      description: "Smartphone Apple avec écran Dynamic Island",
      stock: 25,
      price: 1299.99,
      images: [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop"
      ]
    },
    {
      id: 2,
      title: "MacBook Air M2",
      description: "Ordinateur portable ultra-fin avec puce M2",
      stock: 12,
      price: 1499.99,
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop"
      ]
    },
     {
      id: 1,
      title: "iPhone 14 Pro",
      description: "Smartphone Apple avec écran Dynamic Island",
      stock: 25,
      price: 1299.99,
      images: [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop"
      ]
    },
    {
      id: 2,
      title: "MacBook Air M2",
      description: "Ordinateur portable ultra-fin avec puce M2",
      stock: 12,
      price: 1499.99,
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop"
      ]
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    setShowDeleteModal(false);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleViewImages = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: products.length + 1,
      title: `Nouveau Produit ${products.length + 1}`,
      description: "Description du nouveau produit",
      stock: 0,
      price: 0,
      images: []
    };
    setProducts([...products, newProduct]);
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
          <p>{products.filter((p) => p.stock > 0).length}</p>
        </div>

        <div className="stat-box">
          <h3>Rupture</h3>
          <p>{products.filter((p) => p.stock === 0).length}</p>
        </div>

        <div className="stat-box">
          <h3>Valeur du stock</h3>
          <p>
            {products
              .reduce((t, p) => t + p.price * p.stock, 0)
              .toFixed(2)}{" "}
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
              <tr key={product.id}>
                <td>{product.title}</td>
                <td className="desc">{product.description}</td>
                <td>
                  <span
                    className={`status ${
                      product.stock > 10
                        ? "active"
                        : product.stock > 0
                        ? "warning"
                        : "blocked"
                    }`}
                  >
                    {product.stock} unités
                  </span>
                </td>
                <td>{product.price.toFixed(2)} €</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => handleViewImages(product)}
                  >
                    <FaEye />
                  </button>
                </td>
                <td>
                  <button className="btn-edit">
                    <FaEdit  size={16} color="#A0522D"/>
                  </button>
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
                  <img key={index} src={img} alt="" />
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
              <strong>{productToDelete?.title}</strong> ?
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
                onClick={() => handleDelete(productToDelete.id)}
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
