import { configureStore } from "@reduxjs/toolkit";
import categoryReducer, {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../features/categorySlice";
import categoryService from "../../service/categoryService";

jest.mock("../../service/categoryService");

describe("categorySlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        categories: categoryReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    test("should have correct initial state", () => {
      const state = store.getState().categories;
      expect(state).toEqual({
        categories: [],
        loading: false,
        error: null,
      });
    });
  });

  describe("fetchCategories", () => {
    test("should fetch categories successfully", async () => {
      const mockCategories = [
        { _id: "1", name: "Electronics" },
        { _id: "2", name: "Clothing" },
      ];
      categoryService.getAllCategories.mockResolvedValue(mockCategories);

      await store.dispatch(fetchCategories());

      const state = store.getState().categories;
      expect(state.categories).toEqual(mockCategories);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    test("should handle fetchCategories pending state", () => {
      const action = { type: fetchCategories.pending.type };
      const state = categoryReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    test("should handle fetchCategories rejected state", async () => {
      const errorMessage = "Failed to fetch categories";
      categoryService.getAllCategories.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(fetchCategories());

      const state = store.getState().categories;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test("should handle fetchCategories error without response", async () => {
      const error = new Error("Network error");
      categoryService.getAllCategories.mockRejectedValue(error);

      await store.dispatch(fetchCategories());

      const state = store.getState().categories;
      expect(state.error).toBe("Network error");
    });
  });

  describe("createCategory", () => {
    test("should create category successfully", async () => {
      const newCategory = { _id: "3", name: "Books" };
      categoryService.createCategory.mockResolvedValue(newCategory);

      await store.dispatch(createCategory({ name: "Books" }));

      const state = store.getState().categories;
      expect(state.categories).toContainEqual(newCategory);
    });

    test("should handle createCategory rejection", async () => {
      const errorMessage = "Failed to create category";
      categoryService.createCategory.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(createCategory({ name: "Invalid" }));

      const state = store.getState().categories;
      expect(state.error).toBe(errorMessage);
    });

    test("should handle createCategory error without response", async () => {
      const error = new Error("Network error");
      categoryService.createCategory.mockRejectedValue(error);

      await store.dispatch(createCategory({ name: "Test" }));

      const state = store.getState().categories;
      expect(state.error).toBe("Network error");
    });
  });

  describe("updateCategory", () => {
    beforeEach(() => {
      const initialState = {
        categories: [
          { _id: "1", name: "Electronics" },
          { _id: "2", name: "Clothing" },
        ],
        loading: false,
        error: null,
      };
      store = configureStore({
        reducer: {
          categories: categoryReducer,
        },
        preloadedState: {
          categories: initialState,
        },
      });
    });

    test("should update category successfully", async () => {
      const updatedCategory = { _id: "1", name: "Electronics Updated" };
      categoryService.updateCategory.mockResolvedValue(updatedCategory);

      await store.dispatch(updateCategory({ id: "1", data: { name: "Electronics Updated" } }));

      const state = store.getState().categories;
      expect(state.categories[0]).toEqual(updatedCategory);
    });

    test("should handle updateCategory rejection", async () => {
      const errorMessage = "Failed to update category";
      categoryService.updateCategory.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(updateCategory({ id: "1", data: { name: "Updated" } }));

      const state = store.getState().categories;
      expect(state.error).toBe(errorMessage);
    });

    test("should handle updateCategory error without response", async () => {
      const error = new Error("Network error");
      categoryService.updateCategory.mockRejectedValue(error);

      await store.dispatch(updateCategory({ id: "1", data: { name: "Updated" } }));

      const state = store.getState().categories;
      expect(state.error).toBe("Network error");
    });

    test("should not update if category not found", async () => {
      const updatedCategory = { _id: "999", name: "Non-existent" };
      categoryService.updateCategory.mockResolvedValue(updatedCategory);

      await store.dispatch(updateCategory({ id: "999", data: { name: "Non-existent" } }));

      const state = store.getState().categories;
      expect(state.categories.length).toBe(2);
    });
  });

  describe("deleteCategory", () => {
    beforeEach(() => {
      const initialState = {
        categories: [
          { _id: "1", name: "Electronics" },
          { _id: "2", name: "Clothing" },
        ],
        loading: false,
        error: null,
      };
      store = configureStore({
        reducer: {
          categories: categoryReducer,
        },
        preloadedState: {
          categories: initialState,
        },
      });
    });

    test("should delete category successfully", async () => {
      categoryService.deleteCategory.mockResolvedValue();

      await store.dispatch(deleteCategory("1"));

      const state = store.getState().categories;
      expect(state.categories).toHaveLength(1);
      expect(state.categories[0]._id).toBe("2");
    });

    test("should handle deleteCategory rejection", async () => {
      const errorMessage = "Failed to delete category";
      categoryService.deleteCategory.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(deleteCategory("1"));

      const state = store.getState().categories;
      expect(state.error).toBe(errorMessage);
      expect(state.categories).toHaveLength(2);
    });

    test("should handle deleteCategory error without response", async () => {
      const error = new Error("Network error");
      categoryService.deleteCategory.mockRejectedValue(error);

      await store.dispatch(deleteCategory("1"));

      const state = store.getState().categories;
      expect(state.error).toBe("Network error");
    });
  });
});
