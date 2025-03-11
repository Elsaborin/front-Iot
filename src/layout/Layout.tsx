import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;