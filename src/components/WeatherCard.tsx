import type React from "react"
import { ThermometerIcon, DropletIcon, CloudRainIcon, SunIcon } from "lucide-react"

interface WeatherCardProps {
  name: string
  value: string
  icon: "thermometer" | "droplet" | "cloud-rain" | "sun"
  iconType?: "solid" | "outline"
  color?: "blue" | "cyan" | "purple" | "green" | "yellow" | "red"
}

const WeatherCard: React.FC<WeatherCardProps> = ({ name, value, icon, iconType = "outline", color = "blue" }) => {
  const getIcon = () => {
    switch (icon) {
      case "thermometer":
        return <ThermometerIcon className={`w-4 h-4 ${getIconColor()}`} />
      case "droplet":
        return <DropletIcon className={`w-4 h-4 ${getIconColor()}`} />
      case "cloud-rain":
        return <CloudRainIcon className={`w-4 h-4 ${getIconColor()}`} />
      case "sun":
        return <SunIcon className={`w-4 h-4 ${getIconColor()}`} />
      default:
        return <ThermometerIcon className={`w-4 h-4 ${getIconColor()}`} />
    }
  }

  const getIconColor = () => {
    switch (color) {
      case "blue":
        return "text-blue-500 dark:text-blue-400"
      case "cyan":
        return "text-cyan-500 dark:text-cyan-400"
      case "purple":
        return "text-purple-500 dark:text-purple-400"
      case "green":
        return "text-emerald-500 dark:text-emerald-400"
      case "yellow":
        return "text-amber-500 dark:text-amber-400"
      case "red":
        return "text-red-500 dark:text-red-400"
      default:
        return "text-blue-500 dark:text-blue-400"
    }
  }

  const getBgColor = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 dark:bg-blue-900/20"
      case "cyan":
        return "bg-cyan-50 dark:bg-cyan-900/20"
      case "purple":
        return "bg-purple-50 dark:bg-purple-900/20"
      case "green":
        return "bg-emerald-50 dark:bg-emerald-900/20"
      case "yellow":
        return "bg-amber-50 dark:bg-amber-900/20"
      case "red":
        return "bg-red-50 dark:bg-red-900/20"
      default:
        return "bg-blue-50 dark:bg-blue-900/20"
    }
  }

  return (
    <div className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className={`w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center mr-3`}>{getIcon()}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{name}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

export default WeatherCard

