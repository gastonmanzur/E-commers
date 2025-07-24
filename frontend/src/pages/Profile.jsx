import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');

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
    } catch (err) {
      setMessage('Error al actualizar');
    }
  };

  return (
    <div>
      <h2>Perfil</h2>
      {user ? (
        <div>
          <div className="mb-3">
            {avatar && (
              <img src={avatar} alt="Avatar" style={{ width: '100px', height: '100px' }} />
            )}
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
