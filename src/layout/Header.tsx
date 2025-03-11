import React, { useState } from 'react';
import { MenuIcon, SearchIcon, ThermometerIcon } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import UserMenu from '../ui/UserMenu';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-4">
              <ThermometerIcon className="h-8 w-8 text-cyan-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                TempHum<span className="text-cyan-500">Monitor</span>
              </span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
              </div>
              
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
          
            
            <ThemeToggle />
            
            <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2"></div>
            
            <UserMenu />
          </div>
        </div>
      </div>
      
      {/* Barra de búsqueda móvil */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${searchOpen ? 'h-14 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 py-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Barra de gradiente */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
    </header>
  );
};

export default Header;