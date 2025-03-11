import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="border-r-2 border-gray-400 dark:border-gray-500 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="text-gray-600 dark:text-gray-300 text-xl font-medium">Página no encontrada</div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-24 text-lg">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;