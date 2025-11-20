import axios from '../config/axios';

const reviewService = {
  // 📌 Récupérer toutes les reviews
  AllReviews: async () => {
    const res = await axios.get('/admin/reviews');
    console.log("hello res",res.data.data);
    return res.data.data;
  },

  // Supprimer une review par productId et reviewId
  deleteReview: async (productId, reviewId) => {
    const res = await axios.delete(`/admin/reviews/${productId}/${reviewId}`);
    return res.data;
  },
};

export default reviewService;
