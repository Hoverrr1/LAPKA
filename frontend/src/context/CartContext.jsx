import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/api/v1/cart');
        setCart(res.data.data);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setCart(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/v1/cart', { productId, quantity });
      setCart(res.data.data);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Не вдалося додати товар до кошика');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/api/v1/cart/${itemId}`, { quantity });
      setCart(res.data.data);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Не вдалося оновити кількість товару');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/api/v1/cart/${itemId}`);
      setCart(res.data.data);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Не вдалося видалити товар із кошика');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete('/api/v1/cart');
      setCart(null);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Не вдалося очистити кошик');
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.total || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
