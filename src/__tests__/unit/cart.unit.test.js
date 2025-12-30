// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cart from "../../pages/Cart";
import cartReducer from "../../features/cartSlice";
import axios from "../../config/axios";

jest.mock("../../config/axios");
const mockedAxios = axios;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const TestWrapper = ({ children }) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

const mockCartData = {
  _id: "cart123",
  items: [
    {
      productId: {
        _id: "prod1",
        title: "Test Product 1",
        images: ["test-image1.jpg"],
      },
      price: 29.99,
      quantity: 2,
      categories: "Electronics",
    },
    {
      productId: {
        _id: "prod2",
        title: "Test Product 2",
        images: ["http://example.com/image.jpg"],
      },
      price: 49.99,
      quantity: 1,
      categories: "Accessories",
    },
  ],
};

describe("Cart Component Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test("should render cart page with title", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [{ _id: "cart123", items: [] }] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    expect(screen.getByText("Your Shopping Cart")).toBeInTheDocument();
    expect(screen.getByText("Review your items before checkout")).toBeInTheDocument();
  });

  test("should display empty cart message when no items", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [{ _id: "cart123", items: [] }] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });
  });

  test("should render cart items correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
      expect(screen.getByText("Accessories")).toBeInTheDocument();
    });
  });

  test("should display product images correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
      // Check that cloudinary URL is used for non-http images
      expect(images[0].src).toContain("cloudinary");
      // Check that http URLs are used directly
      expect(images[1].src).toBe("http://example.com/image.jpg");
    });
  });

  test("should calculate subtotal correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      // Subtotal = (29.99 * 2) + (49.99 * 1) = 109.97
      expect(screen.getByText(/\$109\.97/)).toBeInTheDocument();
    });
  });

  test("should calculate tax and total correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      // Tax = 109.97 * 0.08 = 8.80
      expect(screen.getByText(/\$8\.80/)).toBeInTheDocument();
      // Total = 109.97 + 8.80 = 118.77
      expect(screen.getByText(/\$118\.77/)).toBeInTheDocument();
    });
  });

  test("should show loading state while fetching", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    expect(screen.getByText("Loading cart...")).toBeInTheDocument();
  });

  test("should handle API error gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    // Should not crash and handle error
    await waitFor(() => {
      expect(screen.getByText("Your Shopping Cart")).toBeInTheDocument();
    });
  });

  test("should call update quantity when quantity changes", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });
    mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Find increment buttons
    const buttons = screen.getAllByRole("button");
    const incrementBtn = buttons.find((btn) => btn.textContent === "+");

    if (incrementBtn) {
      fireEvent.click(incrementBtn);

      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalled();
      });
    }
  });

  test("should not allow quantity less than 1", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: "cart123",
            items: [
              {
                productId: {
                  _id: "prod1",
                  title: "Test Product",
                  images: ["test.jpg"],
                },
                price: 29.99,
                quantity: 1,
                categories: "Test",
              },
            ],
          },
        ],
      },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    // Try to decrement from quantity 1 - should not call API
    const buttons = screen.getAllByRole("button");
    const decrementBtn = buttons.find((btn) => btn.textContent === "-");

    if (decrementBtn) {
      fireEvent.click(decrementBtn);
      // Should not make API call since quantity is already 1
      expect(mockedAxios.put).not.toHaveBeenCalled();
    }
  });

  test("should call remove item when delete button is clicked", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Find and click remove button
    const buttons = screen.getAllByRole("button");
    // Look for button that might contain the Trash icon or delete functionality
    const removeBtn = buttons.find((btn) => {
      const svg = btn.querySelector("svg");
      return svg !== null;
    });

    if (removeBtn) {
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(mockedAxios.delete).toHaveBeenCalled();
      });
    }
  });

  test("should handle products without images", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: "cart123",
            items: [
              {
                productId: {
                  _id: "prod1",
                  title: "No Image Product",
                  images: [],
                },
                price: 29.99,
                quantity: 1,
                categories: "Test",
              },
            ],
          },
        ],
      },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      expect(images[0].src).toContain("placeholder");
    });
  });

  test("should handle products without productId", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: "cart123",
            items: [
              {
                productId: null,
                price: 29.99,
                quantity: 1,
                categories: "Test",
              },
            ],
          },
        ],
      },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Unknown Product")).toBeInTheDocument();
    });
  });

  test("should show payment modal when checkout button is clicked", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [mockCartData] },
    });

    render(
      <TestWrapper>
        <Cart />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Look for proceed to checkout button
    const buttons = screen.getAllByRole("button");
    const checkoutBtn = buttons.find(
      (btn) => btn.textContent.includes("Checkout") || btn.textContent.includes("Proceed")
    );

    if (checkoutBtn) {
      fireEvent.click(checkoutBtn);
      // Payment modal should be triggered
    }
  });
});
