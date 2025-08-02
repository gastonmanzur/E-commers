import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Home() {
  const [promos, setPromos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [overlayColor, setOverlayColor] = useState('255,234,245');
  const [featured, setFeatured] = useState([]);
  const [highlightCategory, setHighlightCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryPreviews, setCategoryPreviews] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/promotions')
      .then(res => setPromos(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/featured')
      .then(res => setFeatured(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/highlight-category')
      .then(res => {
        const cat = res.data?.category;
        if (cat) {
          setHighlightCategory(cat);
          axios.get('http://localhost:5000/api/products', { params: { category: cat } })
            .then(r => setCategoryProducts(r.data))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const [prodRes, imgRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/category-images'),
        ]);
        const products = prodRes.data;
        const categorized = products.reduce((acc, p) => {
          if (p.category) {
            acc[p.category] = acc[p.category] || [];
            acc[p.category].push(p);
          }
          return acc;
        }, {});
        setProductsByCategory(categorized);
        const imgMap = imgRes.data.reduce((acc, cur) => {
          acc[cur.category] = cur.image;
          return acc;
        }, {});
        const categories = Object.keys(categorized);
        const previews = categories.slice(0, 3).map(cat => {
          const catProducts = categorized[cat];
          const mainImage = imgMap[cat] || catProducts[0]?.images?.[0] || null;
          const images = catProducts.slice(0, 4).map(p => p.images?.[0]).filter(Boolean);
          return { category: cat, mainImage, images };
        });
        setCategoryPreviews(previews);
      } catch {
        // ignore
      }
    };
    fetchPreviews();
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
                  <div
                    className="card h-100 promo-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const productId = promo.products?.[0]?._id || promo.products?.[0];
                      if (productId) navigate(`/products/${productId}`);
                    }}
                  >
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
      <div className="featured-section mt-4">
        <div className="container">
          <div className="row g-0 justify-content-center">
            {Array.from({ length: 6 }).map((_, i) => {
              const prod = featured[i];
              if (!prod) {
                return (
                  <div key={i} className="col-6 col-md-2">
                    <div className="card h-100 featured-card" />
                  </div>
                );
              }
              const images = prod.images || [];
              const img = images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
              return (
                <div key={prod._id} className="col-6 col-md-2">
                  <div
                    className="card h-100 featured-card text-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${prod._id}`)}
                  >
                    <div className="card-body d-flex flex-column align-items-center p-2">
                      <h6 className="card-title mb-2">{prod.name}</h6>
                      {img && (
                        <img src={img} alt={prod.name} className="featured-img mb-2" style={{ objectFit: 'cover' }} />
                      )}
                      <p className="card-text mb-1">{prod.description}</p>
                      <p className="card-text fw-bold mb-0">${prod.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {highlightCategory && (
        <div className="featured-section mt-4">
          <div className="container">
            <h4 className="text-center mb-3">{highlightCategory}</h4>
            <div className="row g-0 justify-content-center">
              {Array.from({ length: 6 }).map((_, i) => {
                const prod = categoryProducts[i];
                if (!prod) {
                  return (
                    <div key={i} className="col-6 col-md-2">
                      <div className="card h-100 featured-card" />
                    </div>
                  );
                }
                const images = prod.images || [];
                const img = images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
                return (
                  <div key={prod._id} className="col-6 col-md-2">
                    <div
                      className="card h-100 featured-card text-center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${prod._id}`)}
                    >
                      <div className="card-body d-flex flex-column align-items-center p-2">
                        <h6 className="card-title mb-2">{prod.name}</h6>
                        {img && (
                          <img src={img} alt={prod.name} className="featured-img mb-2" style={{ objectFit: 'cover' }} />
                        )}
                        <p className="card-text mb-1">{prod.description}</p>
                        <p className="card-text fw-bold mb-0">${prod.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {categoryPreviews.length > 0 && (
        <>
          <div className="featured-section mt-4 mb-5">
            <div className="container">
              <div className="row g-3 justify-content-center">
                {categoryPreviews.map(preview => (
                  <div key={preview.category} className="col-12 col-md-4">
                    <div className="card category-card text-center">
                      <div className="card-body d-flex flex-column p-2">
                        <h6 className="card-title mb-2">{preview.category}</h6>
                        {preview.mainImage && (
                          <img
                            src={preview.mainImage}
                            alt={preview.category}
                            className="category-main-img mb-1"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                        <div className="d-flex justify-content-between gap-1 mt-1 mb-0">
                          {preview.images.slice(0, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${preview.category}-${idx}`}
                              className="category-thumb"
                              style={{ objectFit: 'cover', cursor: 'pointer' }}
                              onClick={() => navigate(`/products?category=${encodeURIComponent(preview.category)}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {categoryPreviews.map(preview => (
            <div key={`${preview.category}-products`} className="featured-section mt-4">
              <div className="container">
                <h4 className="text-center mb-3">{preview.category}</h4>
                <div className="row g-0 justify-content-center">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const prod = (productsByCategory[preview.category] || [])[i];
                    if (!prod) {
                      return (
                        <div key={i} className="col-6 col-md-2">
                          <div className="card h-100 featured-card" />
                        </div>
                      );
                    }
                    const images = prod.images || [];
                    const img = images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
                    return (
                      <div key={prod._id} className="col-6 col-md-2">
                        <div
                          className="card h-100 featured-card text-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/products/${prod._id}`)}
                        >
                          <div className="card-body d-flex flex-column align-items-center p-2">
                            <h6 className="card-title mb-2">{prod.name}</h6>
                            {img && (
                              <img
                                src={img}
                                alt={prod.name}
                                className="featured-img mb-2"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                            <p className="card-text mb-1">{prod.description}</p>
                            <p className="card-text fw-bold mb-0">${prod.price}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
