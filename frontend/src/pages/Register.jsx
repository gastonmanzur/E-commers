import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', form);
      alert(`Usuario registrado: ${res.data.name}`);
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
      <button type="submit">Registrarse</button>
    </form>
  );
}
