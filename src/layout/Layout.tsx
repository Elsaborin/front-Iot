"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Importa useLocation
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { pathname: currentPath } = useLocation(); // Obtiene la ruta actual

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} currentPath={currentPath} /> {/* Pasa la ruta */}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-6 py-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;