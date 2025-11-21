import React, { useState } from "react";
import { FaCheck, FaEye, FaTrash } from "react-icons/fa";
import "../../assets/styles/admin/UserList.css"; // tu gardes le même style
import Pagination from "../../components/Pagination";
import { useReviews } from "../../hooks/useReviews";




const Reviews = () => {

  const { reviews, isLoading, deleteReview } = useReviews();
  console.log("revis compo",reviews)
  const [showFull, setShowFull] = useState(null);

  const handleDelete = (productId, reviewId) => {
    console.log("prot",productId);
    console.group("review",reviewId)
    deleteReview.mutate({ productId, reviewId });
  };

  if (isLoading) return <p>Chargement...</p>;

  // console.log("reviews", reviews[0]);

  return (
    <div className="user-list">
      <h2>Modération des Avis</h2>
      <p>Gérez les avis signalés et assurez la qualité du contenu</p>

      {/* === STATS === */}
      <div className="stat-user">
        <div className="stat-item">
          <h3>Avis Signalés</h3>
          <p>3</p>
        </div>
        <div className="stat-item">
          <h3>Total Signalements</h3>
          <p>10</p>
        </div>
        <div className="stat-item">
          <h3>Traités Aujourd'hui</h3>
          <p>1</p>
        </div>
      </div>

      {/* === TABLEAU === */}
      <div className="users-table-container">
        <table className="categories-table">
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

                <td> { review ?  review.user.fullName : "Utilisateur inconnu"}</td>

                <td>{review.productTitle}</td>
                <td>{review.rating} ⭐</td>
                 <td>
        {showFull ? review.comment : review.comment.slice(0, 30) + "... "}
        {review.comment.length > 30 && (
          <span
            style={{ color: "  #5b3d29;", cursor: "pointer", fontWeight: "600" }}
            onClick={() => setShowFull(!showFull)}
          >
            {showFull ? "Voir moins" : "Voir more"}
          </span>
        )}
      </td>
              
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>

                <td style={{ display: "flex", gap: "8px" }}>
                  
                <button className="btn-delete" onClick={() => handleDelete(review.productId, review._id)}>
  <FaTrash color="#5b3d29" />
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default Reviews;
