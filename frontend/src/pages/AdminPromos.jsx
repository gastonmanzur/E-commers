import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPromos() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    active: true,
    selected: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Error al obtener productos'));
  }, []);

  const toggleProduct = (id) => {
    setForm(f => {
      const selected = f.selected.includes(id)
        ? f.selected.filter(p => p !== id)
        : [...f.selected, id];
      return { ...f, selected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/promotions', {
        name: form.name,
        description: form.description,
        products: form.selected,
        price: Number(form.price),
        image: form.image,
        active: form.active,
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Promoción creada');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Nueva Promoción</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input className="form-control" placeholder="Título" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-2">
          <textarea className="form-control" placeholder="Descripción" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mb-2">
          <input type="number" className="form-control" placeholder="Precio especial" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Imagen (opcional)" value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })} />
        </div>
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="activePromo" checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })} />
          <label className="form-check-label" htmlFor="activePromo">Activa</label>
        </div>
        <div className="mb-3">
          <p className="mb-1">Productos:</p>
          {products.map(p => (
            <div className="form-check" key={p._id}>
              <input className="form-check-input" type="checkbox" id={`prod-${p._id}`}
                checked={form.selected.includes(p._id)}
                onChange={() => toggleProduct(p._id)} />
              <label className="form-check-label" htmlFor={`prod-${p._id}`}>{p.name}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
