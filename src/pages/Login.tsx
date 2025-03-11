import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import ThemeToggle from '../components/ThemeToggle';
import { authenticateUser } from '../utils/auth';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authenticateUser(email, password);
      if (user) {
        console.log('Login exitoso:', user);
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión');
      console.error('Error de login:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-300 dark:bg-cyan-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TempHum<span className="text-cyan-500">Monitor</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sistema de monitoreo de temperatura y humedad
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
        
        <LoginForm onSubmit={handleLogin} />
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TempHumMonitor. Todos los derechos reservados.
        </div>

        
      </div>
    </div>
  );
};

export default Login;