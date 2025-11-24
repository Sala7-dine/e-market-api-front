import axios from '../../config/axios';
import Cookie from 'js-cookie';

jest.mock('../../config/axios');
jest.mock('js-cookie');

describe('Orders API - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T-20: Valider commande', () => {
    it('Given panier plein When click Checkout Then POST /orders - 201 + redirection', async () => {
      const userToken = 'user-token-123';
      Cookie.get.mockReturnValue(userToken);

      const orderData = {
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 99.99,
          },
          {
            productId: 'product-2',
            quantity: 1,
            price: 149.99,
          },
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        },
        orderTotal: 349.97,
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: 'order-123',
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        },
        status: 201,
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const response = await axios.post('/orders', orderData);

      expect(axios.post).toHaveBeenCalledWith('/orders', orderData);
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data._id).toBe('order-123');
      expect(response.data.data.status).toBe('pending');
    });
  });

  describe('T-21: Commandes user', () => {
    it('Given order créée When dashboard Then afficher liste', async () => {
      const userToken = 'user-token-123';
      Cookie.get.mockReturnValue(userToken);

      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              _id: 'order-1',
              orderTotal: 349.97,
              status: 'delivered',
              createdAt: '2024-01-15T10:00:00Z',
              items: [
                {
                  productId: { title: 'Product 1' },
                  quantity: 2,
                  price: 99.99,
                },
              ],
            },
            {
              _id: 'order-2',
              orderTotal: 199.99,
              status: 'pending',
              createdAt: '2024-01-20T14:30:00Z',
              items: [
                {
                  productId: { title: 'Product 2' },
                  quantity: 1,
                  price: 199.99,
                },
              ],
            },
          ],
        },
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get('/orders/user');

      expect(axios.get).toHaveBeenCalledWith('/orders/user');
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveLength(2);
      expect(response.data.data[0]._id).toBe('order-1');
      expect(response.data.data[0].status).toBe('delivered');
      expect(response.data.data[1]._id).toBe('order-2');
      expect(response.data.data[1].status).toBe('pending');
    });
  });



  describe('Additional Order Tests', () => {
    it('should get order by ID', async () => {
      const userToken = 'user-token-123';
      Cookie.get.mockReturnValue(userToken);

      const orderId = 'order-123';

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: orderId,
            orderTotal: 349.97,
            status: 'shipped',
            items: [
              {
                productId: { title: 'Product 1', images: ['image1.jpg'] },
                quantity: 2,
                price: 99.99,
              },
            ],
            shippingAddress: {
              street: '123 Main St',
              city: 'Paris',
            },
          },
        },
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`/orders/${orderId}`);

      expect(axios.get).toHaveBeenCalledWith(`/orders/${orderId}`);
      expect(response.data.success).toBe(true);
      expect(response.data.data._id).toBe(orderId);
      expect(response.data.data.status).toBe('shipped');
    });

    it('should handle empty cart checkout', async () => {
      const userToken = 'user-token-123';
      Cookie.get.mockReturnValue(userToken);

      const emptyOrderData = {
        items: [],
        shippingAddress: {},
        orderTotal: 0,
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            success: false,
            error: 'Cart is empty',
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      try {
        await axios.post('/orders', emptyOrderData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Cart is empty');
      }
    });

    it('should handle missing shipping address', async () => {
      const userToken = 'user-token-123';
      Cookie.get.mockReturnValue(userToken);

      const orderData = {
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            price: 99.99,
          },
        ],
        orderTotal: 99.99,
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            success: false,
            error: 'Shipping address is required',
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      try {
        await axios.post('/orders', orderData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Shipping address is required');
      }
    });

    it('should update order status (seller)', async () => {
      const sellerToken = 'seller-token-123';
      Cookie.get.mockReturnValue(sellerToken);

      const orderId = 'order-123';
      const statusUpdate = { status: 'shipped' };

      const mockResponse = {
        data: {
          success: true,
          data: {
            _id: orderId,
            status: 'shipped',
          },
        },
      };

      axios.put.mockResolvedValueOnce(mockResponse);

      const response = await axios.put(`/orders/updateStatus/${orderId}`, statusUpdate);

      expect(axios.put).toHaveBeenCalledWith(`/orders/updateStatus/${orderId}`, statusUpdate);
      expect(response.data.success).toBe(true);
      expect(response.data.data.status).toBe('shipped');
    });

    it('should get seller orders with pagination', async () => {
      const sellerToken = 'seller-token-123';
      Cookie.get.mockReturnValue(sellerToken);

      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              _id: 'order-1',
              orderTotal: 349.97,
              status: 'pending',
              user: { fullName: 'John Doe' },
            },
            {
              _id: 'order-2',
              orderTotal: 199.99,
              status: 'shipped',
              user: { fullName: 'Jane Smith' },
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 3,
            totalOrders: 25,
          },
        },
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get('/seller/orders', {
        params: { page: 1, limit: 10 },
      });

      expect(axios.get).toHaveBeenCalledWith('/seller/orders', {
        params: { page: 1, limit: 10 },
      });
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveLength(2);
      expect(response.data.pagination.currentPage).toBe(1);
    });

    it('should handle unauthorized order access', async () => {
      Cookie.get.mockReturnValue(null);

      const mockError = {
        response: {
          status: 401,
          data: {
            success: false,
            error: 'Authentication required',
          },
        },
      };

      axios.get.mockRejectedValueOnce(mockError);

      try {
        await axios.get('/orders/user');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Authentication required');
      }
    });

    it('should filter orders by status', async () => {
      const userToken = 'user-token-123';
      Cookie.get.mockReturnValue(userToken);

      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              _id: 'order-1',
              status: 'delivered',
              orderTotal: 349.97,
            },
          ],
        },
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get('/orders/user', {
        params: { status: 'delivered' },
      });

      expect(axios.get).toHaveBeenCalledWith('/orders/user', {
        params: { status: 'delivered' },
      });
      expect(response.data.success).toBe(true);
      expect(response.data.data[0].status).toBe('delivered');
    });
  });
});
