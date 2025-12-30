import { configureStore } from "@reduxjs/toolkit";
import orderReducer, {
  createOrder,
  getUserOrders,
  clearCurrentOrder,
} from "../../features/orderSlice";
import axios from "../../config/axios";

jest.mock("../../config/axios");

describe("orderSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    test("should have correct initial state", () => {
      const state = store.getState().order;
      expect(state).toEqual({
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        totalItems: 0,
      });
    });
  });

  describe("clearCurrentOrder", () => {
    test("should clear current order", () => {
      const stateWithOrder = {
        orders: [],
        currentOrder: { _id: "123", total: 100 },
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        totalItems: 0,
      };

      store = configureStore({
        reducer: {
          order: orderReducer,
        },
        preloadedState: {
          order: stateWithOrder,
        },
      });

      store.dispatch(clearCurrentOrder());

      const state = store.getState().order;
      expect(state.currentOrder).toBeNull();
    });
  });

  describe("createOrder", () => {
    test("should create order successfully with coupon", async () => {
      const mockOrder = {
        _id: "order123",
        total: 99.99,
        items: [],
        couponCode: "SAVE10",
      };

      axios.post.mockResolvedValue({ data: mockOrder });

      await store.dispatch(createOrder({ cartId: "cart123", couponCode: "SAVE10" }));

      const state = store.getState().order;
      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.orders).toContainEqual(mockOrder);
      expect(state.error).toBe(null);
      expect(axios.post).toHaveBeenCalledWith("/orders/addOrder/cart123", { couponCode: "SAVE10" });
    });

    test("should create order successfully without coupon", async () => {
      const mockOrder = {
        _id: "order456",
        total: 150.0,
        items: [],
      };

      axios.post.mockResolvedValue({ data: mockOrder });

      await store.dispatch(createOrder({ cartId: "cart456" }));

      const state = store.getState().order;
      expect(state.currentOrder).toEqual(mockOrder);
      expect(axios.post).toHaveBeenCalledWith("/orders/addOrder/cart456", {});
    });

    test("should handle createOrder pending state", () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    test("should handle createOrder rejection with response data", async () => {
      const errorData = { message: "Payment failed" };
      axios.post.mockRejectedValue({
        response: { data: errorData },
      });

      await store.dispatch(createOrder({ cartId: "cart123" }));

      const state = store.getState().order;
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(errorData);
      expect(state.currentOrder).toBeNull();
    });

    test("should handle createOrder rejection without response", async () => {
      const errorMessage = "Network error";
      axios.post.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(createOrder({ cartId: "cart123" }));

      const state = store.getState().order;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test("should add new order to beginning of orders array", async () => {
      const existingOrder = { _id: "old1", total: 50 };
      const newOrder = { _id: "new1", total: 100 };

      store = configureStore({
        reducer: {
          order: orderReducer,
        },
        preloadedState: {
          order: {
            orders: [existingOrder],
            currentOrder: null,
            loading: false,
            error: null,
            page: 1,
            totalPages: 1,
            totalItems: 1,
          },
        },
      });

      axios.post.mockResolvedValue({ data: newOrder });

      await store.dispatch(createOrder({ cartId: "cart123" }));

      const state = store.getState().order;
      expect(state.orders[0]).toEqual(newOrder);
      expect(state.orders[1]).toEqual(existingOrder);
    });
  });

  describe("getUserOrders", () => {
    test("should fetch user orders successfully", async () => {
      const mockResponse = {
        orders: [
          { _id: "1", total: 100 },
          { _id: "2", total: 200 },
        ],
        page: 1,
        totalPages: 3,
        totalItems: 15,
      };

      axios.get.mockResolvedValue({ data: mockResponse });

      await store.dispatch(getUserOrders({ page: 1, limit: 5 }));

      const state = store.getState().order;
      expect(state.orders).toEqual(mockResponse.orders);
      expect(state.page).toBe(1);
      expect(state.totalPages).toBe(3);
      expect(state.totalItems).toBe(15);
      expect(axios.get).toHaveBeenCalledWith("/orders/getOrder?page=1&limit=5");
    });

    test("should use default pagination values", async () => {
      const mockResponse = {
        orders: [],
        page: 1,
        totalPages: 1,
        totalItems: 0,
      };

      axios.get.mockResolvedValue({ data: mockResponse });

      await store.dispatch(getUserOrders({}));

      expect(axios.get).toHaveBeenCalledWith("/orders/getOrder?page=1&limit=5");
    });

    test("should handle getUserOrders with different page", async () => {
      const mockResponse = {
        orders: [{ _id: "3", total: 300 }],
        page: 2,
        totalPages: 3,
        totalItems: 15,
      };

      axios.get.mockResolvedValue({ data: mockResponse });

      await store.dispatch(getUserOrders({ page: 2, limit: 10 }));

      const state = store.getState().order;
      expect(state.page).toBe(2);
      expect(axios.get).toHaveBeenCalledWith("/orders/getOrder?page=2&limit=10");
    });

    test("should handle getUserOrders rejection with response data", async () => {
      const errorData = { message: "Failed to fetch orders" };
      axios.get.mockRejectedValue({
        response: { data: errorData },
      });

      await store.dispatch(getUserOrders({ page: 1, limit: 5 }));

      const state = store.getState().order;
      expect(state.orders).toEqual([]);
    });

    test("should handle getUserOrders rejection without response", async () => {
      const errorMessage = "Network error";
      axios.get.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(getUserOrders({ page: 1, limit: 5 }));

      const state = store.getState().order;
      expect(state.orders).toEqual([]);
    });
  });
});
