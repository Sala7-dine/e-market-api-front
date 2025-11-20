import React, { useState } from "react";
import { FaCheck, FaEye, FaTrash } from "react-icons/fa";
import "../../assets/styles/admin/UserList.css"; // tu gardes le même style
import Pagination from "../../components/Pagination";

const fakeReviews = [
  {
    _id: "1",
    user: "Aya B.",
    product: "Bouquet Roses",
    rating: 4,
    comment: "Très beau bouquet mais livraison un peu lente",
    reportsCount: 5,
    reason: "Spam / publicité",
    createdAt: "2025-11-10"
  },
  {
    _id: "2",
    user: "Imane C.",
    product: "Tulipes Jaunes",
    rating: 1,
    comment: "Fleurs fanées, très déçue",
    reportsCount: 3,
    reason: "Langage offensant",
    createdAt: "2025-11-12"
  },
  {
    _id: "3",
    user: "Salma A.",
    product: "Orchidée Blanche",
    rating: 5,
    comment: "Magnifique !!! ❤️",
    reportsCount: 2,
    reason: "Avis suspect",
    createdAt: "2025-11-19"
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(fakeReviews);
  const [currentPage, setCurrentPage] = useState(1);
    const [showFull, setShowFull] = useState(false);

  const handleApprove = (id) => {
    setReviews(reviews.filter((r) => r._id !== id));
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r._id !== id));
  };

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
                <td>{review.user}</td>
                <td>{review.product}</td>
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
                  
                  <button className="btn-delete"  styleonClick={() => handleDelete(review._id)}>
                    <FaTrash color="   #5b3d29;" />
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
