import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
            <span>&copy; {new Date().getFullYear()}</span>
            <span>TempHumMonitor.</span>
            <span>Todos los derechos reservados.</span>
          </div>
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;