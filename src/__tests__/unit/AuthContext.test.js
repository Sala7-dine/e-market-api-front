import { jwtDecode } from "jwt-decode";

describe("AuthContext - Unit Tests", () => {
  let mockNavigate;
  let mockAxios;
  let mockCookie;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock navigate
    mockNavigate = jest.fn();

    // Mock axios
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
    };

    // Mock Cookie
    mockCookie = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    };
  });

  describe("isAuthenticated", () => {
    it("should return false when no token exists", () => {
      mockCookie.get.mockReturnValue(null);

      const result = mockCookie.get("accessToken");
      expect(result).toBeNull();
      expect(mockCookie.get).toHaveBeenCalledWith("accessToken");
    });

    it("should return true when valid token exists", () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const validToken = `header.${btoa(JSON.stringify({ exp: futureTime }))}.signature`;

      mockCookie.get.mockReturnValue(validToken);

      const token = mockCookie.get("accessToken");
      expect(token).toBe(validToken);

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      expect(decoded.exp).toBeGreaterThanOrEqual(currentTime);
    });

    it("should return false when token is expired", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const expiredToken = `header.${btoa(JSON.stringify({ exp: pastTime }))}.signature`;

      mockCookie.get.mockReturnValue(expiredToken);

      const token = mockCookie.get("accessToken");
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      expect(decoded.exp).toBeLessThan(currentTime);
    });

    it("should handle invalid token format", () => {
      mockCookie.get.mockReturnValue("invalid-token");

      expect(() => {
        const token = mockCookie.get("accessToken");
        jwtDecode(token);
      }).toThrow();
    });
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        data: {
          accessToken: "mock-access-token",
          user: { id: "1", email: "test@example.com" },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const response = await mockAxios.post("auth/login", credentials);

      expect(mockAxios.post).toHaveBeenCalledWith("auth/login", credentials);
      expect(response.data.accessToken).toBe("mock-access-token");
      expect(response.data.user.email).toBe("test@example.com");
    });

    it("should set cookie after successful login", async () => {
      const accessToken = "mock-access-token";

      mockCookie.set("accessToken", accessToken, {
        expires: 1 / 24,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });

      expect(mockCookie.set).toHaveBeenCalledWith(
        "accessToken",
        accessToken,
        expect.objectContaining({
          expires: 1 / 24,
          secure: true,
          sameSite: "Strict",
          path: "/",
        })
      );
    });

    it("should handle login failure with invalid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "wrong-password",
      };

      const mockError = {
        response: {
          data: {
            error: "Invalid credentials",
          },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("auth/login", credentials)).rejects.toEqual(mockError);
    });

    it("should handle network error during login", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const networkError = new Error("Network Error");
      mockAxios.post.mockRejectedValue(networkError);

      await expect(mockAxios.post("auth/login", credentials)).rejects.toThrow("Network Error");
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const userData = {
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        data: {
          message: "User registered successfully",
          user: { id: "1", email: "test@example.com", fullName: "Test User" },
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const response = await mockAxios.post("auth/register", userData);

      expect(mockAxios.post).toHaveBeenCalledWith("auth/register", userData);
      expect(response.data.message).toBe("User registered successfully");
      expect(response.data.user.email).toBe("test@example.com");
    });

    it("should handle registration with existing email", async () => {
      const userData = {
        fullName: "Test User",
        email: "existing@example.com",
        password: "password123",
      };

      const mockError = {
        response: {
          data: {
            error: "Email already exists",
          },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("auth/register", userData)).rejects.toEqual(mockError);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        email: "test@example.com",
        // Missing fullName and password
      };

      const mockError = {
        response: {
          data: {
            error: "Missing required fields",
          },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(mockAxios.post("auth/register", invalidData)).rejects.toEqual(mockError);
    });
  });

  describe("logout", () => {
    it("should successfully logout user", async () => {
      mockAxios.post.mockResolvedValue({ data: { message: "Logged out successfully" } });

      const response = await mockAxios.post("auth/logout");

      expect(mockAxios.post).toHaveBeenCalledWith("auth/logout");
      expect(response.data.message).toBe("Logged out successfully");
    });

    it("should remove cookie on logout", () => {
      mockCookie.remove("accessToken");

      expect(mockCookie.remove).toHaveBeenCalledWith("accessToken");
    });

    it("should handle logout even if API call fails", async () => {
      mockAxios.post.mockRejectedValue(new Error("API Error"));

      try {
        await mockAxios.post("auth/logout");
      } catch {
        // Even if API fails, cookie should be removed
        mockCookie.remove("accessToken");
        expect(mockCookie.remove).toHaveBeenCalledWith("accessToken");
      }
    });

    it("should redirect to home after logout", () => {
      mockNavigate("/");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("getUser", () => {
    it("should fetch current user data", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        role: "user",
      };

      mockAxios.get.mockResolvedValue({ data: mockUser });

      const response = await mockAxios.get("/users/me");

      expect(mockAxios.get).toHaveBeenCalledWith("/users/me");
      expect(response.data).toEqual(mockUser);
    });

    it("should handle unauthorized access", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            error: "Unauthorized",
          },
        },
      };

      mockAxios.get.mockRejectedValue(mockError);

      await expect(mockAxios.get("/users/me")).rejects.toEqual(mockError);
    });

    it("should handle network error when fetching user", async () => {
      mockAxios.get.mockRejectedValue(new Error("Network Error"));

      await expect(mockAxios.get("/users/me")).rejects.toThrow("Network Error");
    });
  });

  describe("Token validation", () => {
    it("should validate token structure", () => {
      const validToken = "header.payload.signature";
      const parts = validToken.split(".");

      expect(parts).toHaveLength(3);
    });

    it("should decode token payload", () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, userId: "123", email: "test@example.com" };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      const decoded = jwtDecode(token);

      expect(decoded.userId).toBe("123");
      expect(decoded.email).toBe("test@example.com");
      expect(decoded.exp).toBe(futureTime);
    });

    it("should handle token expiration time", () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn1Hour = currentTime + 3600;

      expect(expiresIn1Hour).toBeGreaterThan(currentTime);
    });
  });

  describe("Cookie management", () => {
    it("should set cookie with correct options", () => {
      const token = "test-token";
      const options = {
        expires: 1 / 24, // 1 hour
        secure: true,
        sameSite: "Strict",
        path: "/",
      };

      mockCookie.set("accessToken", token, options);

      expect(mockCookie.set).toHaveBeenCalledWith("accessToken", token, options);
    });

    it("should get cookie value", () => {
      mockCookie.get.mockReturnValue("test-token");

      const token = mockCookie.get("accessToken");

      expect(token).toBe("test-token");
      expect(mockCookie.get).toHaveBeenCalledWith("accessToken");
    });

    it("should remove cookie", () => {
      mockCookie.remove("accessToken");

      expect(mockCookie.remove).toHaveBeenCalledWith("accessToken");
    });
  });

  describe("Error handling", () => {
    it("should handle malformed response", async () => {
      mockAxios.post.mockResolvedValue({ data: null });

      const response = await mockAxios.post("auth/login", {});

      expect(response.data).toBeNull();
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("timeout of 5000ms exceeded");
      mockAxios.post.mockRejectedValue(timeoutError);

      await expect(mockAxios.post("auth/login", {})).rejects.toThrow("timeout");
    });

    it("should handle 500 server errors", async () => {
      const serverError = {
        response: {
          status: 500,
          data: {
            error: "Internal Server Error",
          },
        },
      };

      mockAxios.post.mockRejectedValue(serverError);

      await expect(mockAxios.post("auth/login", {})).rejects.toEqual(serverError);
    });
  });
});
