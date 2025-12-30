import { configureStore } from "@reduxjs/toolkit";
import reviewReducer, {
  setReviews,
  removeReview,
  setLoading,
  setError,
} from "../../features/reviewSlice";

describe("reviewSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        reviews: reviewReducer,
      },
    });
  });

  describe("initial state", () => {
    test("should have correct initial state", () => {
      const state = store.getState().reviews;
      expect(state).toEqual({
        reviews: [],
        loading: false,
        error: null,
      });
    });
  });

  describe("setReviews", () => {
    test("should set reviews", () => {
      const mockReviews = [
        { _id: "1", rating: 5, comment: "Great product" },
        { _id: "2", rating: 4, comment: "Good quality" },
      ];

      store.dispatch(setReviews(mockReviews));

      const state = store.getState().reviews;
      expect(state.reviews).toEqual(mockReviews);
    });

    test("should replace existing reviews", () => {
      const initialReviews = [{ _id: "1", rating: 3, comment: "OK" }];
      const newReviews = [{ _id: "2", rating: 5, comment: "Excellent" }];

      store.dispatch(setReviews(initialReviews));
      store.dispatch(setReviews(newReviews));

      const state = store.getState().reviews;
      expect(state.reviews).toEqual(newReviews);
      expect(state.reviews).toHaveLength(1);
    });

    test("should handle empty array", () => {
      store.dispatch(setReviews([]));

      const state = store.getState().reviews;
      expect(state.reviews).toEqual([]);
    });
  });

  describe("removeReview", () => {
    beforeEach(() => {
      const initialReviews = [
        { _id: "1", rating: 5, comment: "Great" },
        { _id: "2", rating: 4, comment: "Good" },
        { _id: "3", rating: 3, comment: "OK" },
      ];
      store.dispatch(setReviews(initialReviews));
    });

    test("should remove a review by id", () => {
      store.dispatch(removeReview("2"));

      const state = store.getState().reviews;
      expect(state.reviews).toHaveLength(2);
      expect(state.reviews.find((r) => r._id === "2")).toBeUndefined();
    });

    test("should not affect other reviews", () => {
      store.dispatch(removeReview("2"));

      const state = store.getState().reviews;
      expect(state.reviews.find((r) => r._id === "1")).toBeDefined();
      expect(state.reviews.find((r) => r._id === "3")).toBeDefined();
    });

    test("should handle removing non-existent review", () => {
      store.dispatch(removeReview("999"));

      const state = store.getState().reviews;
      expect(state.reviews).toHaveLength(3);
    });

    test("should handle removing from empty array", () => {
      store.dispatch(setReviews([]));
      store.dispatch(removeReview("1"));

      const state = store.getState().reviews;
      expect(state.reviews).toEqual([]);
    });
  });

  describe("setLoading", () => {
    test("should set loading to true", () => {
      store.dispatch(setLoading(true));

      const state = store.getState().reviews;
      expect(state.loading).toBe(true);
    });

    test("should set loading to false", () => {
      store.dispatch(setLoading(true));
      store.dispatch(setLoading(false));

      const state = store.getState().reviews;
      expect(state.loading).toBe(false);
    });
  });

  describe("setError", () => {
    test("should set error message", () => {
      const errorMessage = "Failed to fetch reviews";
      store.dispatch(setError(errorMessage));

      const state = store.getState().reviews;
      expect(state.error).toBe(errorMessage);
    });

    test("should clear error", () => {
      store.dispatch(setError("Error occurred"));
      store.dispatch(setError(null));

      const state = store.getState().reviews;
      expect(state.error).toBeNull();
    });

    test("should handle error object", () => {
      const errorObj = { message: "Error", code: 500 };
      store.dispatch(setError(errorObj));

      const state = store.getState().reviews;
      expect(state.error).toEqual(errorObj);
    });
  });

  describe("combined actions", () => {
    test("should handle multiple actions in sequence", () => {
      store.dispatch(setLoading(true));
      store.dispatch(
        setReviews([
          { _id: "1", rating: 5 },
          { _id: "2", rating: 4 },
        ])
      );
      store.dispatch(setLoading(false));
      store.dispatch(removeReview("1"));

      const state = store.getState().reviews;
      expect(state.reviews).toHaveLength(1);
      expect(state.reviews[0]._id).toBe("2");
      expect(state.loading).toBe(false);
    });

    test("should handle error during loading", () => {
      store.dispatch(setLoading(true));
      store.dispatch(setError("Network error"));
      store.dispatch(setLoading(false));

      const state = store.getState().reviews;
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
    });
  });
});
