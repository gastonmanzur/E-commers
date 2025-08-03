import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem, reserveItem } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => alert('Error al cargar producto'));
  }, [id]);

  if (!product) return <div className="container mt-5">Cargando...</div>;

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos');
      navigate('/login');
      return;
    }
    const quantity = Number(qty);
    if (quantity <= 0) return;
    if (quantity > product.stock) {
      alert('No hay suficiente stock');
      return;
    }
    await addItem(product, quantity);
    setProduct(p => ({ ...p, stock: p.stock - quantity }));
    setQty(1);
  };

  const handleReserve = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para reservar productos');
      navigate('/login');
      return;
    }
    const quantity = Number(qty);
    if (quantity <= 0) return;
    await reserveItem(product, quantity);
    setQty(1);
  };

  return (
    <div className="container mt-5">
      <h2>{product.name}</h2>
      <p className="text-muted">${product.price}</p>
      <p className="text-muted">Stock: {product.stock}</p>
      <p>{product.description}</p>
      <div className="d-flex flex-wrap">
        {product.images && product.images.map((img, idx) => (
          <img key={idx} src={img} alt={product.name} className="me-2 mb-2" style={{maxWidth:'200px'}} />
        ))}
      </div>
      <div className="input-group mt-3 mb-2" style={{maxWidth:'120px'}}>
        <input
          type="number"
          min="1"
          className="form-control"
          value={qty}
          onChange={e => setQty(e.target.value)}
        />
      </div>
      {product.stock > 0 ? (
        <button
          type="button"
          className="btn btn-primary"
          disabled={!localStorage.getItem('token')}
          onClick={handleAdd}
        >
          Agregar al carrito
        </button>
      ) : product.allowReservation ? (
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={!localStorage.getItem('token')}
          onClick={handleReserve}
        >
          Reservar
        </button>
      ) : (
        <button type="button" className="btn btn-secondary" disabled>Sin stock</button>
      )}
    </div>
  );
}
