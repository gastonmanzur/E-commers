import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('token', res.data.token);
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
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Entrar</button>
      <div id="googleBtn" style={{ marginTop: '1rem' }}></div>
    </form>
  );
}
