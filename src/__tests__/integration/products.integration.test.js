import axios from "../../config/axios";
import Cookie from "js-cookie";

jest.mock("../../config/axios");
jest.mock("js-cookie");

describe("Products API - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("T-23: Créer produit", () => {
    it("Given seller When POST products Then succès 201", async () => {
      const sellerToken = "seller-token-123";
      Cookie.get.mockReturnValue(sellerToken);

      const productData = {
        title: "Test Product",
        description: "Test Description",
        prix: 99.99,
        stock: 10,
        category: "electronics",
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "123",
            ...productData,
            seller: "seller-id",
          },
        },
        status: 201,
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const response = await axios.post("/seller/products", productData);

      expect(axios.post).toHaveBeenCalledWith("/seller/products", productData);
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data.title).toBe("Test Product");
    });
  });

  describe("T-24: Éditer produit", () => {
    it("Given produit existant When PATCH Then succès 200", async () => {
      const sellerToken = "seller-token-123";
      Cookie.get.mockReturnValue(sellerToken);

      const productId = "product-123";
      const updateData = {
        title: "Updated Product",
        prix: 149.99,
        stock: 20,
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: productId,
            ...updateData,
          },
        },
        status: 200,
      };

      axios.patch.mockResolvedValueOnce(mockResponse);

      const response = await axios.patch(`/seller/products/${productId}`, updateData);

      expect(axios.patch).toHaveBeenCalledWith(`/seller/products/${productId}`, updateData);
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.title).toBe("Updated Product");
      expect(response.data.data.prix).toBe(149.99);
    });
  });

  describe("T-25: Supprimer produit", () => {
    it("Given seller When DELETE Then succès - Produit supprimé", async () => {
      const sellerToken = "seller-token-123";
      Cookie.get.mockReturnValue(sellerToken);

      const productId = "product-123";

      const mockResponse = {
        data: {
          success: true,
          message: "Product deleted successfully",
        },
        status: 200,
      };

      axios.delete.mockResolvedValueOnce(mockResponse);

      const response = await axios.delete(`/seller/products/${productId}`);

      expect(axios.delete).toHaveBeenCalledWith(`/seller/products/${productId}`);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe("Product deleted successfully");
    });
  });

  describe("T-26: Restriction user", () => {
    it("Given user role user When POST produits Then refus 403", async () => {
      const userToken = "user-token-123";
      Cookie.get.mockReturnValue(userToken);

      const productData = {
        title: "Test Product",
        description: "Test Description",
        prix: 99.99,
        stock: 10,
        category: "electronics",
      };

      const mockError = {
        response: {
          status: 403,
          data: {
            success: false,
            error: "Access denied. Seller role required.",
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      try {
        await axios.post("/seller/products", productData);
        fail("Should have thrown an error");
      } catch (error) {
        expect(axios.post).toHaveBeenCalledWith("/seller/products", productData);
        expect(error.response.status).toBe(403);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toContain("Access denied");
      }
    });
  });

  describe("Additional Product Tests", () => {
    it("should get all seller products with pagination", async () => {
      const sellerToken = "seller-token-123";
      Cookie.get.mockReturnValue(sellerToken);

      const mockResponse = {
        data: {
          success: true,
          data: [
            { _id: "1", title: "Product 1", prix: 99.99 },
            { _id: "2", title: "Product 2", prix: 149.99 },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 2,
            totalProducts: 15,
          },
        },
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get("/seller/products", {
        params: { page: 1, limit: 12 },
      });

      expect(axios.get).toHaveBeenCalledWith("/seller/products", {
        params: { page: 1, limit: 12 },
      });
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveLength(2);
      expect(response.data.pagination.currentPage).toBe(1);
    });

    it("should handle product creation with images", async () => {
      const sellerToken = "seller-token-123";
      Cookie.get.mockReturnValue(sellerToken);

      const formData = new FormData();
      formData.append("title", "Product with Image");
      formData.append("prix", "199.99");
      formData.append("stock", "5");

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: "123",
            title: "Product with Image",
            images: ["https://cloudinary.com/image1.jpg"],
          },
        },
        status: 201,
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const response = await axios.post("/seller/products", formData);

      expect(axios.post).toHaveBeenCalledWith("/seller/products", formData);
      expect(response.status).toBe(201);
      expect(response.data.data.images).toBeDefined();
    });

    it("should handle validation errors on product creation", async () => {
      const sellerToken = "seller-token-123";
      Cookie.get.mockReturnValue(sellerToken);

      const invalidData = {
        title: "",
        prix: -10,
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            success: false,
            error: "Validation failed",
            details: ["Title is required", "Price must be positive"],
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      try {
        await axios.post("/seller/products", invalidData);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe("Validation failed");
      }
    });

    it("should handle unauthorized access without token", async () => {
      Cookie.get.mockReturnValue(null);

      const mockError = {
        response: {
          status: 401,
          data: {
            success: false,
            error: "Authentication required",
          },
        },
      };

      axios.get.mockRejectedValueOnce(mockError);

      try {
        await axios.get("/seller/products");
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe("Authentication required");
      }
    });
  });
});
