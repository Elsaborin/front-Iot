import type React from "react"
import { GithubIcon, HeartIcon } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-emerald-100/50 dark:border-emerald-900/20">
      <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">AgroMonitor</span>
            <span className="hidden sm:inline">- Tecnología para el campo</span>
          </div>
          <div className="mt-3 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors">
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors flex items-center">
              <span className="mr-1">Hecho con</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
