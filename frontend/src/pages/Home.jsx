import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Home() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/promotions')
      .then(res => setPromos(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Bienvenido</h1>
      <p className="lead text-center">
        Aquí se mostrarán ofertas, promociones y productos destacados.
      </p>
      {promos.length > 0 && (
        <div className="mt-4">
          <h3>Promociones</h3>
          <div className="row">
            {promos.map(promo => (
              <div key={promo._id} className="col-sm-6 col-md-4 mb-3">
                <div className="card h-100">
                  {promo.image && (
                    <img
                      src={promo.image}
                      className="card-img-top"
                      alt={promo.name}
                      style={{ maxHeight: '150px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{promo.name}</h5>
                    <p className="card-text">${promo.price}</p>
                    {promo.description && (
                      <p className="card-text">{promo.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
