import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [googleError, setGoogleError] = useState(
    googleClientId ? '' : 'El inicio de sesión con Google no está configurado.',
  );
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef(null);
  const googleRequestInProgress = useRef(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('avatar', res.data.avatar || '');
      localStorage.setItem('userId', res.data._id);
      window.dispatchEvent(new Event('userchange'));
      alert('Login exitoso');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleGoogleCredential = useCallback(async (response) => {
    if (googleRequestInProgress.current) return;

    if (!response?.credential) {
      setGoogleError('Google no devolvió una credencial válida. Intentá nuevamente.');
      return;
    }

    googleRequestInProgress.current = true;
    setGoogleLoading(true);
    setGoogleError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/google-login', {
        token: response.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('avatar', res.data.avatar || '');
      localStorage.setItem('userId', res.data._id);
      window.dispatchEvent(new Event('userchange'));
      alert('Login exitoso');
      navigate('/');
    } catch (err) {
      setGoogleError(
        err.response?.data?.message || 'No se pudo iniciar sesión con Google. Intentá nuevamente.',
      );
    } finally {
      googleRequestInProgress.current = false;
      setGoogleLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!googleClientId) return undefined;

    const googleScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    const googleButtonContainer = googleButtonRef.current;
    let initializationTimer;
    let disposed = false;
    let initialized = false;

    const initializeGoogle = () => {
      if (disposed || initialized) return;

      const googleIdentity = window.google?.accounts?.id;
      const container = googleButtonContainer;
      if (!googleIdentity || !container) {
        setGoogleError('No se pudo cargar el inicio de sesión con Google. Intentá nuevamente.');
        return;
      }

      initialized = true;
      container.replaceChildren();
      googleIdentity.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });
      googleIdentity.renderButton(container, { theme: 'outline', size: 'large' });
      setGoogleError('');
    };

    const scheduleInitialization = () => {
      clearTimeout(initializationTimer);
      initializationTimer = window.setTimeout(initializeGoogle, 0);
    };
    const handleScriptError = () => {
      if (!disposed) {
        setGoogleError('No se pudo cargar el inicio de sesión con Google. Intentá nuevamente.');
      }
    };

    if (window.google?.accounts?.id) {
      scheduleInitialization();
    } else if (googleScript) {
      googleScript.addEventListener('load', scheduleInitialization);
      googleScript.addEventListener('error', handleScriptError);
    } else {
      handleScriptError();
    }

    return () => {
      disposed = true;
      clearTimeout(initializationTimer);
      googleScript?.removeEventListener('load', scheduleInitialization);
      googleScript?.removeEventListener('error', handleScriptError);
      googleButtonContainer?.replaceChildren();
    };
  }, [handleGoogleCredential, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleLogin} className="p-4 border rounded bg-light">
            <h2 className="mb-4 text-center">Iniciar Sesión</h2>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">
              Entrar
            </button>
            <button
              type="button"
              className="btn btn-link w-100"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
            {googleClientId && (
              <div
                ref={googleButtonRef}
                className="d-flex justify-content-center mt-3"
                style={googleLoading ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
              />
            )}
            {googleLoading && <p className="text-center mt-2 mb-0">Iniciando sesión con Google…</p>}
            {googleError && (
              <p className="text-danger text-center mt-2 mb-0" role="alert">
                {googleError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
