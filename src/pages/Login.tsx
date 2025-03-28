// Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { isAuthenticated, saveUserSession } from '../utils/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError(null); // Limpiar errores previos

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Error al iniciar sesión';
        throw new Error(errorMessage);
      }

      // Guardar token en localStorage
      saveUserSession(data.token, data.user); // Guardar el token y el usuario

      console.log('Token guardado:', data.token);
      console.log('Usuario guardado:', data.user);

      navigate('/dashboard'); // Redirigir al dashboard

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <LoginForm onSubmit={handleLogin} />
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;