import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';
import axios from 'axios';

export default function Cart() {
  const { items, total, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePurchase = async () => {
    if (items.length === 0) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity, reserved: i.reserved }))
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Orden creada');
      clearCart();
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear orden');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mi Carrito</h2>
      {items.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {items.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {item.product.images && item.product.images.length > 0 && (
                    <img
                      src={item.product.images[Math.floor(Math.random() * item.product.images.length)]}
                      alt={item.product.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      className="me-2"
                    />
                  )}
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                </div>
                <div>
                  <span className="me-2">${item.product.price * item.quantity}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.product._id, item.quantity, item.reserved)}>X</button>
                </div>
              </li>
            ))}
          </ul>
          <h4>Total: ${total}</h4>
        </>
      )}
      <div className="mt-3">
        <button type="button" className="btn btn-primary me-2" onClick={handlePurchase}>
          Comprar Carrito
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/')}
        >
          Seguir Comprando
        </button>
      </div>
    </div>
  );
}
