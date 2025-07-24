import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name') || '';
  const picture = localStorage.getItem('picture');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('picture');
    navigate('/login');
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container d-flex justify-content-between">
        <Link className="navbar-brand" to="/">
          Ana<strong>Roma</strong>
        </Link>
        {token && (
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center me-2"
              style={{ width: '40px', height: '40px' }}
            >
              {picture ? (
                <img src={picture} alt="Usuario" className="w-100 h-100" />
              ) : (
                <span className="fw-bold">{initial}</span>
              )}
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
