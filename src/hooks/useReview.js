import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import reviewService from "../service/reviewService.js";

export const useReviews = (initialPage = 1, limit = 5) => {
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  // === Fetch reviews avec pagination ===
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", page],
    queryFn: () => reviewService.AllReviews(page, limit),
    keepPreviousData: true,
  });

  // === Mutation pour supprimer une review ===
  const deleteReview = useMutation({
    mutationFn: ({ productId, reviewId }) => reviewService.deleteReview(productId, reviewId),
    onSuccess: () => {
      // Recharger les reviews après suppression
      queryClient.invalidateQueries({ queryKey: ["reviews", page] });
    },
  });

  return {
    reviews: data?.data || [],
    totalPages: data?.pagination?.totalPages || 1,
    currentPage: data?.pagination?.currentPage || 1,
    limit: data?.pagination?.limit || limit,
    isLoading,
    isError,
    deleteReview,
    page,
    setPage,
  };
};
