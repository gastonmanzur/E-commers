import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useContext } from 'react';
import CartContext from '../context/CartContext.jsx';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
  const fileInputRef = useRef(null);
  const { items } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync component state with localStorage when user logs in or out
  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
      setName(localStorage.getItem('name') || '');
      setAvatar(localStorage.getItem('avatar') || '');
    };
    handler();
    window.addEventListener('userchange', handler);
    return () => window.removeEventListener('userchange', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('avatar');
    setAvatar(stored || '');
  }, [token]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`,
            );
            const data = await res.json();
            const city =
              data.city ||
              data.locality ||
              data.principalSubdivision ||
              'ubicación desconocida';
            setUserLocation(city);
          } catch (err) {
            console.error(err);
            setUserLocation('ubicación desconocida');
          }
        },
        () => setUserLocation('ubicación desconocida'),
      );
    } else {
      setUserLocation('ubicación no disponible');
    }
  }, []);

  useEffect(() => {
    const nav = document.getElementById('navbarNav');
    if (!nav) return undefined;
    const handleShown = () => setIsMenuOpen(true);
    const handleHidden = () => setIsMenuOpen(false);
    nav.addEventListener('shown.bs.collapse', handleShown);
    nav.addEventListener('hidden.bs.collapse', handleHidden);
    return () => {
      nav.removeEventListener('shown.bs.collapse', handleShown);
      nav.removeEventListener('hidden.bs.collapse', handleHidden);
    };
  }, []);

  const { clearCart } = useContext(CartContext);

  const handleLogout = () => {
    // Preserve the user's cart by keeping the cart_<id> entry in localStorage
    // Clear the current session and switch to an empty guest cart
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    localStorage.removeItem('userId');
    setAvatar('');
    setToken(null);
    setRole(null);
    setName('');
    clearCart();
    window.dispatchEvent(new Event('userchange'));
    navigate('/login');
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setAvatar(base64);
      localStorage.setItem('avatar', base64);
      try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/users/avatar', { avatar: base64 }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const initial = name.charAt(0).toUpperCase();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const promoContainerStyle = {
    width: '240px',
    lineHeight: 1,
    textAlign: 'center',
  };

  const promoTopStyle = {
    backgroundColor: '#e53752',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    width: '100%',
    fontFamily: '"Dream avenue", sans-serif',
    color: '#fff3f5',
    padding: '4px',
    fontSize: '0.8rem',
  };

  const promoBottomStyle = {
    backgroundColor: '#fff3f5',
    color: '#e53752',
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '8px',
    width: '100%',
    fontFamily: '"Dream avenue", sans-serif',
    padding: '4px',
    fontSize: '0.8rem',
  };

  const navLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/products">
          Productos
        </Link>
      </li>
      {role === 'admin' && (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/add-product">
              Agregar producto
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/promos">
              Promociones
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/category">
              Categoría destacada
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/orders">
              Órdenes
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: '#FFC9C9' }}
      >
      <div className="container flex-column">
        <div className="w-100 d-flex align-items-center justify-content-between">
          <Link className="navbar-brand" to="/" style={{ fontSize: '1.5625rem' }}>
            Ana<strong>Roma</strong>
          </Link>
          <form
            className="d-flex flex-grow-1 mx-3 search-form"
            onSubmit={handleSearch}
          >
            <input
              className="form-control me-2 flex-grow-1"
              type="search"
              placeholder="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              Buscar
            </button>
          </form>
          <div className="d-none d-md-flex flex-column align-items-center ms-3" style={promoContainerStyle}>
            <div style={promoTopStyle}>PROMOCIONES Y DESCUENTOS</div>
            <div style={promoBottomStyle}>En cada compra</div>
          </div>
        </div>
        <div className="w-100 d-flex align-items-center justify-content-between mt-2">
          <div className="d-flex align-items-center flex-grow-1">
            <div
              className="ps-2 d-flex align-items-center flex-lg-column align-items-lg-start me-3"
              style={{ fontSize: '0.95rem' }}
            >
              <div className="d-flex align-items-center">
                <i className="bi bi-geo-alt-fill me-1" />
                <span>Enviar a</span>
              </div>
              <span className="ms-1 ms-lg-0">{userLocation || '...'}</span>
            </div>
            <ul className="navbar-nav d-none d-lg-flex flex-row mx-auto">
              {navLinks}
            </ul>
          </div>
          <div className="d-flex align-items-center ms-3">
            <Link className="position-relative me-2 me-lg-3" to="/cart">
              <i className="bi bi-cart" style={{ fontSize: '2.4rem' }} />
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="d-none d-lg-flex align-items-center">
              {token ? (
                <>
                  <div
                    className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center me-2"
                    style={{
                      width: '42px',
                      height: '42px',
                      border: '1px solid black',
                      cursor: 'pointer',
                    }}
                    onClick={handleAvatarClick}
                  >
                    {avatar ? (
                      <img src={avatar} alt="Usuario" className="w-100 h-100" />
                    ) : (
                      <span className="fw-bold">{initial}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="d-none"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm me-2"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-sm me-2"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline-light btn-sm me-2"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
            <button
              className="navbar-toggler ms-2 d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              aria-label="Toggle navigation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <i className="bi bi-x-lg" /> : <i className="bi bi-list" />}
            </button>
          </div>
        </div>
        <div className="collapse navbar-collapse mt-2" id="navbarNav">
          <div className="d-lg-none d-flex w-100">
            {token && (
              <div className="d-flex flex-column justify-content-center me-3">
                <div
                  className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                  style={{ width: '42px', height: '42px', border: '1px solid black', cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                >
                  {avatar ? <img src={avatar} alt="Usuario" className="w-100 h-100" /> : <span className="fw-bold">{initial}</span>}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="d-none"
                  />
                </div>
              </div>
            )}
            <div className="flex-grow-1 d-flex flex-column">
              <ul className="navbar-nav flex-column mb-2">{navLinks}</ul>
              <div className="mt-auto text-center mb-2">
                {token ? (
                  <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-outline-light btn-sm me-2">
                      Iniciar sesión
                    </Link>
                    <Link to="/register" className="btn btn-outline-light btn-sm">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
