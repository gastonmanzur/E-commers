import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Error al obtener productos'));
  }, []);

  const handleAdd = async (prod) => {
    const qty = Number(quantities[prod._id] || 1);
    if (qty <= 0) return;
    if (qty > prod.stock) {
      alert('No hay suficiente stock');
      return;
    }
    await addItem(prod, qty);
    setProducts(prev => prev.map(p => p._id === prod._id ? { ...p, stock: p.stock - qty } : p));
    setQuantities(q => ({ ...q, [prod._id]: 1 }));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Productos</h2>
      <div className="row">
        {products.map(prod => (
          <div className="col-md-4 mb-3" key={prod._id}>
            <div className="card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${prod._id}`)}>
              {prod.images && prod.images.length > 0 && (
                <div id={`carousel-${prod._id}`} className="carousel slide">
                  <div className="carousel-inner">
                    {prod.images.map((img, idx) => (
                      <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}> 
                        <img src={img} className="d-block w-100" alt={prod.name} />
                      </div>
                    ))}
                  </div>
                  {prod.images.length > 1 && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${prod._id}`} data-bs-slide="prev" onClick={e => e.stopPropagation()}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${prod._id}`} data-bs-slide="next" onClick={e => e.stopPropagation()}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{prod.name}</h5>
                <p className="card-text">${prod.price}</p>
                <p className="card-text">Stock: {prod.stock}</p>
                <div className="input-group mb-2">
                  <input type="number" min="1" className="form-control" style={{maxWidth:'80px'}}
                    value={quantities[prod._id] || 1}
                    onChange={e => setQuantities(q => ({ ...q, [prod._id]: e.target.value }))} onClick={e=>e.stopPropagation()} />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={e => {
                    e.stopPropagation();
                    handleAdd(prod);
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
