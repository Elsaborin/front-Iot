import React, { useState } from 'react';
import { UserIcon, LockIcon, Sprout } from 'lucide-react';
import InputField from './InputField';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: {email?: string; password?: string} = {};
    if (!email) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(email, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full blur-xl opacity-70 animate-pulse"></div>
          <div className="relative p-6 bg-white dark:bg-gray-800 rounded-full shadow-2xl">
            <Sprout className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">
        AgroMonitor
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Sistema inteligente de monitoreo agrícola</p>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/30">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <InputField
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<UserIcon className="w-5 h-5" />}
            error={errors.email}
            required
          />
          
          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<LockIcon className="w-5 h-5" />}
            error={errors.password}
            required
          />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800 dark:text-gray-200">
                Recordarme
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 border-0 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
