import type React from "react"
import { ThermometerIcon, DropletIcon, CloudRainIcon, SunIcon } from "lucide-react"

interface SensorCardsProps {
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
}

const SensorCards: React.FC<SensorCardsProps> = ({ temperatura, humedad, lluvia, sol }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Temperatura Card */}
      <div className="bg-white-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white-700/50 dark:border-gray-700/50">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <ThermometerIcon className="h-6 w-6 text-red-500" />
          </div>
          <span className="ml-3 text-gray-400 font-medium">Temperatura</span>
        </div>
        <div className="text-4xl font-bold text-red-500">{temperatura} °C</div>
      </div>

      {/* Humedad Card */}
      <div className="bg-white-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white-700/50 dark:border-gray-700/50">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <DropletIcon className="h-6 w-6 text-blue-500" />
          </div>
          <span className="ml-3 text-gray-400 font-medium">Humedad</span>
        </div>
        <div className="text-4xl font-bold text-blue-500">{humedad}%</div>
      </div>

      {/* Lluvia Card */}
      <div className="bg-white-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white-700/50 dark:border-gray-700/50">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center">
            <CloudRainIcon className="h-6 w-6 text-cyan-500" />
          </div>
          <span className="ml-3 text-gray-400 font-medium">Lluvia</span>
        </div>
        <div className="text-4xl font-bold text-cyan-500">{lluvia}</div>
      </div>

      {/* Intensidad del sol Card */}
      <div className="bg-white-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white-700/50 dark:border-gray-700/50">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
            <SunIcon className="h-6 w-6 text-amber-500" />
          </div>
          <span className="ml-3 text-gray-400 font-medium">Intensidad del sol</span>
        </div>
        <div className="text-4xl font-bold text-amber-500">{sol}%</div>
      </div>
    </div>
  )
}

export default SensorCards

