import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "../../assets/styles/admin/UserList.css";
import Pagination from "../../components/Pagination";
import { useReviews } from "../../hooks/useReview";

const Reviews = () => {
  const {
    reviews,
    isLoading,
    deleteReview,
    totalPages,
    currentPage,
    setPage,
  } = useReviews();

  const [showFull, setShowFull] = useState({});

  const handleDelete = (productId, reviewId) => {
    deleteReview.mutate({ productId, reviewId });
  };

  const toggleShowFull = (reviewId) => {
    setShowFull(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="user-list">
      <h2>Modération des Avis</h2>
      <p>Gérez les avis  et assurez la qualité du contenu</p>

      {/* === TABLEAU === */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Auteur</th>
              <th>Produit</th>
              <th>Note</th>
              <th>Commentaire</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review?.user?.fullName || "Utilisateur inconnu"}</td>
                <td>{review.productTitle || "Produit inconnu"}</td>
                <td>{review.rating} ⭐</td>
                <td>
                  {showFull[review._id] 
                    ? review.comment 
                    : review.comment?.slice(0, 30) + (review.comment?.length > 30 ? "..." : "")
                  }
                  {review.comment?.length > 30 && (
                    <span
                      style={{ color: "#5b3d29", cursor: "pointer", fontWeight: "600", marginLeft: "5px" }}
                      onClick={() => toggleShowFull(review._id)}
                    >
                      {showFull[review._id] ? "Voir moins" : "Voir plus"}
                    </span>
                  )}
                </td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(review.productId, review._id)}
                  >
                    <FaTrash color="#FF6F61" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Pagination === */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        hasNext={currentPage < totalPages}
        hasPrev={currentPage > 1}
      />
    </div>
  );
};

export default Reviews;