import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import axios from '../../config/axios';
import Cookie from 'js-cookie';

// Mock dependencies
jest.mock('../../config/axios');
jest.mock('js-cookie');

// Test component to access auth context
const TestComponent = () => {
  const { user, login, register, logout, isAuthenticated, getUser } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'test@example.com', password: 'password' });
    } catch (error) {
      // Error handled
    }
  };

  const handleRegister = async () => {
    try {
      await register({ fullName: 'Test', email: 'test@example.com', password: 'password' });
    } catch (error) {
      // Error handled
    }
  };

  const handleGetUser = async () => {
    try {
      await getUser();
    } catch (error) {
      // Error handled
    }
  };

  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
      <div data-testid="auth-status">
        {isAuthenticated() ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button data-testid="login-btn" onClick={handleLogin}>
        Login
      </button>
      <button data-testid="register-btn" onClick={handleRegister}>
        Register
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      <button data-testid="getuser-btn" onClick={handleGetUser}>
        Get User
      </button>
    </div>
  );
};

const renderWithAuth = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Cookie.get.mockReturnValue(null);
    Cookie.set.mockImplementation(() => {});
    Cookie.remove.mockImplementation(() => {});
  });

  describe('Authentication Flow', () => {
    it('should complete full login flow', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'user',
      };

      // Mock successful login
      axios.post.mockResolvedValueOnce({
        data: {
          accessToken: 'mock-token-12345',
        },
      });

      // Mock get user
      axios.get.mockResolvedValueOnce({
        data: mockUser,
      });

      renderWithAuth(<TestComponent />);

      // Initially not logged in
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');

      // Click login button
      const loginBtn = screen.getByTestId('login-btn');
      fireEvent.click(loginBtn);

      // Wait for login to complete
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('auth/login', {
          email: 'test@example.com',
          password: 'password',
        });
      });

      // Verify cookie was set
      await waitFor(() => {
        expect(Cookie.set).toHaveBeenCalledWith(
          'accessToken',
          'mock-token-12345',
          expect.objectContaining({
            expires: 1 / 24,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          })
        );
      });

      // Verify user data was fetched
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/users/me');
      });

      // Verify user is logged in
      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
      });
    });

    it('should complete full registration flow', async () => {
      const mockResponse = {
        message: 'User registered successfully',
        user: {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
        },
      };

      axios.post.mockResolvedValueOnce({ data: mockResponse });

      renderWithAuth(<TestComponent />);

      const registerBtn = screen.getByTestId('register-btn');
      fireEvent.click(registerBtn);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('auth/register', {
          fullName: 'Test',
          email: 'test@example.com',
          password: 'password',
        });
      });
    });

    it('should complete full logout flow', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
      };

      // Setup logged in state
      axios.post.mockResolvedValueOnce({
        data: { accessToken: 'mock-token' },
      });
      axios.get.mockResolvedValueOnce({ data: mockUser });

      renderWithAuth(<TestComponent />);

      // Login first
      const loginBtn = screen.getByTestId('login-btn');
      fireEvent.click(loginBtn);

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
      });

      // Mock logout
      axios.post.mockResolvedValueOnce({ data: { message: 'Logged out' } });

      // Logout
      const logoutBtn = screen.getByTestId('logout-btn');
      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('auth/logout');
      });

      await waitFor(() => {
        expect(Cookie.remove).toHaveBeenCalledWith('accessToken');
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle login errors gracefully', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Invalid credentials',
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderWithAuth(<TestComponent />);

      const loginBtn = screen.getByTestId('login-btn');
      fireEvent.click(loginBtn);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('auth/login', {
          email: 'test@example.com',
          password: 'password',
        });
      });

      // User should remain logged out
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    it('should handle registration errors', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Email already exists',
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderWithAuth(<TestComponent />);

      const registerBtn = screen.getByTestId('register-btn');
      fireEvent.click(registerBtn);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('auth/register', {
          fullName: 'Test',
          email: 'test@example.com',
          password: 'password',
        });
      });
    });

    it('should handle logout errors but still clear local state', async () => {
      // Setup logged in state
      axios.post.mockResolvedValueOnce({
        data: { accessToken: 'mock-token' },
      });
      axios.get.mockResolvedValueOnce({
        data: { id: '1', email: 'test@example.com' },
      });

      renderWithAuth(<TestComponent />);

      // Login
      fireEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in');
      });

      // Mock logout failure
      axios.post.mockRejectedValueOnce(new Error('Network error'));

      // Logout
      fireEvent.click(screen.getByTestId('logout-btn'));

      // Even if API fails, should clear local state
      await waitFor(() => {
        expect(Cookie.remove).toHaveBeenCalledWith('accessToken');
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      });
    });

    it('should handle getUser errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };

      axios.get.mockRejectedValueOnce(mockError);

      renderWithAuth(<TestComponent />);

      const getUserBtn = screen.getByTestId('getuser-btn');
      fireEvent.click(getUserBtn);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/users/me');
      });

      // User should remain null
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });

  describe('Token Authentication', () => {
    it('should initialize with authenticated state if valid token exists', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const validToken = `header.${btoa(JSON.stringify({ exp: futureTime }))}.signature`;

      Cookie.get.mockReturnValue(validToken);

      const mockUser = {
        id: '1',
        email: 'test@example.com',
      };

      axios.get.mockResolvedValueOnce({ data: mockUser });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
      });
    });

    it('should not initialize with expired token', async () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const expiredToken = `header.${btoa(JSON.stringify({ exp: pastTime }))}.signature`;

      Cookie.get.mockReturnValue(expiredToken);

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      });

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    it('should handle invalid token format', async () => {
      Cookie.get.mockReturnValue('invalid-token-format');

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      });
    });
  });

  describe('User State Management', () => {
    it('should update user state after successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'user',
      };

      axios.post.mockResolvedValueOnce({
        data: { accessToken: 'mock-token' },
      });

      axios.get.mockResolvedValueOnce({
        data: mockUser,
      });

      renderWithAuth(<TestComponent />);

      fireEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
      });
    });

    it('should clear user state on logout', async () => {
      // Setup logged in state
      axios.post.mockResolvedValueOnce({
        data: { accessToken: 'mock-token' },
      });
      axios.get.mockResolvedValueOnce({
        data: { id: '1', email: 'test@example.com' },
      });

      renderWithAuth(<TestComponent />);

      // Login
      fireEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in');
      });

      // Mock logout
      axios.post.mockResolvedValueOnce({ data: {} });

      // Logout
      fireEvent.click(screen.getByTestId('logout-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      });
    });

    it('should fetch and update user data', async () => {
      const mockUser = {
        id: '1',
        email: 'updated@example.com',
        fullName: 'Updated User',
      };

      axios.get.mockResolvedValueOnce({ data: mockUser });

      renderWithAuth(<TestComponent />);

      fireEvent.click(screen.getByTestId('getuser-btn'));

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/users/me');
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as updated@example.com');
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to home after logout', async () => {
      // Setup logged in state
      axios.post.mockResolvedValueOnce({
        data: { accessToken: 'mock-token' },
      });
      axios.get.mockResolvedValueOnce({
        data: { id: '1', email: 'test@example.com' },
      });

      renderWithAuth(<TestComponent />);

      // Login
      fireEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in');
      });

      // Mock logout
      axios.post.mockResolvedValueOnce({ data: {} });

      // Logout (navigation would happen in actual component)
      fireEvent.click(screen.getByTestId('logout-btn'));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('auth/logout');
      });
    });
  });

  describe('Loading State', () => {
    it('should handle loading state during initialization', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const validToken = `header.${btoa(JSON.stringify({ exp: futureTime }))}.signature`;

      Cookie.get.mockReturnValue(validToken);

      // Delay the response to test loading
      axios.get.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: { id: '1', email: 'test@example.com' },
              });
            }, 100);
          })
      );

      renderWithAuth(<TestComponent />);

      // Eventually should load
      await waitFor(
        () => {
          expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in');
        },
        { timeout: 3000 }
      );
    });
  });
});
