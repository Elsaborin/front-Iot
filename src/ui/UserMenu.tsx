import React, { useState, useRef, useEffect } from "react";
import { UserIcon, LogOutIcon, UserCircleIcon } from "lucide-react";
import { logout, getUserSession } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = getUserSession(); // Obtener el usuario almacenado

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
        aria-label="Open user menu"
      >
        <UserIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800"></span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user ? user.name : "Usuario"}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;