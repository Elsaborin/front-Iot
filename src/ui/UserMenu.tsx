import React, { useState, useRef, useEffect } from 'react';
import { LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <img
            className="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
          <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 ring-1 ring-white dark:ring-gray-800"></div>
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
          Administrador
        </span>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">Conectado como</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">admin@temphum.com</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOutIcon className="mr-3 h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;