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

  return (
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: '#FFC9C9' }}
      >
      <div className="container flex-column">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">
            Ana<strong>Roma</strong>
          </Link>
          <div className="d-flex align-items-center">
            <Link
              className="position-relative me-3"
              to="/cart"
            >
              <i className="bi bi-cart" style={{ fontSize: '1.6rem' }} />
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
                <>
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
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm me-2"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
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
          </div>
        </div>
        <form
          className="d-flex my-2 mx-auto"
          style={{ width: '50vw' }}
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
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0">
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
                  <Link className="nav-link" to="/admin/orders">
                    Órdenes
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
