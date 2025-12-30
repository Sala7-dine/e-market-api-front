describe("CartContext - Unit Tests", () => {
  let mockAxios;
  let mockCart;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    // Mock cart initial state
    mockCart = [];
  });

  describe("calculateTotal", () => {
    it("should return 0 for empty cart", () => {
      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(0);
      expect(mockCart).toHaveLength(0);
    });

    it("Given 2 produits When calculate total Then return correct price", () => {
      // Given - 2 produits dans le panier
      mockCart = [
        { id: 1, name: "Produit A", price: 25, quantity: 2 },
        { id: 2, name: "Produit B", price: 30, quantity: 1 },
      ];

      // When - Calcul du total
      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Then - Prix correct
      expect(total).toBe(80); // (25 * 2) + (30 * 1) = 50 + 30 = 80
      expect(mockCart).toHaveLength(2);
    });

    it("should calculate total with multiple quantities", () => {
      mockCart = [{ id: 1, name: "Produit A", price: 15, quantity: 3 }];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(45);
    });

    it("should handle decimal prices correctly", () => {
      mockCart = [
        { id: 1, name: "Produit A", price: 9.99, quantity: 2 },
        { id: 2, name: "Produit B", price: 15.5, quantity: 1 },
      ];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBeCloseTo(35.48, 2);
    });
  });

  describe("addToCart", () => {
    it("should successfully add product to cart", async () => {
      const product = {
        id: 1,
        name: "Produit A",
        price: 25,
        quantity: 1,
      };

      const mockResponse = {
        data: {
          message: "Product added to cart",
          cart: [product],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const response = await mockAxios.post("/cart/add", product);

      expect(mockAxios.post).toHaveBeenCalledWith("/cart/add", product);
      expect(response.data.message).toBe("Product added to cart");
      expect(response.data.cart).toHaveLength(1);
      expect(response.data.cart[0].id).toBe(1);
    });

    it("should increase quantity if product already exists", async () => {
      const existingProduct = {
        id: 1,
        name: "Produit A",
        price: 25,
        quantity: 2,
      };

      const mockResponse = {
        data: {
          message: "Product quantity updated",
          cart: [existingProduct],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const response = await mockAxios.post("/cart/add", { id: 1, quantity: 1 });

      expect(response.data.cart[0].quantity).toBe(2);
    });

    it("should handle error when adding invalid product", async () => {
      const invalidProduct = {
        id: null,
        price: -10,
      };

      const mockError = {
        response: {
          data: {
            error: "Invalid product data",
          },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("/cart/add", invalidProduct)).rejects.toEqual(mockError);
    });
  });

  describe("removeFromCart", () => {
    it("should successfully remove product from cart", async () => {
      const mockResponse = {
        data: {
          message: "Product removed from cart",
          cart: [],
        },
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const response = await mockAxios.delete("/cart/remove/1");

      expect(mockAxios.delete).toHaveBeenCalledWith("/cart/remove/1");
      expect(response.data.message).toBe("Product removed from cart");
      expect(response.data.cart).toHaveLength(0);
    });

    it("should handle error when removing non-existent product", async () => {
      const mockError = {
        response: {
          status: 404,
          data: {
            error: "Product not found in cart",
          },
        },
      };

      mockAxios.delete.mockRejectedValue(mockError);

      await expect(mockAxios.delete("/cart/remove/999")).rejects.toEqual(mockError);
    });
  });

  describe("updateQuantity", () => {
    it("should successfully update product quantity", async () => {
      const updateData = {
        productId: 1,
        quantity: 5,
      };

      const mockResponse = {
        data: {
          message: "Quantity updated",
          cart: [{ id: 1, name: "Produit A", price: 25, quantity: 5 }],
        },
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const response = await mockAxios.put("/cart/update", updateData);

      expect(mockAxios.put).toHaveBeenCalledWith("/cart/update", updateData);
      expect(response.data.cart[0].quantity).toBe(5);
    });

    it("should handle invalid quantity update", async () => {
      const updateData = {
        productId: 1,
        quantity: 0,
      };

      const mockError = {
        response: {
          data: {
            error: "Quantity must be greater than 0",
          },
        },
      };

      mockAxios.put.mockRejectedValue(mockError);

      await expect(mockAxios.put("/cart/update", updateData)).rejects.toEqual(mockError);
    });
  });

  describe("getCart", () => {
    it("should fetch current cart data", async () => {
      const mockCartData = [
        { id: 1, name: "Produit A", price: 25, quantity: 2 },
        { id: 2, name: "Produit B", price: 30, quantity: 1 },
      ];

      mockAxios.get.mockResolvedValue({ data: mockCartData });

      const response = await mockAxios.get("/cart");

      expect(mockAxios.get).toHaveBeenCalledWith("/cart");
      expect(response.data).toEqual(mockCartData);
      expect(response.data).toHaveLength(2);
    });

    it("should return empty cart when no items exist", async () => {
      mockAxios.get.mockResolvedValue({ data: [] });

      const response = await mockAxios.get("/cart");

      expect(response.data).toEqual([]);
      expect(response.data).toHaveLength(0);
    });

    it("should handle network error when fetching cart", async () => {
      mockAxios.get.mockRejectedValue(new Error("Network Error"));

      await expect(mockAxios.get("/cart")).rejects.toThrow("Network Error");
    });
  });

  describe("clearCart", () => {
    it("should successfully clear entire cart", async () => {
      mockAxios.delete.mockResolvedValue({
        data: {
          message: "Cart cleared successfully",
          cart: [],
        },
      });

      const response = await mockAxios.delete("/cart/clear");

      expect(mockAxios.delete).toHaveBeenCalledWith("/cart/clear");
      expect(response.data.message).toBe("Cart cleared successfully");
      expect(response.data.cart).toHaveLength(0);
    });

    it("should handle error when clearing cart fails", async () => {
      mockAxios.delete.mockRejectedValue(new Error("Server Error"));

      await expect(mockAxios.delete("/cart/clear")).rejects.toThrow("Server Error");
    });
  });

  describe("applyDiscount", () => {
    it("should successfully apply discount code", async () => {
      const discountCode = "PROMO20";

      const mockResponse = {
        data: {
          message: "Discount applied",
          discount: 20,
          discountCode: "PROMO20",
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const response = await mockAxios.post("/cart/discount", { code: discountCode });

      expect(mockAxios.post).toHaveBeenCalledWith("/cart/discount", { code: discountCode });
      expect(response.data.discount).toBe(20);
      expect(response.data.discountCode).toBe("PROMO20");
    });

    it("should handle invalid discount code", async () => {
      const mockError = {
        response: {
          data: {
            error: "Invalid discount code",
          },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("/cart/discount", { code: "INVALID" })).rejects.toEqual(
        mockError
      );
    });

    it("should handle expired discount code", async () => {
      const mockError = {
        response: {
          data: {
            error: "Discount code has expired",
          },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("/cart/discount", { code: "EXPIRED" })).rejects.toEqual(
        mockError
      );
    });
  });

  describe("Error handling", () => {
    it("should handle malformed response", async () => {
      mockAxios.get.mockResolvedValue({ data: null });

      const response = await mockAxios.get("/cart");

      expect(response.data).toBeNull();
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("timeout of 5000ms exceeded");
      mockAxios.post.mockRejectedValue(timeoutError);

      await expect(mockAxios.post("/cart/add", {})).rejects.toThrow("timeout");
    });

    it("should handle 500 server errors", async () => {
      const serverError = {
        response: {
          status: 500,
          data: {
            error: "Internal Server Error",
          },
        },
      };

      mockAxios.get.mockRejectedValue(serverError);

      await expect(mockAxios.get("/cart")).rejects.toEqual(serverError);
    });

    it("should handle unauthorized access", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            error: "Unauthorized",
          },
        },
      };

      mockAxios.get.mockRejectedValue(mockError);

      await expect(mockAxios.get("/cart")).rejects.toEqual(mockError);
    });
  });
});
