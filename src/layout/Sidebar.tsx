"use client"

import type React from "react"
import { useState } from "react"
import { HomeIcon, BarChart3Icon, CloudRainIcon, SunIcon, ThermometerIcon, DropletIcon, MapPinIcon, SproutIcon as SeedlingIcon, AlertTriangleIcon, SettingsIcon, UsersIcon, HelpCircleIcon } from 'lucide-react'

interface SidebarProps {
  open: boolean
}

interface NavItem {
  name: string
  icon: React.ReactNode
  href: string
  current: boolean
  children?: NavItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Monitoreo"])

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const navigation: NavItem[] = [
    { name: "Dashboard", icon: <HomeIcon className="h-5 w-5" />, href: "dashboard", current: true },
    
    { name: "Parcelas", icon: <MapPinIcon className="h-5 w-5" />, href: "parcelas", current: false },

  ]

  const secondaryNavigation: NavItem[] = [

  ]

  const renderNavItem = (item: NavItem) => {
    const isExpanded = expandedItems.includes(item.name)
    const hasChildren = item.children && item.children.length > 0

    return (
      <li key={item.name}>
        <a
          href={item.href}
          onClick={
            hasChildren
              ? (e) => {
                  e.preventDefault()
                  toggleExpand(item.name)
                }
              : undefined
          }
          className={`
            flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group transition-all duration-200
            ${
              item.current
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400"
            }
          `}
        >
          <span
            className={`mr-3 ${item.current ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}`}
          >
            {item.icon}
          </span>
          <span className={`${open ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>{item.name}</span>
          {hasChildren && open && (
            <svg
              className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </a>

        {hasChildren && isExpanded && open && (
          <ul className="mt-1 ml-6 space-y-1 border-l-2 border-emerald-100 dark:border-emerald-900/30 pl-2">
            {item.children!.map((child) => (
              <li key={child.name}>
                <a
                  href={child.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${
                      child.current
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }
                  `}
                >
                  <span className={`mr-3 ${child.current ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {child.icon}
                  </span>
                  {child.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div
      className={`
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-r border-emerald-100/50 dark:border-emerald-900/20 transition-all duration-300 ease-in-out
        ${open ? "w-64" : "w-20"}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-4 mb-6">
            {open && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-xs text-emerald-800 dark:text-emerald-200">
                <div className="font-medium mb-1">Estado del sistema</div>
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                  <span>Todos los sensores activos</span>
                </div>
              </div>
            )}
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <ul className="space-y-1">{navigation.map(renderNavItem)}</ul>
            
            {open && <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>}
            
            <ul className="space-y-1">{secondaryNavigation.map(renderNavItem)}</ul>
          </nav>
        </div>
        
        {open && (
          <div className="p-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-xs">
              <div className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">Última sincronización</div>
              <div className="text-gray-600 dark:text-gray-400">Hoy, 15:30</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
