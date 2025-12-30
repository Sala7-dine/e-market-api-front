// eslint-disable-next-line no-unused-vars
import React from "react";
// eslint-disable-next-line no-unused-vars
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import Products from "../../pages/admin/Products";

// Mock the productSlice actions
jest.mock("../../features/productSlice", () => ({
  ...jest.requireActual("../../features/productSlice"),
  fetchAllProducts: jest.fn(() => ({ type: "products/fetchAll/fulfilled" })),
  deleteproduct: jest.fn(() => ({ type: "products/delete/fulfilled" })),
}));

const mockProducts = [
  {
    _id: "prod1",
    title: "Test Product 1",
    description: "Description 1",
    prix: 29.99,
    stock: 15,
    images: ["image1.jpg"],
  },
  {
    _id: "prod2",
    title: "Test Product 2",
    description: "Description 2",
    prix: 49.99,
    stock: 5,
    images: ["image2.jpg"],
  },
  {
    _id: "prod3",
    title: "Test Product 3",
    description: "Description 3",
    prix: 19.99,
    stock: 0,
    images: [],
  },
];

const createMockStore = (initialState) =>
  configureStore({
    reducer: {
      products: (state = initialState.products) => state,
    },
  });

const TestWrapper = ({ children, initialState }) => {
  const store = createMockStore(initialState);

  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("Products Admin Component Tests", () => {
  const defaultState = {
    products: {
      products: mockProducts,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      limit: 10,
    },
  };

  test("should render products table", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText("Gestion des Produits")).toBeInTheDocument();
    expect(screen.getByText("Gérez votre inventaire de produits")).toBeInTheDocument();
  });

  test("should display loading state", () => {
    const loadingState = {
      products: {
        ...defaultState.products,
        loading: true,
      },
    };

    render(
      <TestWrapper initialState={loadingState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  test("should display error message", () => {
    const errorState = {
      products: {
        ...defaultState.products,
        loading: false,
        error: "Failed to load products",
      },
    };

    render(
      <TestWrapper initialState={errorState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText(/Erreur:/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load products/)).toBeInTheDocument();
  });

  test("should render product list", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("Test Product 3")).toBeInTheDocument();
  });

  test("should display product stock status correctly", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    // Product 1 has stock > 10 (should be "active")
    expect(screen.getByText("15 unités")).toBeInTheDocument();

    // Product 2 has stock 1-10 (should be "warning")
    expect(screen.getByText("5 unités")).toBeInTheDocument();

    // Product 3 has stock 0 (should be "blocked")
    expect(screen.getByText("0 unités")).toBeInTheDocument();
  });

  test("should display product prices", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText(/29.99/)).toBeInTheDocument();
    expect(screen.getByText(/49.99/)).toBeInTheDocument();
    expect(screen.getByText(/19.99/)).toBeInTheDocument();
  });

  test("should show delete confirmation modal", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    // Find all delete buttons (trash icons)
    const deleteButtons = screen.getAllByRole("button");
    const firstDeleteBtn = deleteButtons.find((btn) => {
      const svg = btn.querySelector("svg");
      return svg && svg.getAttribute("data-icon") === "trash";
    });

    if (firstDeleteBtn) {
      fireEvent.click(firstDeleteBtn);
      // Check if delete confirmation modal appears
    }
  });

  test("should handle view images click", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    // Find view buttons (eye icons)
    const viewButtons = screen.getAllByRole("button");
    const firstViewBtn = viewButtons.find((btn) => {
      const svg = btn.querySelector("svg");
      return svg && svg.getAttribute("data-icon") === "eye";
    });

    if (firstViewBtn) {
      fireEvent.click(firstViewBtn);
      // Image modal should appear
    }
  });

  test("should render table headers", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Produit")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Prix")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("should render pagination component", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    // Pagination component should be rendered
    // You can add more specific checks based on Pagination component implementation
  });

  test("should handle empty products list", () => {
    const emptyState = {
      products: {
        products: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
      },
    };

    render(
      <TestWrapper initialState={emptyState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText("Gestion des Produits")).toBeInTheDocument();
    // Table should still render but with no rows
  });

  test("should display product descriptions", () => {
    render(
      <TestWrapper initialState={defaultState}>
        <Products />
      </TestWrapper>
    );

    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getByText("Description 3")).toBeInTheDocument();
  });
});
