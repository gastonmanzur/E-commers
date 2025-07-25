import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => alert('Error al cargar producto'));
  }, [id]);

  if (!product) return <div className="container mt-5">Cargando...</div>;

  return (
    <div className="container mt-5">
      <h2>{product.name}</h2>
      <p className="text-muted">${product.price}</p>
      <p>{product.description}</p>
      <div className="d-flex flex-wrap">
        {product.images && product.images.map((img, idx) => (
          <img key={idx} src={img} alt={product.name} className="me-2 mb-2" style={{maxWidth:'200px'}} />
        ))}
      </div>
    </div>
  );
}
