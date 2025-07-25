import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name') || '';
  const storedAvatar = localStorage.getItem('avatar');
  const [avatar, setAvatar] = useState(storedAvatar);
  const fileInputRef = useRef(null);

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

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand me-3" to="/">
            Ana<strong>Roma</strong>
          </Link>
          <Link className="me-3" to="/products">Productos</Link>
          {role === 'admin' && (
            <Link className="me-3" to="/add-product">Agregar producto</Link>
          )}
        </div>
        {token && (
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center me-2"
              style={{ width: '40px', height: '40px', border: '1px solid black', cursor: 'pointer' }}
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
              className="btn btn-outline-secondary btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
