import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(err => alert('No autorizado'));
  }, []);

  return (
    <div>
      <h2>Perfil</h2>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Cargando o no autorizado...</p>
      )}
    </div>
  );
}
