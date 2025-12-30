import { configureStore } from "@reduxjs/toolkit";
import productReducer, {
  fetchCategories,
  fetchProducts,
  createProduct,
  fetchAllProducts,
  deleteproduct,
} from "../../features/productSlice";
import axios from "../../config/axios";

jest.mock("../../config/axios");

describe("productSlice - additional coverage", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe("fetchCategories", () => {
    test("should fetch categories successfully", async () => {
      const mockCategories = { data: [{ _id: "1", name: "Electronics" }] };
      axios.get.mockResolvedValue({ data: mockCategories });

      await store.dispatch(fetchCategories());

      const state = store.getState().products;
      expect(state.categories).toEqual(mockCategories.data);
      expect(axios.get).toHaveBeenCalledWith("/categories");
    });

    test("should handle fetchCategories error", async () => {
      const error = new Error("Network error");
      error.response = { status: 500, data: { message: "Server error" } };
      axios.get.mockRejectedValue(error);

      await store.dispatch(fetchCategories());

      const state = store.getState().products;
      expect(state.error).toBeDefined();
    });
  });

  describe("fetchProducts", () => {
    test("should fetch seller products successfully", async () => {
      const mockProducts = { data: [{ _id: "1", title: "Product 1" }] };
      axios.get.mockResolvedValue({ data: mockProducts });

      await store.dispatch(fetchProducts());

      expect(axios.get).toHaveBeenCalledWith("/seller/products");
    });

    test("should handle fetchProducts error with response", async () => {
      const error = new Error("Unauthorized");
      error.response = { status: 401, data: { message: "Unauthorized" } };
      axios.get.mockRejectedValue(error);

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.error).toBeDefined();
    });
  });

  describe("createProduct", () => {
    test("should create product successfully", async () => {
      const mockProduct = { _id: "new1", title: "New Product" };
      const productData = { title: "New Product", price: 99.99 };
      axios.post.mockResolvedValue({ data: mockProduct });

      await store.dispatch(createProduct(productData));

      expect(axios.post).toHaveBeenCalledWith("/products/create", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });

    test("should handle createProduct error", async () => {
      const error = new Error("Validation error");
      error.response = { status: 400, data: { message: "Invalid data" } };
      axios.post.mockRejectedValue(error);

      await store.dispatch(createProduct({}));

      const state = store.getState().products;
      expect(state.error).toBeDefined();
    });
  });

  describe("fetchAllProducts", () => {
    test("should fetch all products with pagination", async () => {
      const mockResponse = {
        data: [{ _id: "1", title: "Product 1" }],
        pagination: {
          currentPage: 1,
          totalPages: 5,
          totalProducts: 50,
          limit: 10,
        },
      };
      axios.get.mockResolvedValue({ data: mockResponse });

      await store.dispatch(fetchAllProducts({ page: 1, limit: 10 }));

      expect(axios.get).toHaveBeenCalledWith("/products?page=1&limit=10");
      const state = store.getState().products;
      expect(state.currentPage).toBe(1);
      expect(state.totalPages).toBe(5);
    });

    test("should use default pagination values", async () => {
      const mockResponse = {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          limit: 10,
        },
      };
      axios.get.mockResolvedValue({ data: mockResponse });

      await store.dispatch(fetchAllProducts({}));

      expect(axios.get).toHaveBeenCalledWith("/products?page=1&limit=10");
    });

    test("should handle fetchAllProducts error with response data", async () => {
      const error = { response: { data: { message: "Failed" } } };
      axios.get.mockRejectedValue(error);

      await store.dispatch(fetchAllProducts({ page: 1, limit: 10 }));

      const state = store.getState().products;
      expect(state.error).toBeDefined();
    });

    test("should handle fetchAllProducts error without response", async () => {
      const error = new Error("Network error");
      axios.get.mockRejectedValue(error);

      await store.dispatch(fetchAllProducts({ page: 1, limit: 10 }));

      const state = store.getState().products;
      expect(state.error).toBe("Network error");
    });
  });

  describe("deleteproduct", () => {
    beforeEach(() => {
      const initialState = {
        products: [
          { _id: "1", title: "Product 1" },
          { _id: "2", title: "Product 2" },
        ],
        categories: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        limit: 10,
      };
      store = configureStore({
        reducer: {
          products: productReducer,
        },
        preloadedState: {
          products: initialState,
        },
      });
    });

    test("should delete product successfully", async () => {
      axios.delete.mockResolvedValue({});

      await store.dispatch(deleteproduct("1"));

      const state = store.getState().products;
      expect(state.products).toHaveLength(1);
      expect(state.products[0]._id).toBe("2");
    });

    test("should handle delete error with response", async () => {
      const error = { response: { data: { message: "Cannot delete" } } };
      axios.delete.mockRejectedValue(error);

      await store.dispatch(deleteproduct("1"));

      const state = store.getState().products;
      expect(state.products).toHaveLength(2);
    });

    test("should handle delete error without response", async () => {
      const error = new Error("Network error");
      axios.delete.mockRejectedValue(error);

      await store.dispatch(deleteproduct("1"));

      const state = store.getState().products;
      expect(state.products).toHaveLength(2);
    });
  });

  describe("loading states", () => {
    test("should set loading true during fetchAllProducts pending", () => {
      const action = { type: fetchAllProducts.pending.type };
      const state = productReducer(undefined, action);
      expect(state.loading).toBe(true);
    });

    test("should set loading false after fetchAllProducts fulfilled", async () => {
      const mockResponse = {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          limit: 10,
        },
      };
      axios.get.mockResolvedValue({ data: mockResponse });

      await store.dispatch(fetchAllProducts({}));

      const state = store.getState().products;
      expect(state.loading).toBe(false);
    });

    test("should set loading false after fetchAllProducts rejected", async () => {
      axios.get.mockRejectedValue(new Error("Error"));

      await store.dispatch(fetchAllProducts({}));

      const state = store.getState().products;
      expect(state.loading).toBe(false);
    });
  });
});
