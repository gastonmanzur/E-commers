import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        alert('Las contrase\u00f1as no coinciden');
        return;
      }
      const res = await axios.post('http://localhost:5000/api/users/register', form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message || 'Error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
            <h2 className="mb-4 text-center">Registro</h2>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
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
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirmar contraseña"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">
              Registrarse
            </button>
            <button
              type="button"
              className="btn btn-link w-100"
              onClick={() => navigate('/login')}
            >
              Ya tienes cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
