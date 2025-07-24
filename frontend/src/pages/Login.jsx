import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      alert('Login exitoso');
    } catch (err) {
      alert(err.response.data.message || 'Error al iniciar sesión');
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: async (response) => {
          try {
            const res = await axios.post('http://localhost:5000/api/users/google-login', { token: response.credential });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            alert('Login exitoso');
          } catch (err) {
            alert(err.response?.data?.message || 'Error al iniciar sesi\u00f3n');
          }
        }
      });
      window.google.accounts.id.renderButton(document.getElementById('googleBtn'), { theme: 'outline', size: 'large' });
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleLogin} className="p-4 border rounded bg-light">
            <h2 className="mb-4 text-center">Iniciar Sesión</h2>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">
              Entrar
            </button>
            <button
              type="button"
              className="btn btn-link w-100"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
            <div id="googleBtn" className="d-flex justify-content-center mt-3"></div>
          </form>
        </div>
      </div>
    </div>
  );
}
