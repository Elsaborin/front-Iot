"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { HomeIcon, Sprout } from "lucide-react"

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-4">
      <div className="text-center relative max-w-lg">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-xl mb-4">
            <Sprout className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            404
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-emerald-100 dark:border-emerald-900/30">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Página no encontrada</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            La página que estás buscando no existe o ha sido movida.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3.5 border-0 rounded-lg text-base font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound

