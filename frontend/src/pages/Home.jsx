import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Home() {
  const [promos, setPromos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [overlayColor, setOverlayColor] = useState('255,234,245');

  useEffect(() => {
    axios.get('http://localhost:5000/api/promotions')
      .then(res => setPromos(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const carouselElement = document.getElementById('homeCarousel');
    if (!carouselElement) return;

    const updateOverlayColor = () => {
      const activeImg = carouselElement.querySelector('.carousel-item.active img');
      if (!activeImg) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeImg.src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const { data } = ctx.getImageData(0, img.height - 10, img.width, 10);
        let r = 0; let g = 0; let b = 0; let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        setOverlayColor(`${r},${g},${b}`);
      };
    };

    updateOverlayColor();
    carouselElement.addEventListener('slid.bs.carousel', updateOverlayColor);
    return () => carouselElement.removeEventListener('slid.bs.carousel', updateOverlayColor);
  }, []);

  const handleNext = () => {
    if (promos.length > 6) {
      setStartIndex((prev) => (prev + 6) % promos.length);
    }
  };

  const visiblePromos = Array.from(
    { length: Math.min(6, promos.length) },
    (_, i) => promos[(startIndex + i) % promos.length],
  );

  return (
    <>
      <div className="carousel-wrapper">
        <div className="container-fluid p-0">
          <div
            id="homeCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="http://localhost:5000/uploads/carousel1.png"
                  className="d-block w-100"
                  alt="Slide 1"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="http://localhost:5000/uploads/carousel2.png"
                  className="d-block w-100"
                  alt="Slide 2"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="http://localhost:5000/uploads/carousel3.png"
                  className="d-block w-100"
                  alt="Slide 3"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="http://localhost:5000/uploads/carousel4.png"
                  className="d-block w-100"
                  alt="Slide 4"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="http://localhost:5000/uploads/carousel5.png"
                  className="d-block w-100"
                  alt="Slide 5"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
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
        <div
          className="carousel-overlay"
          style={{ background: `linear-gradient(to bottom, rgba(${overlayColor},1) 0%, rgba(${overlayColor},0) 100%)` }}
        />
      </div>

      {promos.length > 0 && (
        <div className="container mt-5 promo-slider-wrapper">
          <div className="position-relative">
            <div className="row g-3 justify-content-center">
              {visiblePromos.map((promo) => (
                <div key={promo._id} className="col-6 col-md-2">
                  <div className="card h-100 promo-card">
                    {promo.image && (
                      <img
                        src={promo.image}
                        className="card-img-top"
                        alt={promo.name}
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1">{promo.name}</h6>
                      <p className="card-text mb-1">${promo.price}</p>
                      {promo.description && (
                        <small className="text-muted">{promo.description}</small>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {promos.length > 6 && (
              <button
                type="button"
                className="btn btn-primary promo-next-btn position-absolute top-50 end-0 translate-middle-y"
                onClick={handleNext}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
