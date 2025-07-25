import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image1: '',
    image2: '',
    image3: '',
    category: '',
    inStock: true,
    stock: 0,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const images = [form.image1, form.image2, form.image3].filter(Boolean);
    try {
      await axios.post('http://localhost:5000/api/products', {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        images,
        category: form.category,
        inStock: form.inStock,
        stock: Number(form.stock),
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Producto creado');
      navigate('/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" placeholder="Título" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-3">
          <textarea className="form-control" placeholder="Descripción" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mb-3">
          <input type="number" className="form-control" placeholder="Precio" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Imagen 1" value={form.image1}
            onChange={(e) => setForm({ ...form, image1: e.target.value })} />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Imagen 2" value={form.image2}
            onChange={(e) => setForm({ ...form, image2: e.target.value })} />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Imagen 3" value={form.image3}
            onChange={(e) => setForm({ ...form, image3: e.target.value })} />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Categoría" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="mb-3">
          <input type="number" className="form-control" placeholder="Stock" value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })} id="instock" />
          <label className="form-check-label" htmlFor="instock">En stock</label>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
