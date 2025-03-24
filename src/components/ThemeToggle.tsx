"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SunIcon, MoonIcon } from 'lucide-react'

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a preference stored
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDarkMode(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-gray-800 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-colors duration-200 shadow-md"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="w-5 h-5 text-amber-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-emerald-600" />
      )}
    </button>
  )
}

export default ThemeToggle
