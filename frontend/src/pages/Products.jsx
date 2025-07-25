import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Error al obtener productos'));
  }, []);

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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={e => {
                    e.stopPropagation();
                    addItem(prod);
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
