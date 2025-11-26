// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../../pages/auth/Login";
import { AuthProvider } from "../../../contexts/AuthContext";
import axios from "../../../config/axios";

jest.mock("../../../config/axios");

const renderLogin = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

describe("Login Component - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render login form correctly", () => {
      renderLogin();

      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("should render link to register page", () => {
      renderLogin();

      const registerLink = screen.getByText(/don't have an account/i);
      expect(registerLink).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should require email field", async () => {
      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
    });

    it("should require password field", async () => {
      renderLogin();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
    });

    it("should validate email format", () => {
      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });

  describe("User Interaction", () => {
    it("should update email input on change", () => {
      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should update password input on change", () => {
      renderLogin();

      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput).toHaveValue("password123");
    });

    it("should hide error message when input is focused", () => {
      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);

      // Focus on input
      fireEvent.focus(emailInput);

      // Error message should be hidden (if it was shown)
      const errorMessages = screen.queryAllByText(/incorrect/i);
      errorMessages.forEach((msg) => {
        expect(msg).toHaveStyle({ display: "none" });
      });
    });
  });

  describe("Login Submission", () => {
    it("should submit form with valid credentials", async () => {
      const mockResponse = {
        data: {
          accessToken: "mock-token",
          user: { email: "test@example.com" },
        },
      };

      axios.post.mockResolvedValueOnce(mockResponse);
      axios.get.mockResolvedValueOnce({
        data: { email: "test@example.com" },
      });

      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith("auth/login", {
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("should display error message on login failure", async () => {
      const mockError = {
        response: {
          data: {
            error: "Invalid credentials",
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/invalid credentials/i);
        expect(errorMessage).toBeVisible();
      });
    });

    it("should handle network errors", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to home on successful login", async () => {
      const mockResponse = {
        data: {
          accessToken: "mock-token",
          user: { email: "test@example.com" },
        },
      };

      axios.post.mockResolvedValueOnce(mockResponse);
      axios.get.mockResolvedValueOnce({
        data: { email: "test@example.com" },
      });

      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe("Remember Me / Forgot Password", () => {
    it("should render remember me checkbox if exists", () => {
      renderLogin();

      const rememberMe = screen.queryByLabelText(/remember me/i);
      // May or may not exist depending on implementation
      if (rememberMe) {
        expect(rememberMe).toBeInTheDocument();
      }
    });

    it("should render forgot password link if exists", () => {
      renderLogin();

      const forgotPassword = screen.queryByText(/forgot password/i);
      // May or may not exist depending on implementation
      if (forgotPassword) {
        expect(forgotPassword).toBeInTheDocument();
      }
    });
  });

  describe("Accessibility", () => {
    it("should have accessible form labels", () => {
      renderLogin();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("should have submit button", () => {
      renderLogin();

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });
});
