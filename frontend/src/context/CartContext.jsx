import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(i => i.product && i.quantity)) {
        return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = async (product, quantity) => {
    await axios.patch(`http://localhost:5000/api/products/${product._id}/stock`, { change: -quantity });
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) {
        return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = async (productId, quantity) => {
    await axios.patch(`http://localhost:5000/api/products/${productId}/stock`, { change: quantity });
    setItems(prev => prev.filter(i => i.product._id !== productId));
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
