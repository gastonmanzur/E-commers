import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useContext } from 'react';
import CartContext from '../context/CartContext.jsx';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name') || '';
  const storedAvatar = localStorage.getItem('avatar');
  const [avatar, setAvatar] = useState(storedAvatar);
  const fileInputRef = useRef(null);
  const { items } = useContext(CartContext);
  const [search, setSearch] = useState('');

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    setAvatar('');
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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Ana<strong>Roma</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Productos
              </Link>
            </li>
            {role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/add-product">
                  Agregar producto
                </Link>
              </li>
            )}
          </ul>
          {token && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mb-2 mb-lg-0"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}
        </div>
        <form
          className="d-flex me-lg-3 mb-2 mb-lg-0"
          onSubmit={handleSearch}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            Buscar
          </button>
        </form>
        <Link
          className="position-relative me-lg-3 mb-2 mb-lg-0"
          to="/cart"
        >
          <i className="bi bi-cart" style={{ fontSize: '1.2rem' }} />
          {cartCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.6rem' }}
            >
              {cartCount}
            </span>
          )}
        </Link>
        {token && (
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center me-2"
              style={{
                width: '40px',
                height: '40px',
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
          </div>
        )}
      </div>
    </nav>
  );
}
