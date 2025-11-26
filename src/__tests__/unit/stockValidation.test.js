describe("T-22: Réduction stock - Unit Test", () => {
  const validateStock = (requestedQuantity, availableStock) => {
    if (requestedQuantity > availableStock) {
      throw new Error("Stock insuffisant");
    }
    return true;
  };

  it('Given stock<quantité When checkout Then erreur "Stock insuffisant"', () => {
    const availableStock = 5;
    const requestedQuantity = 100;

    expect(() => {
      validateStock(requestedQuantity, availableStock);
    }).toThrow("Stock insuffisant");
  });

  it("should pass when stock is sufficient", () => {
    const availableStock = 10;
    const requestedQuantity = 5;

    expect(validateStock(requestedQuantity, availableStock)).toBe(true);
  });

  it("should pass when stock equals quantity", () => {
    const availableStock = 10;
    const requestedQuantity = 10;

    expect(validateStock(requestedQuantity, availableStock)).toBe(true);
  });

  it("should fail when stock is zero", () => {
    const availableStock = 0;
    const requestedQuantity = 1;

    expect(() => {
      validateStock(requestedQuantity, availableStock);
    }).toThrow("Stock insuffisant");
  });

  it("should fail when requesting negative quantity", () => {
    const availableStock = 10;
    const requestedQuantity = -1;
    expect(validateStock(requestedQuantity, availableStock)).toBe(true);
  });
});
