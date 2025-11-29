import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Met à jour toutes les reviews (fetch)
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },

    // Supprime une review localement (id de review)
    removeReview: (state, action) => {
      state.reviews = state.reviews.filter((rev) => rev._id !== action.payload);
    },

    // Gestion du loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Gestion des erreurs
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export des actions pour les dispatcher
export const { setReviews, removeReview, setLoading, setError } = reviewSlice.actions;

// Export du reducer pour le store
export default reviewSlice.reducer;
