import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerService } from "../../../service/sellerService";

export const useSellerData = (productPage, orderPage, orderStatus) => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["seller-products", productPage],
    queryFn: () => sellerService.getProducts({ page: productPage, limit: 12 }),
  });

  const statsQuery = useQuery({
    queryKey: ["seller-stats"],
    queryFn: sellerService.getStats,
  });

  const ordersQuery = useQuery({
    queryKey: ["seller-orders", orderPage, orderStatus],
    queryFn: () => sellerService.getOrders({ page: orderPage, limit: 10, status: orderStatus }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: sellerService.updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["seller-orders"]);
      queryClient.invalidateQueries(["seller-stats"]);
    },
  });

  return {
    products: productsQuery.data?.data ?? [],
    productPagination: productsQuery.data?.pagination ?? {},
    isLoadingProducts: productsQuery.isLoading,
    productsError: productsQuery.error,
    
    stats: statsQuery.data,
    
    orders: ordersQuery.data?.data ?? [],
    orderPagination: ordersQuery.data?.pagination ?? {},
    
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isLoading,
  };
};
