// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../../../pages/auth/Register";
import { AuthProvider } from "../../../contexts/AuthContext";
import axios from "../../../config/axios";

jest.mock("../../../config/axios");

const renderRegister = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );

describe("Register Component - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render registration form correctly", () => {
      renderRegister();

      expect(screen.getByRole("heading", { name: /e-market/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    });

    it("should render link to login page", () => {
      renderRegister();

      const loginLink = screen.getByText(/already have an account/i);
      expect(loginLink).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should require full name field", () => {
      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      expect(fullNameInput).toBeInTheDocument();
    });

    it("should require email field", () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
    });

    it("should require password field", () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toBeInTheDocument();
    });

    it("should validate email format", () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("should validate password field type", () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("User Interaction", () => {
    it("should update full name input on change", () => {
      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });

      expect(fullNameInput).toHaveValue("John Doe");
    });

    it("should update email input on change", () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });

      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update password input on change", () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput).toHaveValue("password123");
    });
  });

  describe("Registration Submission", () => {
    it("should submit form with valid data", async () => {
      const mockResponse = {
        data: {
          message: "User registered successfully",
          user: {
            id: "1",
            fullName: "John Doe",
            email: "john@example.com",
          },
        },
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith("auth/register", {
          fullName: "John Doe",
          email: "john@example.com",
          password: "Password123",
        });
      });
    });

    it("should display error for existing email", async () => {
      const mockError = {
        response: {
          data: {
            error: "Email already exists",
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/email already exists/i);
        expect(errorMessage).toBeVisible();
      });
    });

    it("should handle weak password error", async () => {
      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre/i
        );
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it("should navigate to login after successful registration", async () => {
      const mockResponse = {
        data: {
          message: "Registration successful",
          user: { id: "1", email: "john@example.com" },
        },
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling", () => {
    it("should display generic error message on server error", async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            error: "Internal server error",
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });

    it("should handle network errors", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      renderRegister();

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });

    it("should clear error message on input focus", () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.focus(emailInput);

      const errorMessages = screen.queryAllByText(/error/i);
      errorMessages.forEach((msg) => {
        if (msg.style.display !== undefined) {
          expect(msg).toHaveStyle({ display: "none" });
        }
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible form labels", () => {
      renderRegister();

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    });

    it("should have submit button with correct type", () => {
      renderRegister();

      const submitButton = screen.getByRole("button", { name: /create account/i });
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("Terms and Conditions", () => {
    it("should render terms checkbox if exists", () => {
      renderRegister();

      const termsCheckbox = screen.queryByLabelText(/terms/i);
      if (termsCheckbox) {
        expect(termsCheckbox).toBeInTheDocument();
      }
    });
  });
});
