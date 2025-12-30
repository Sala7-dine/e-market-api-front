import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {
  addToCart,
  removeFromCart,
  updateProductQuantity,
  getCart,
  clearCart,
} from "../../features/cartSlice";
import axios from "../../config/axios";

jest.mock("../../config/axios");
const mockedAxios = axios;

describe("cartSlice Unit Tests", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { cart: cartReducer },
    });
    jest.clearAllMocks();
  });

  describe("addToCart thunk", () => {
    test("should handle successful add to cart", async () => {
      const mockResponse = {
        data: {
          items: [{ productId: "123", quantity: 2 }],
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await store.dispatch(addToCart({ productId: "123", quantity: 2 }));

      expect(result.type).toBe("cart/addToCart/fulfilled");
      expect(mockedAxios.post).toHaveBeenCalledWith("/carts/addtocart", {
        productId: "123",
        quantity: 2,
      });
    });

    test("should handle add to cart error", async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: "Product not found" } },
      });

      const result = await store.dispatch(addToCart({ productId: "invalid", quantity: 1 }));

      expect(result.type).toBe("cart/addToCart/rejected");
    });
  });

  describe("removeFromCart thunk", () => {
    test("should handle successful remove from cart", async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

      const result = await store.dispatch(removeFromCart({ productId: "123" }));

      expect(result.type).toBe("cart/removeFromCart/fulfilled");
      expect(mockedAxios.delete).toHaveBeenCalledWith("carts/deleteProduct/123");
    });
  });

  describe("updateProductQuantity thunk", () => {
    test("should handle successful quantity update", async () => {
      mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });

      const result = await store.dispatch(updateProductQuantity({ productId: "123", quantity: 5 }));

      expect(result.type).toBe("cart/updateProductQuantity/fulfilled");
      expect(mockedAxios.put).toHaveBeenCalledWith("carts/updateCart/123", {
        quantity: 5,
      });
    });
  });

  describe("getCart thunk", () => {
    test("should handle successful get cart", async () => {
      const mockCart = {
        data: {
          data: [
            {
              _id: "cart123",
              items: [{ productId: "prod1", quantity: 2 }],
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockCart);

      const result = await store.dispatch(getCart());

      expect(result.type).toBe("cart/getCart/fulfilled");
      expect(mockedAxios.get).toHaveBeenCalledWith("/carts/getcarts");
    });
  });

  describe("clearCart action", () => {
    test("should clear cart state", () => {
      store.dispatch(clearCart());
      const state = store.getState().cart;
      expect(state.cart).toEqual([]);
    });
  });
});
