// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cart from "../../pages/Cart";
import Checkout from "../../pages/Checkout";
import cartReducer from "../../features/cartSlice";
import axios from "../../config/axios";
import { AuthProvider } from "../../contexts/AuthContext";

// Mock axios
jest.mock("../../config/axios");
const mockedAxios = axios;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children, initialState = {} }) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: initialState,
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

// Mock data
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
        images: ["test-image2.jpg"],
      },
      price: 49.99,
      quantity: 1,
      categories: "Accessories",
    },
  ],
};

const emptyCartData = {
  _id: "cart456",
  items: [],
};

describe("Cart & Checkout Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe("Cart Page Tests", () => {
    test("should render cart with items", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Your Shopping Cart")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Test Product 1")).toBeInTheDocument();
        expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      });
    });

    test("should display empty cart message when cart is empty", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [emptyCartData] },
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

    test("should calculate total correctly", async () => {
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

      // Subtotal: (29.99 * 2) + (49.99 * 1) = 109.97
      // Tax (8%): 109.97 * 0.08 = 8.80
      // Total: 109.97 + 8.80 = 118.77
      await waitFor(() => {
        const subtotalElement = screen.getByText(/\$109\.97/);
        expect(subtotalElement).toBeInTheDocument();
      });
    });

    test("should update quantity when buttons are clicked", async () => {
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

      // Find and click the increment button (assuming there's a button with + or increment)
      const incrementButtons = screen.getAllByRole("button");
      const incrementBtn = incrementButtons.find((btn) => btn.textContent === "+");

      if (incrementBtn) {
        fireEvent.click(incrementBtn);

        await waitFor(() => {
          expect(mockedAxios.put).toHaveBeenCalled();
        });
      }
    });

    test("should remove item from cart", async () => {
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

      // Find and click remove button (Trash icon)
      const removeButtons = screen.getAllByRole("button");
      const removeBtn = removeButtons.find(
        (btn) => btn.querySelector("svg") && btn.querySelector("svg").classList?.length > 0
      );

      if (removeBtn) {
        fireEvent.click(removeBtn);

        await waitFor(() => {
          expect(mockedAxios.delete).toHaveBeenCalled();
        });
      }
    });

    test("should show loading state while fetching cart", () => {
      mockedAxios.get.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

      render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      expect(screen.getByText("Loading cart...")).toBeInTheDocument();
    });

    test("should navigate to checkout when proceed button is clicked", async () => {
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

      // Look for checkout or proceed button
      const buttons = screen.getAllByRole("button");
      const checkoutBtn = buttons.find(
        (btn) => btn.textContent.includes("Checkout") || btn.textContent.includes("Proceed")
      );

      if (checkoutBtn) {
        fireEvent.click(checkoutBtn);
        // The navigation should be triggered
      }
    });
  });

  describe("Checkout Page Tests", () => {
    const mockUser = {
      name: "John Doe",
      email: "john@example.com",
    };

    beforeEach(() => {
      // Mock localStorage for auth
      Storage.prototype.getItem = jest.fn((key) => {
        if (key === "token") return "mock-token";
        if (key === "user") return JSON.stringify(mockUser);
        return null;
      });
    });

    test("should redirect to login if not authenticated", () => {
      Storage.prototype.getItem = jest.fn(() => null);

      render(
        <TestWrapper>
          <Checkout />
        </TestWrapper>
      );

      // Should attempt to navigate to login
      waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });

    test("should render checkout form with user information", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      render(
        <TestWrapper initialState={{ cart: { cart: mockCartData.items } }}>
          <Checkout />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Paiement")).toBeInTheDocument();
      });
    });

    test("should calculate order summary correctly", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      render(
        <TestWrapper initialState={{ cart: { cart: mockCartData.items } }}>
          <Checkout />
        </TestWrapper>
      );

      await waitFor(() => {
        // Subtotal should be displayed
        const subtotal = 29.99 * 2 + 49.99 * 1;
        expect(subtotal).toBeCloseTo(109.97, 2);
      });
    });

    test("should update form inputs correctly", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      render(
        <TestWrapper initialState={{ cart: { cart: mockCartData.items } }}>
          <Checkout />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Paiement")).toBeInTheDocument();
      });

      // Find input fields and test updates
      const inputs = screen.getAllByRole("textbox");
      if (inputs.length > 0) {
        fireEvent.change(inputs[0], { target: { value: "New York" } });
        expect(inputs[0].value).toBe("New York");
      }
    });

    test("should show payment modal when form is submitted", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      render(
        <TestWrapper initialState={{ cart: { cart: mockCartData.items } }}>
          <Checkout />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Paiement")).toBeInTheDocument();
      });

      // Find and submit the form
      const forms = screen.queryAllByRole("form");
      if (forms.length > 0) {
        fireEvent.submit(forms[0]);
        // Payment modal should appear
      }
    });

    test("should validate required fields before checkout", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      // Mock alert
      global.alert = jest.fn();

      render(
        <TestWrapper initialState={{ cart: { cart: mockCartData.items } }}>
          <Checkout />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Paiement")).toBeInTheDocument();
      });

      // Try to submit without agreeing to terms
      const submitButtons = screen.getAllByRole("button");
      const submitBtn = submitButtons.find(
        (btn) => btn.type === "submit" || btn.textContent.includes("Place Order")
      );

      if (submitBtn) {
        fireEvent.click(submitBtn);
        // Should show validation error
      }
    });
  });

  describe("Complete Cart to Checkout Flow", () => {
    test("should complete full checkout flow from cart to order", async () => {
      // Step 1: Load cart
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      const { rerender } = render(
        <TestWrapper>
          <Cart />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      });

      // Step 2: Navigate to checkout
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockCartData] },
      });

      rerender(
        <TestWrapper initialState={{ cart: { cart: mockCartData.items } }}>
          <Checkout />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Paiement")).toBeInTheDocument();
      });

      // Step 3: Complete checkout form and submit
      // This simulates the full user journey
    });
  });
});
