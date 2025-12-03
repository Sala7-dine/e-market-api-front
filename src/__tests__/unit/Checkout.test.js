// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../../pages/Checkout.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { MemoryRouter } from "react-router-dom";

// Mock des hooks et composants externes
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({ pathname: "/" })),
}));
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock(
  "../../components/PaymentModal",
  () =>
    function PaymentModalMock() {
      return <div>PaymentModal Mock</div>;
    }
);

describe("Checkout Component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const renderCheckout = () =>
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      isAuthenticated: () => true,
      user: { name: "John Doe", email: "john@example.com" },
    });
    useSelector.mockImplementation((callback) =>
      callback({
        cart: {
          cart: [
            {
              productId: { title: "Produit 1", images: [] },
              quantity: 2,
              price: 10,
            },
          ],
        },
      })
    );
  });

  it("renders header, footer, and checkout form", () => {
    renderCheckout();
    expect(screen.getAllByText(/Paiement/i)[0]).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getAllByText(/Produit 1/i)[0]).toBeInTheDocument();
    expect(screen.getByText("PaymentModal Mock")).toBeInTheDocument();
  });

  it("changes delivery method when button clicked", () => {
    renderCheckout();
    const pickupButton = screen.getByText(/Retrait/i);
    fireEvent.click(pickupButton);
    expect(pickupButton.closest("button")).toHaveClass("border-blue-500 bg-blue-50");
  });

  it("updates form fields on change", () => {
    renderCheckout();
    const phoneInput = screen.getByPlaceholderText(/Entrez votre numéro/i);
    fireEvent.change(phoneInput, { target: { value: "0600000000" } });
    expect(phoneInput).toHaveValue("0600000000");

    const agreeCheckbox = screen.getByLabelText(/Conditions générales/i);
    fireEvent.click(agreeCheckbox);
    expect(agreeCheckbox).toBeChecked();
  });

  it("disables pay button when terms not agreed", () => {
    renderCheckout();
    const payButton = screen.getByText(/Payer maintenant/i);
    expect(payButton).toBeDisabled();
  });

  it("opens payment modal when terms agreed", () => {
    renderCheckout();
    const agreeCheckbox = screen.getByLabelText(/Conditions générales/i);
    fireEvent.click(agreeCheckbox);
    const payButton = screen.getByText(/Payer maintenant/i);
    fireEvent.click(payButton);
    expect(screen.getByText("PaymentModal Mock")).toBeInTheDocument();
  });
});
