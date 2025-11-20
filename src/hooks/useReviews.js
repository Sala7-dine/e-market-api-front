import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../service/reviewService";
import { useDispatch } from "react-redux";
import { setReviews, removeReview } from "../features/reviewSlice";

export const useReviews = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Fetch toutes les reviews
  const reviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: reviewService.AllReviews,
    onSuccess: (data) => {
      dispatch(setReviews(data));
    },
  });

  // Supprimer une review
  const deleteReview = useMutation({
    mutationFn: ({ productId, reviewId }) =>
      reviewService.deleteReview(productId, reviewId),
    onSuccess: (_, { reviewId }) => {
      dispatch(removeReview(reviewId)); // supprime localement
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    deleteReview,
  };
};
