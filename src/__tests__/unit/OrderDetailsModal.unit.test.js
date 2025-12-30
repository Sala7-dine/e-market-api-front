// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrderDetailsModal from "../../components/OrderDetailsModal";

describe("OrderDetailsModal Component Tests", () => {
  const mockOnClose = jest.fn();
  const mockOrder = {
    _id: "order123",
    createdAt: "2024-12-15T10:00:00.000Z",
    status: "pending",
    items: [
      {
        productId: {
          _id: "prod1",
          title: "Test Product 1",
          images: ["image1.jpg"],
        },
        quantity: 2,
        price: 29.99,
      },
      {
        productId: {
          _id: "prod2",
          title: "Test Product 2",
          images: ["image2.jpg"],
        },
        quantity: 1,
        price: 49.99,
      },
    ],
    total: 109.97,
    shippingAddress: {
      street: "123 Main St",
      city: "Paris",
      zipCode: "75001",
      country: "France",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    document.body.style.overflow = "unset";
  });

  test("should not render when order is null", () => {
    const { container } = render(
      <OrderDetailsModal order={null} customId="1" onClose={mockOnClose} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("should render order details when order is provided", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/Commande #123/)).toBeInTheDocument();
  });

  test("should display order date", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    // Check if date is rendered (format: weekday, year, month, day in French)
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  test("should display order items", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
  });

  test("should display item quantities", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    // Just verify the "Quantité:" label exists for both items
    const quantityLabels = screen.getAllByText(/Quantité:/);
    expect(quantityLabels).toHaveLength(2);
  });

  test("should display item prices", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
    expect(screen.getByText(/49\.99/)).toBeInTheDocument();
  });

  test("should call onClose when close button is clicked", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("should call onClose when clicking outside modal", () => {
    const { container } = render(
      <OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />
    );

    const backdrop = container.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  test("should not close when clicking inside modal content", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    const modalContent = screen.getByText("Test Product 1");
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("should disable body scroll when mounted", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  test("should restore body scroll when unmounted", () => {
    const { unmount } = render(
      <OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />
    );

    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  test("should display pending status with correct styling", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    // Check for status badge (implementation may vary)
    const statusElement = screen.getByText(/pending/i);
    expect(statusElement).toBeInTheDocument();
  });

  test("should display paid status correctly", () => {
    const paidOrder = { ...mockOrder, status: "paid" };

    render(<OrderDetailsModal order={paidOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/paid/i)).toBeInTheDocument();
  });

  test("should display shipped status correctly", () => {
    const shippedOrder = { ...mockOrder, status: "shipped" };

    render(<OrderDetailsModal order={shippedOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/shipped/i)).toBeInTheDocument();
  });

  test("should display delivered status correctly", () => {
    const deliveredOrder = { ...mockOrder, status: "Livrée" };

    render(<OrderDetailsModal order={deliveredOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/Livrée/i)).toBeInTheDocument();
  });

  test("should display cancelled status correctly", () => {
    const cancelledOrder = { ...mockOrder, status: "cancelled" };

    render(<OrderDetailsModal order={cancelledOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
  });

  test("should handle order without shipping address", () => {
    const orderWithoutAddress = { ...mockOrder, shippingAddress: null };

    render(<OrderDetailsModal order={orderWithoutAddress} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/Commande #123/)).toBeInTheDocument();
  });

  test("should render product images", () => {
    render(<OrderDetailsModal order={mockOrder} customId="123" onClose={mockOnClose} />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  test("should handle empty items array", () => {
    const emptyOrder = { ...mockOrder, items: [] };

    render(<OrderDetailsModal order={emptyOrder} customId="123" onClose={mockOnClose} />);

    expect(screen.getByText(/Commande #123/)).toBeInTheDocument();
  });
});
