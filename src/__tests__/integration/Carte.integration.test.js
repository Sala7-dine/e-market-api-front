import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from '../../config/axios';
import cartReducer, { addToCart, updateProductQuantity, removeFromCart } from '../../features/cartSlice';
import Cart from '../../pages/Cart';

// Mock axios
jest.mock('../../config/axios');
const mockedAxios = axios;

// Mock data
const mockProduct = {
  _id: 'product123',
  title: 'Test Product',
  price: 29.99,
  images: ['test-image.jpg']
};

const mockCartResponse = {
  data: {
    data: [{
      _id: 'cart123',
      items: [{
        productId: mockProduct,
        quantity: 1,
        price: 29.99
      }]
    }]
  }
};

const TestWrapper = ({ children }) => {
  const store = configureStore({
    reducer: { cart: cartReducer }
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe('UT-10: Ajouter produit dans panier - Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add product to cart successfully', async () => {
    // Mock API responses
    mockedAxios.post.mockResolvedValueOnce({ data: mockCartResponse.data.data[0] });
    mockedAxios.get.mockResolvedValueOnce(mockCartResponse);

    const store = configureStore({
      reducer: { cart: cartReducer }
    });

    // Test addToCart action
    const result = await store.dispatch(addToCart({
      productId: 'product123',
      quantity: 1
    }));

    expect(result.type).toBe('cart/addToCart/fulfilled');
    expect(mockedAxios.post).toHaveBeenCalledWith('/carts/addtocart', {
      productId: 'product123',
      quantity: 1
    });
  });

  

  test('should handle add to cart API error', async () => {
    const store = configureStore({
      reducer: { cart: cartReducer }
    });

    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Product not found' } }
    });

    const result = await store.dispatch(addToCart({
      productId: 'invalid-id',
      quantity: 1
    }));

    expect(result.type).toBe('cart/addToCart/rejected');
    expect(result.payload).toEqual({ message: 'Product not found' });
  });

  test('should update product quantity successfully', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });

    const store = configureStore({
      reducer: { cart: cartReducer }
    });

    const result = await store.dispatch(updateProductQuantity({
      productId: 'product123',
      quantity: 3
    }));

    expect(result.type).toBe('cart/updateProductQuantity/fulfilled');
    expect(mockedAxios.put).toHaveBeenCalledWith('carts/updateCart/product123', {
      quantity: 3
    });
    expect(result.payload).toEqual({ productId: 'product123', quantity: 3 });
  });

  test('should remove product from cart successfully', async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    const store = configureStore({
      reducer: { cart: cartReducer }
    });

    const result = await store.dispatch(removeFromCart({
      productId: 'product123'
    }));

    expect(result.type).toBe('cart/removeFromCart/fulfilled');
    expect(mockedAxios.delete).toHaveBeenCalledWith('carts/deleteProduct/product123');
    expect(result.payload).toBe('product123');
  });

  test('should handle update quantity API error', async () => {
    const store = configureStore({
      reducer: { cart: cartReducer }
    });

    mockedAxios.put.mockRejectedValueOnce({
      response: { data: { message: 'Update failed' } }
    });

    const result = await store.dispatch(updateProductQuantity({
      productId: 'product123',
      quantity: 5
    }));

    expect(result.type).toBe('cart/updateProductQuantity/rejected');
    expect(result.payload).toEqual({ message: 'Update failed' });
  });

  test('should handle remove product API error', async () => {
    const store = configureStore({
      reducer: { cart: cartReducer }
    });

    mockedAxios.delete.mockRejectedValueOnce({
      response: { data: { message: 'Remove failed' } }
    });

    const result = await store.dispatch(removeFromCart({
      productId: 'product123'
    }));

    expect(result.type).toBe('cart/removeFromCart/rejected');
    expect(result.payload).toEqual({ message: 'Remove failed' });
  });
});