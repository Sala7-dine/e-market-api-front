import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../../pages/Checkout.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../contexts/AuthContext.jsx";
import Header from '../../components/Header.jsx';
import PaymentModal from "../../components/PaymentModal.jsx"
import { MemoryRouter } from 'react-router-dom';

// Mock des hooks et composants externes
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({ pathname: '/' })),
}));
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock("../../components/PaymentModal", () =>
  jest.fn(() => <div>PaymentModal Mock</div>)
);

render(
  <MemoryRouter>
    <Checkout />
  </MemoryRouter>
);

describe("Checkout Component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

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
    render(<Checkout />);
    expect(screen.getByText(/Paiement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom complet/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/Adresse email/i)).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByText(/Produit 1/i)).toBeInTheDocument();
    expect(screen.getByText("PaymentModal Mock")).toBeInTheDocument();
  });

  it("changes delivery method when button clicked", () => {
    render(<Checkout />);
    const pickupButton = screen.getByText(/Retrait/i);
    fireEvent.click(pickupButton);
    expect(pickupButton.closest("button")).toHaveClass(
      "border-blue-500 bg-blue-50"
    );
  });

  it("updates form fields on change", () => {
    render(<Checkout />);
    const phoneInput = screen.getByPlaceholderText(/Entrez votre numéro/i);
    fireEvent.change(phoneInput, { target: { value: "0600000000" } });
    expect(phoneInput).toHaveValue("0600000000");

    const agreeCheckbox = screen.getByLabelText(/Conditions générales/i);
    fireEvent.click(agreeCheckbox);
    expect(agreeCheckbox).toBeChecked();
  });

  it("shows alert if submitting without agreeing terms", () => {
    window.alert = jest.fn();
    render(<Checkout />);
    const payButton = screen.getByText(/Payer maintenant/i);
    fireEvent.click(payButton);
    expect(window.alert).toHaveBeenCalledWith(
      "Please agree to the terms and conditions"
    );
  });

  it("opens payment modal when terms agreed", () => {
    render(<Checkout />);
    const agreeCheckbox = screen.getByLabelText(/Conditions générales/i);
    fireEvent.click(agreeCheckbox);
    const payButton = screen.getByText(/Payer maintenant/i);
    fireEvent.click(payButton);
    expect(screen.getByText("PaymentModal Mock")).toBeInTheDocument();
  });
});
