"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { UserIcon, LogOutIcon, SettingsIcon, UserCircleIcon, BellIcon } from "lucide-react"

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
        aria-label="Open user menu"
      >
        <UserIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/30 rounded-xl shadow-xl z-10 overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-800"></span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Carlos Mendoza</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
              </div>
            </div>
          </div>

          <div className="py-2">
           
            <div className="border-t border-emerald-100 dark:border-emerald-900/30 my-1"></div>
            <a
              href="#"
              className="flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Cerrar sesión
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu

