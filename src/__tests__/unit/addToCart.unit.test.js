import { addToCart } from '../../features/cartSlice';
import axios from '../../config/axios';

jest.mock('../../config/axios');
const mockedAxios = axios;

describe('Unit: addToCart thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('dispatch resolves fulfilled when API succeeds', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { _id: 'cart123', items: [{ productId: 'product123', quantity: 1 }] }
    });

    const dispatch = jest.fn();
    const getState = () => ({});

    const action = await addToCart({ productId: 'product123', quantity: 1 })(dispatch, getState, undefined);

    expect(mockedAxios.post).toHaveBeenCalledWith('/carts/addtocart', { productId: 'product123', quantity: 1 });
    expect(action.type).toBe('cart/addToCart/fulfilled');
    
  });

  test('dispatch returns rejected when API fails', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message: 'Product not found' } } });

    const dispatch = jest.fn();
    const getState = () => ({});

    const action = await addToCart({ productId: 'invalid-id', quantity: 1 })(dispatch, getState, undefined);

    expect(action.type).toBe('cart/addToCart/rejected');
    expect(action.payload).toEqual({ message: 'Product not found' });
  });
});