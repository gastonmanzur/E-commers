import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');
  const [images, setImages] = useState({});

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
    axios.get('http://localhost:5000/api/category-images')
      .then(res => {
        const map = res.data.reduce((acc, cur) => {
          acc[cur.category] = cur.image;
          return acc;
        }, {});
        setImages(map);
      })
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

  const handleImageUpload = async (file) => {
    if (!selected) {
      alert('Seleccione una categoría');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
        const uploadRes = await axios.post('http://localhost:5000/api/upload', { data: reader.result }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const url = uploadRes.data.url;
        await axios.put(`http://localhost:5000/api/category-images/${selected}`, { image: url }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages(imgs => ({ ...imgs, [selected]: url }));
        alert('Imagen actualizada');
      } catch {
        alert('Error al subir la imagen');
      }
    };
    if (file) reader.readAsDataURL(file);
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
        <div className="mb-3">
          <input type="file" className="form-control" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />
          {images[selected] && <small className="text-muted">{images[selected]}</small>}
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
