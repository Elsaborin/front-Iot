"use client"

import type React from "react"
import { useState } from "react"
import { MenuIcon, Sprout, BellIcon, SearchIcon } from 'lucide-react'
import ThemeToggle from "../components/ThemeToggle"
import UserMenu from "../ui/UserMenu"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md border-b border-emerald-100/50 dark:border-emerald-900/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center ml-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-400 p-2.5 rounded-lg shadow-lg">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                Agro<span className="text-emerald-600 dark:text-emerald-400">Monitor</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xs ml-10">
            <div className="w-full relative">
              

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
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${searchOpen ? "h-14 opacity-100" : "h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="px-4 py-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
