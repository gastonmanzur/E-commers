import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data))
      .catch(() => alert('Error al obtener órdenes'));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Órdenes</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.user?.name}</td>
              <td>${o.total}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
