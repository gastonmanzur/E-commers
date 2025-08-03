import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
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
  const [stockProduct, setStockProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, reserveItem } = useContext(CartContext);
  const role = localStorage.getItem('role');

  const uploadImage = async (file, field) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/upload', { data: reader.result },
          { headers: { Authorization: `Bearer ${token}` } });
        setEditForm(f => ({ ...f, [field]: res.data.url }));
      } catch {
        alert('Error al subir la imagen');
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('search') || '';
    const gender = params.get('gender') || '';
    const category = params.get('category') || '';
    const query = {};
    if (term) query.search = term;
    if (gender) query.gender = gender;
    if (category) query.category = category;
    axios
      .get('http://localhost:5000/api/products', {
        params: query,
      })
      .then((res) => setProducts(res.data))
      .catch(() => alert('Error al obtener productos'));
  }, [location.search]);

  const handleAdd = async (prod) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos');
      navigate('/login');
      return;
    }
    const qty = Number(quantities[prod._id] || 1);
    if (qty <= 0) return;
    if (qty > prod.stock) {
      alert('No hay suficiente stock');
      return;
    }
    await addItem(prod, qty);
    setProducts(prev => prev.map(p => p._id === prod._id ? { ...p, stock: p.stock - qty } : p));
    setQuantities(q => ({ ...q, [prod._id]: 1 }));
  };

  const handleEditClick = (prod) => {
    const [img1 = '', img2 = '', img3 = ''] = prod.images || [];
    setEditForm({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      image1: img1,
      image2: img2,
      image3: img3,
      category: prod.category || '',
      gender: prod.gender || 'unisex',
      inStock: prod.inStock,
      stock: prod.stock || 0,
      allowReservation: prod.allowReservation || false,
    });
    setEditProduct(prod);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    const token = localStorage.getItem('token');
    const images = [editForm.image1, editForm.image2, editForm.image3].filter(Boolean);
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${editProduct._id}`,
        {
          name: editForm.name,
          description: editForm.description,
          price: Number(editForm.price),
          images,
          category: editForm.category,
          gender: editForm.gender,
          inStock: editForm.inStock,
          stock: Number(editForm.stock),
          allowReservation: editForm.allowReservation,
        },
        { headers: { Authorization: `Bearer ${token}` } });
      setProducts(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      setEditProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleStockClick = (prod) => {
    setNewStock(prod.stock || 0);
    setStockProduct(prod);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockProduct) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${stockProduct._id}/stock`,
        { stock: Number(newStock) },
        { headers: { Authorization: `Bearer ${token}` } });
      setProducts(prev => prev.map(p => p._id === res.data._id ? res.data : p));
      setStockProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar stock');
    }
  };

  const handleReserve = async (prod) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para reservar productos');
      navigate('/login');
      return;
    }
    const qty = Number(quantities[prod._id] || 1);
    if (qty <= 0) return;
    await reserveItem(prod, qty);
    setQuantities(q => ({ ...q, [prod._id]: 1 }));
  };

  const handleDelete = async (prodId) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${prodId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(prev => prev.filter(p => p._id !== prodId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleFeatured = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/products/${id}/featured`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Producto marcado como destacado');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al marcar como destacado');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Productos</h2>
      <div className="mb-3">
        <select className="form-select w-auto" value={new URLSearchParams(location.search).get('gender') || ''}
          onChange={e => {
            const params = new URLSearchParams(location.search);
            if (e.target.value) params.set('gender', e.target.value); else params.delete('gender');
            navigate(`/products?${params.toString()}`);
          }}>
          <option value="">Todos</option>
          <option value="femenino">Para Ella</option>
          <option value="masculino">Para Él</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>
      <div className="row">
        {products.map(prod => (
          <div className="col-sm-6 col-md-3 mb-3" key={prod._id}>
            <div className="card h-100 product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${prod._id}`)}>
              {prod.images && prod.images.length > 0 && (
                <div id={`carousel-${prod._id}`} className="carousel slide">
                  <div className="carousel-inner">
                    {prod.images.map((img, idx) => (
                      <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                        <img src={img} className="d-block w-100" alt={prod.name} style={{ maxHeight: '150px', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  {prod.images.length > 1 && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${prod._id}`} data-bs-slide="prev" onClick={e => e.stopPropagation()}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${prod._id}`} data-bs-slide="next" onClick={e => e.stopPropagation()}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              )}
              <div className={`stock-ribbon ${prod.stock > 0 ? 'ribbon-green' : 'ribbon-red'}`}>
                <span>{prod.stock > 0 ? 'En Stock' : 'Sin Stock'}</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{prod.name}</h5>
                <p className="card-text">${prod.price}</p>
                <p className="card-text">Stock: {prod.stock}</p>
                <div className="input-group mb-2">
                  <input type="number" min="1" className="form-control" style={{maxWidth:'80px'}}
                    value={quantities[prod._id] || 1}
                    onChange={e => setQuantities(q => ({ ...q, [prod._id]: e.target.value }))} onClick={e=>e.stopPropagation()} />
                </div>
                {prod.stock > 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!localStorage.getItem('token')}
                    onClick={e => {
                      e.stopPropagation();
                      handleAdd(prod);
                    }}
                  >
                    Agregar al carrito
                  </button>
                ) : prod.allowReservation ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    disabled={!localStorage.getItem('token')}
                    onClick={e => {
                      e.stopPropagation();
                      handleReserve(prod);
                    }}
                  >
                    Reservar
                  </button>
                ) : (
                  <button type="button" className="btn btn-secondary" disabled>Sin stock</button>
                )}
                {role === 'admin' && (
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-info btn-sm me-2"
                      onClick={e => {
                        e.stopPropagation();
                        handleFeatured(prod._id);
                      }}
                    >
                      Destacado
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={e => {
                        e.stopPropagation();
                        handleEditClick(prod);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm me-2"
                      onClick={e => {
                        e.stopPropagation();
                        handleStockClick(prod);
                      }}
                    >
                      Stock
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(prod._id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {editProduct && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setEditProduct(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button type="button" className="btn-close" onClick={() => setEditProduct(null)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <input className="form-control" placeholder="Título" value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <textarea className="form-control" placeholder="Descripción" value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input type="number" className="form-control" placeholder="Precio" value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input type="file" className="form-control" accept="image/*"
                      onChange={e => uploadImage(e.target.files[0], 'image1')} />
                    {editForm.image1 && <small className="text-muted">{editForm.image1}</small>}
                  </div>
                  <div className="mb-2">
                    <input type="file" className="form-control" accept="image/*"
                      onChange={e => uploadImage(e.target.files[0], 'image2')} />
                    {editForm.image2 && <small className="text-muted">{editForm.image2}</small>}
                  </div>
                  <div className="mb-2">
                    <input type="file" className="form-control" accept="image/*"
                      onChange={e => uploadImage(e.target.files[0], 'image3')} />
                    {editForm.image3 && <small className="text-muted">{editForm.image3}</small>}
                  </div>
                  <div className="mb-2">
                    <input className="form-control" placeholder="Categoría" value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <select className="form-select" value={editForm.gender}
                      onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                      <option value="unisex">Unisex</option>
                      <option value="femenino">Para Ella</option>
                      <option value="masculino">Para Él</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <input type="number" className="form-control" placeholder="Stock" value={editForm.stock}
                      onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="inStockEdit" checked={editForm.inStock}
                      onChange={e => setEditForm({ ...editForm, inStock: e.target.checked })} />
                    <label className="form-check-label" htmlFor="inStockEdit">En stock</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="allowReserveEdit" checked={editForm.allowReservation}
                      onChange={e => setEditForm({ ...editForm, allowReservation: e.target.checked })} />
                    <label className="form-check-label" htmlFor="allowReserveEdit">Permitir reservas sin stock</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditProduct(null)}>Cerrar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {stockProduct && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setStockProduct(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Actualizar Stock</h5>
                <button type="button" className="btn-close" onClick={() => setStockProduct(null)}></button>
              </div>
              <form onSubmit={handleStockSubmit}>
                <div className="modal-body">
                  <input type="number" className="form-control" value={newStock}
                    onChange={e => setNewStock(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setStockProduct(null)}>Cerrar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
