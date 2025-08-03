import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

// Helper to build the storage key based on the current user id
const cartKey = () => {
  const id = localStorage.getItem('userId');
  return id ? `cart_${id}` : 'cart_guest';
};

export function CartProvider({ children }) {
  const loadCart = () => {
    const stored = localStorage.getItem(cartKey());
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(i => i.product && i.quantity)) {
        return parsed;
      }
    } catch {
      // ignore parse errors
      return [];
    }
    return [];
  };

  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(cartKey(), JSON.stringify(items));
  }, [items]);

  // Reload cart when user changes (e.g., login/logout)
  useEffect(() => {
    const handler = () => setItems(loadCart());
    window.addEventListener('userchange', handler);
    return () => window.removeEventListener('userchange', handler);
  }, []);

  const addItem = async (product, quantity) => {
    await axios.patch(`http://localhost:5000/api/products/${product._id}/stock`, { change: -quantity });
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id && !i.reserved);
      if (existing) {
        return prev.map(i => i.product._id === product._id && !i.reserved ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity, reserved: false }];
    });
  };

  const reserveItem = (product, quantity) => {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id && i.reserved);
      if (existing) {
        return prev.map(i => i.product._id === product._id && i.reserved ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity, reserved: true }];
    });
  };

  const removeItem = async (productId, quantity, reserved) => {
    if (!reserved) {
      await axios.patch(`http://localhost:5000/api/products/${productId}/stock`, { change: quantity });
    }
    setItems(prev => prev.filter(i => !(i.product._id === productId && i.reserved === reserved)));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(cartKey());
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, reserveItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
