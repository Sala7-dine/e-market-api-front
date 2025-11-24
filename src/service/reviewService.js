import axios from '../config/axios';

const reviewService = {
  // Récupérer toutes les reviews with pagination
  AllReviews: async (page = 1, limit = 5) => {
    const res = await axios.get(`/admin/reviews?page=${page}&limit=${limit}`);
    console.log("res",res)
    return res.data; // { success, data, pagination }
  },

  // remove une review
  deleteReview: async (productId, reviewId) => {
    const res = await axios.delete(`/admin/reviews/${productId}/${reviewId}`);
    return res.data;
  },
};

export default reviewService;
