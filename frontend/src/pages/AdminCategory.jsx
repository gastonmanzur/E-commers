import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        const cats = Array.from(new Set(res.data.map(p => p.category).filter(Boolean)));
        setCategories(cats);
      })
      .catch(() => {});
    axios.get('http://localhost:5000/api/highlight-category')
      .then(res => setSelected(res.data?.category || ''))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/highlight-category', { category: selected }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Categoría actualizada');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Categoría destacada</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <select className="form-select" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Seleccione una categoría</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
