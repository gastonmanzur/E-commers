import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
            <div className="card h-100" onClick={() => navigate(`/products/${prod._id}`)} style={{cursor:'pointer'}}>
              {prod.images && prod.images[0] && (
                <img src={prod.images[0]} className="card-img-top" alt={prod.name} />
              )}
              <div className="card-body">
                <h5 className="card-title">{prod.name}</h5>
                <p className="card-text">${prod.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
