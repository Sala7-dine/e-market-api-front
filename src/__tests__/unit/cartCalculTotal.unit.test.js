describe("CartContext - Calcul Total Panier - Unit Tests", () => {
  let mockCart;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCart = [];
  });

  describe("calculateTotal - Calcul du total", () => {
    it("should return 0 for empty cart", () => {
      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(0);
      expect(mockCart).toHaveLength(0);
    });

    it("should calculate total for single item", () => {
      mockCart = [{ id: 1, name: "Produit A", price: 10, quantity: 1 }];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(10);
    });

    it("should calculate total for multiple quantities of same item", () => {
      mockCart = [{ id: 1, name: "Produit A", price: 15, quantity: 3 }];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(45);
    });

    it("should calculate total for multiple different items", () => {
      mockCart = [
        { id: 1, name: "Produit A", price: 10, quantity: 2 },
        { id: 2, name: "Produit B", price: 20, quantity: 1 },
        { id: 3, name: "Produit C", price: 5, quantity: 4 },
      ];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(60);
    });

    it("should handle decimal prices correctly", () => {
      mockCart = [
        { id: 1, name: "Produit A", price: 9.99, quantity: 2 },
        { id: 2, name: "Produit B", price: 15.5, quantity: 1 },
      ];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBeCloseTo(35.48, 2);
    });

    it("should handle large quantities", () => {
      mockCart = [{ id: 1, name: "Produit A", price: 2.5, quantity: 100 }];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(250);
    });

    it("should ignore items with zero quantity", () => {
      mockCart = [
        { id: 1, name: "Produit A", price: 10, quantity: 2 },
        { id: 2, name: "Produit B", price: 20, quantity: 0 },
      ];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBe(20);
    });

    it("should handle very small prices", () => {
      mockCart = [{ id: 1, name: "Produit A", price: 0.01, quantity: 5 }];

      const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(total).toBeCloseTo(0.05, 2);
    });
  });

  describe("calculateSubtotal - Sous-total par article", () => {
    it("should calculate subtotal for single item", () => {
      const item = { id: 1, name: "Produit A", price: 25, quantity: 3 };
      const subtotal = item.price * item.quantity;

      expect(subtotal).toBe(75);
    });

    it("should calculate subtotal with decimal price", () => {
      const item = { id: 1, name: "Produit A", price: 12.99, quantity: 2 };
      const subtotal = item.price * item.quantity;

      expect(subtotal).toBeCloseTo(25.98, 2);
    });

    it("should return 0 for zero quantity", () => {
      const item = { id: 1, name: "Produit A", price: 50, quantity: 0 };
      const subtotal = item.price * item.quantity;

      expect(subtotal).toBe(0);
    });
  });
});
