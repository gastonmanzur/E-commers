import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setUser(res.data.user);
        setAvatar(res.data.user.avatar || '');
      })
      .catch(() => alert('No autorizado'));
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/users/avatar', { avatar }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('avatar', avatar);
      setMessage('Imagen actualizada');
    } catch {
      setMessage('Error al actualizar');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>Perfil</h2>
      {user ? (
        <div>
          <div className="mb-3">
            {avatar && (
              <div
                className="rounded-circle overflow-hidden"
                style={{ width: '70px', height: '70px', border: '1px solid black', cursor: 'pointer' }}
                onClick={handleImageClick}
              >
                <img src={avatar} alt="Avatar" className="w-100 h-100" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="d-none"
            />
          </div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="URL de la imagen"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleUpdate}>
            Actualizar
          </button>
          {message && <p className="mt-2">{message}</p>}
        </div>
      ) : (
        <p>Cargando o no autorizado...</p>
      )}
    </div>
  );
}
