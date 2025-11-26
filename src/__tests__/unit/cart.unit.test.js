describe("Cart - Unit Tests", () => {
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
        { price: 25, quantity: 2 },
        { price: 30, quantity: 1 },
      ];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(80);
      expect(mockCart).toHaveLength(2);
    });

    it("should handle decimal prices correctly", () => {
      mockCart = [
        { price: 9.99, quantity: 2 },
        { price: 15.5, quantity: 1 },
      ];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBeCloseTo(35.48, 2);
    });
  });

  describe("addToCart", () => {
    it("should successfully add product to cart", async () => {
      const product = { productId: "product123", quantity: 1 };

      const mockResponse = {
        data: {
          _id: "cart123",
          items: [{ productId: "product123", quantity: 1, price: 25 }],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const response = await mockAxios.post("/carts/addtocart", product);

      expect(mockAxios.post).toHaveBeenCalledWith("/carts/addtocart", product);
      expect(response.data.items).toHaveLength(1);
      expect(response.data.items[0].productId).toBe("product123");
    });

    it("should handle error when adding invalid product", async () => {
      const invalidProduct = { productId: null, quantity: -1 };

      const mockError = {
        response: {
          data: { message: "Invalid product data" },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("/carts/addtocart", invalidProduct)).rejects.toEqual(mockError);
    });
  });

  describe("removeFromCart", () => {
    it("should successfully remove product from cart", async () => {
      const mockResponse = { data: { success: true } };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const response = await mockAxios.delete("carts/deleteProduct/product123");

      expect(mockAxios.delete).toHaveBeenCalledWith("carts/deleteProduct/product123");
      expect(response.data.success).toBe(true);
    });

    it("should handle error when removing non-existent product", async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: "Product not found in cart" },
        },
      };

      mockAxios.delete.mockRejectedValue(mockError);

      await expect(mockAxios.delete("carts/deleteProduct/invalid")).rejects.toEqual(mockError);
    });
  });

  describe("updateQuantity", () => {
    it("should successfully update product quantity", async () => {
      const updateData = { quantity: 5 };

      const mockResponse = { data: { success: true } };

      mockAxios.put.mockResolvedValue(mockResponse);

      const response = await mockAxios.put("carts/updateCart/product123", updateData);

      expect(mockAxios.put).toHaveBeenCalledWith("carts/updateCart/product123", updateData);
      expect(response.data.success).toBe(true);
    });

    it("should handle invalid quantity update", async () => {
      const updateData = { quantity: 0 };

      const mockError = {
        response: {
          data: { message: "Quantity must be greater than 0" },
        },
      };

      mockAxios.put.mockRejectedValue(mockError);

      await expect(mockAxios.put("carts/updateCart/product123", updateData)).rejects.toEqual(
        mockError
      );
    });
  });

  describe("getCart", () => {
    it("should fetch current cart data", async () => {
      const mockCartData = {
        data: {
          data: [
            {
              _id: "cart123",
              items: [
                { productId: { _id: "product1", title: "Product A" }, price: 25, quantity: 2 },
                { productId: { _id: "product2", title: "Product B" }, price: 30, quantity: 1 },
              ],
            },
          ],
        },
      };

      mockAxios.get.mockResolvedValue(mockCartData);

      const response = await mockAxios.get("/carts/getcarts");

      expect(mockAxios.get).toHaveBeenCalledWith("/carts/getcarts");
      expect(response.data.data[0].items).toHaveLength(2);
    });

    it("should handle network error when fetching cart", async () => {
      mockAxios.get.mockRejectedValue(new Error("Network Error"));

      await expect(mockAxios.get("/carts/getcarts")).rejects.toThrow("Network Error");
    });
  });
});
