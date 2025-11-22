import axios from "../config/axios";

export const sellerService = {
  getProducts: async () => {
    const res = await axios.get("/seller/products");
    return res.data.data;
  },

  getStats: async () => {
    const res = await axios.get("/seller/stats");
    return res.data.data;
  },

  getOrders: async ({ page = 1, limit = 10, status = "" }) => {
    const params = { page, limit };
    if (status) params.status = status;
    const res = await axios.get("/seller/orders", { params });
    return res.data;
  },

  updateOrderStatus: async ({ orderId, status }) => {
    const res = await axios.put(`/orders/updateStatus/${orderId}`, { status });
    return res.data;
  },
};
