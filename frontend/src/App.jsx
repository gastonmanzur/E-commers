import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AddProduct from './pages/AddProduct.jsx';
import AdminPromos from './pages/AdminPromos.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import Cart from './pages/Cart.jsx';
import Navbar from './components/Navbar.jsx';
import { CartProvider } from './context/CartContext.jsx';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'));
    window.addEventListener('userchange', handler);
    return () => window.removeEventListener('userchange', handler);
  }, []);

  return (
    <CartProvider>
      <Router>
        {token && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/admin/promos" element={<AdminPromos />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
