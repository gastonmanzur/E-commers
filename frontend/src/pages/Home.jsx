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
    <>
      <div className="container-fluid p-0 mt-3">
        <div
          id="homeCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="http://localhost:5000/uploads/carrousel1.png"
                className="d-block w-100"
                alt="Slide 1"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="http://localhost:5000/uploads/carrousel2.png"
                className="d-block w-100"
                alt="Slide 2"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="http://localhost:5000/uploads/carrousel3.png"
                className="d-block w-100"
                alt="Slide 3"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="http://localhost:5000/uploads/carrousel4.png"
                className="d-block w-100"
                alt="Slide 4"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="http://localhost:5000/uploads/carrousel5.png"
                className="d-block w-100"
                alt="Slide 5"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      <div className="container mt-5">
        <h1 className="mb-4 text-center">Bienvenido</h1>
        <p className="lead text-center">
          Aquí se mostrarán ofertas, promociones y productos destacados.
        </p>
        {promos.length > 0 && (
          <div className="mt-4">
            <h3>Promociones</h3>
            <div className="row">
              {promos.map((promo) => (
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
    </>
  );
}
