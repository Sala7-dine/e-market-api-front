export const calculateRevenueByMonth = (orders) => {
  const monthlyData = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", { month: "short" });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthName, revenue: 0 };
    }

    monthlyData[monthKey].revenue += order.orderTotal || 0;
  });

  return Object.values(monthlyData).slice(-6);
};

export const calculateBestSellers = (orders, productList) => {
  const productSales = {};

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const productId = item.productId?._id || item.productId;
      const productTitle = item.productId?.title || item.productName;

      if (!productSales[productId]) {
        productSales[productId] = {
          id: productId,
          title: productTitle,
          quantity: 0,
          revenue: 0,
        };
      }

      productSales[productId].quantity += item.quantity;
      productSales[productId].revenue += item.total || item.price * item.quantity;
    });
  });

  const salesWithImages = Object.values(productSales).map((sale) => {
    const product = productList.find((p) => (p._id || p.id) === sale.id);
    return {
      ...sale,
      images: product?.images || [],
    };
  });

  return salesWithImages.sort((a, b) => b.quantity - a.quantity).slice(0, 5);
};

export const getStatusColor = (status) => {
  const colors = {
    pending: "bg-[#FFF3EC] text-[#FF8A4D]",
    paid: "bg-[#E9F5FF] text-[#4B9EFF]",
    shipped: "bg-[#F6EFFE] text-[#9B6BFF]",
    delivered: "bg-[#ECFDF5] text-[#16A34A]",
    cancelled: "bg-[#FFEBEE] text-[#E53935]",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
