import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

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
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <input type="password" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
      <button type="submit">Registrarse</button>
    </form>
  );
}
