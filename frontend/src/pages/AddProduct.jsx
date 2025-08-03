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
    gender: 'unisex',
    inStock: true,
    stock: 0,
    allowReservation: false,
  });
  const navigate = useNavigate();

  const uploadImage = async (file, field) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/upload', { data: reader.result },
          { headers: { Authorization: `Bearer ${token}` } });
        setForm(f => ({ ...f, [field]: res.data.url }));
      } catch {
        alert('Error al subir la imagen');
      }
    };
    if (file) reader.readAsDataURL(file);
  };

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
        gender: form.gender,
        inStock: form.inStock,
        stock: Number(form.stock),
        allowReservation: form.allowReservation,
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
          <input type="file" className="form-control" accept="image/*"
            onChange={e => uploadImage(e.target.files[0], 'image1')} />
          {form.image1 && <small className="text-muted">{form.image1}</small>}
        </div>
        <div className="mb-3">
          <input type="file" className="form-control" accept="image/*"
            onChange={e => uploadImage(e.target.files[0], 'image2')} />
          {form.image2 && <small className="text-muted">{form.image2}</small>}
        </div>
        <div className="mb-3">
          <input type="file" className="form-control" accept="image/*"
            onChange={e => uploadImage(e.target.files[0], 'image3')} />
          {form.image3 && <small className="text-muted">{form.image3}</small>}
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Categoría" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="mb-3">
          <select className="form-select" value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option value="unisex">Unisex</option>
            <option value="femenino">Para Ella</option>
            <option value="masculino">Para Él</option>
          </select>
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
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="allowReserve"
            checked={form.allowReservation}
            onChange={(e) => setForm({ ...form, allowReservation: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="allowReserve">
            Permitir reservas sin stock
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
