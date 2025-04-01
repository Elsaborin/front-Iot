"use client"

import type React from "react"
import Layout from "../layout/Layout"
import { BarChart3Icon, LineChartIcon, AreaChartIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

// Definición de tipos para los datos de la API
interface Sensor {
  id: number
  name: string
  unit: string
  created_at: string
  updated_at: string
}

interface Measurement {
  id: number
  sensor_id: number
  value: string
  date: string
  registered_in: string
  created_at: string
  updated_at: string
  sensor: Sensor
}

// Hook personalizado para obtener datos de sensores
const useSensorData = () => {
  const [data, setData] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [historicalData, setHistoricalData] = useState([])
  const [frequencyData, setFrequencyData] = useState([])
  const [latestReadings, setLatestReadings] = useState({
    temperatura: 0,
    humedad: 0,
    lluvia: 0,
    sol: 0,
  })

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const response = await axios.get("http://127.0.0.1:8000/api/mediciones/generales")
      setData(response.data)

      // Procesar los datos para obtener las últimas lecturas
      const readings = processLatestReadings(response.data)
      setLatestReadings(readings)

      // Generar datos históricos basados en los datos de la API
      const timeSeriesData = processHistoricalData(response.data)
      setHistoricalData(timeSeriesData)

      // Generar datos de frecuencia para el polígono
      setFrequencyData(generateFrequencyData(timeSeriesData))

      setLoading(false)
      setRefreshing(false)
    } catch (err) {
      console.error("Error obteniendo datos:", err)
      setError("Error al cargar datos de los sensores")
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Configurar polling cada 30 segundos
    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [])

  return {
    data,
    loading,
    error,
    refreshData: fetchData,
    refreshing,
    historicalData,
    frequencyData,
    latestReadings,
  }
}

// Función para procesar las últimas lecturas de cada sensor
const processLatestReadings = (measurements: Measurement[]) => {
  const readings = {
    temperatura: 0,
    humedad: 0,
    lluvia: 0,
    sol: 0,
  }

  // Agrupar mediciones por tipo de sensor
  const sensorGroups = measurements.reduce((groups, measurement) => {
    const sensorName = measurement.sensor.name.toLowerCase()
    if (!groups[sensorName]) {
      groups[sensorName] = []
    }
    groups[sensorName].push(measurement)
    return groups
  }, {})

  // Para cada tipo de sensor, obtener la medición más reciente
  Object.keys(sensorGroups).forEach((sensorName) => {
    if (readings.hasOwnProperty(sensorName)) {
      // Ordenar por fecha descendente y tomar el primer elemento
      const sortedMeasurements = sensorGroups[sensorName].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      if (sortedMeasurements.length > 0) {
        readings[sensorName] = Number.parseFloat(sortedMeasurements[0].value)
      }
    }
  })

  return readings
}

// Función para procesar datos históricos de la API
const processHistoricalData = (measurements: Measurement[]) => {
  // Agrupar mediciones por fecha
  const measurementsByDate = measurements.reduce((groups, measurement) => {
    // Extraer solo la fecha (sin hora)
    const date = measurement.date.split(" ")[0]
    if (!groups[date]) {
      groups[date] = {
        fecha: formatDate(date),
        temperatura: 0,
        humedad: 0,
        lluvia: 0,
        sol: 0,
      }
    }

    // Asignar valor según el tipo de sensor
    const sensorName = measurement.sensor.name.toLowerCase()
    if (groups[date].hasOwnProperty(sensorName)) {
      groups[date][sensorName] = Number.parseFloat(measurement.value)
    }

    return groups
  }, {})

  // Convertir el objeto a un array y ordenar por fecha
  return Object.values(measurementsByDate).sort((a, b) => {
    return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  })
}

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

const COLORS = {
  humedad: "#10b981",
  temperatura: "#ef4444",
  lluvia: "#3b82f6",
  sol: "#f59e0b",
}

// Función para generar datos de frecuencia para humedad y lluvia
const generateFrequencyData = (historicalData) => {
  if (!historicalData || historicalData.length === 0) {
    return []
  }

  // Crear rangos para humedad y lluvia
  const humedadRanges = [
    { min: 0, max: 20, label: "0-20%" },
    { min: 20, max: 40, label: "20-40%" },
    { min: 40, max: 60, label: "40-60%" },
    { min: 60, max: 80, label: "60-80%" },
    { min: 80, max: 100, label: "80-100%" },
  ]

  const lluviaRanges = [
    { min: 0, max: 5, label: "0-5mm" },
    { min: 5, max: 10, label: "5-10mm" },
    { min: 10, max: 15, label: "10-15mm" },
    { min: 15, max: 20, label: "15-20mm" },
    { min: 20, max: 100, label: ">20mm" },
  ]

  // Inicializar contadores
  const humedadFrequency = humedadRanges.map((range) => ({
    range: range.label,
    count: 0,
    color: COLORS.humedad,
  }))

  const lluviaFrequency = lluviaRanges.map((range) => ({
    range: range.label,
    count: 0,
    color: COLORS.lluvia,
  }))

  // Contar frecuencias
  historicalData.forEach((data) => {
    // Contar humedad
    for (let i = 0; i < humedadRanges.length; i++) {
      if (data.humedad >= humedadRanges[i].min && data.humedad < humedadRanges[i].max) {
        humedadFrequency[i].count++
        break
      }
    }

    // Contar lluvia
    for (let i = 0; i < lluviaRanges.length; i++) {
      if (data.lluvia >= lluviaRanges[i].min && data.lluvia < lluviaRanges[i].max) {
        lluviaFrequency[i].count++
        break
      }
    }
  })

  // Combinar datos para el gráfico
  const frequencyData = humedadRanges.map((range, index) => ({
    categoria: range.label,
    humedad: humedadFrequency[index].count,
    lluvia: lluviaFrequency[index].count,
  }))

  return frequencyData
}

const GraficasAvanzadas: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeChart, setActiveChart] = useState<string>("barras")
  const { data, loading, error, refreshData, refreshing, historicalData, frequencyData, latestReadings } =
    useSensorData()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const chartType = params.get("type")
    if (chartType) {
      setActiveChart(chartType)
    }
  }, [location])

  const handleChartChange = (chartType: string) => {
    setActiveChart(chartType)
    navigate(`/graficos?type=${chartType}`)
  }

  const renderChartContent = () => {
    switch (activeChart) {
      case "barras":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center dark:bg-emerald-900">
                <BarChart3Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">
                Comparativa: Temperatura y Humedad por Día
              </h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={historicalData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="fecha" tick={{ fill: "#4b5563" }} />
                  <YAxis tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                    formatter={(value, name) => {
                      if (name === "Temperatura (°C)") return [`${value} °C`, name]
                      if (name === "Humedad (%)") return [`${value} %`, name]
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Bar name="Temperatura (°C)" dataKey="temperatura" fill={COLORS.temperatura} />
                  <Bar name="Humedad (%)" dataKey="humedad" fill={COLORS.humedad} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Este gráfico muestra la relación entre temperatura y humedad para cada día registrado.</p>
              <p className="mt-2">
                Observe cómo la humedad tiende a ser inversamente proporcional a la temperatura en muchos casos.
              </p>
            </div>
          </div>
        )
      case "lineas":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center dark:bg-emerald-900">
                <LineChartIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">
                Tendencia: Precipitaciones y Exposición Solar
              </h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="fecha" tick={{ fill: "#4b5563" }} />
                  <YAxis tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                    formatter={(value, name) => {
                      if (name === "Lluvia (mm)") return [`${value} mm`, name]
                      if (name === "Sol (%)") return [`${value} %`, name]
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Lluvia (mm)"
                    dataKey="lluvia"
                    stroke={COLORS.lluvia}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line type="monotone" name="Sol (%)" dataKey="sol" stroke={COLORS.sol} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Este gráfico muestra la correlación inversa entre precipitaciones y exposición solar.</p>
              <p className="mt-2">
                Los días con mayor precipitación suelen tener menor exposición solar, lo que afecta directamente al
                crecimiento de los cultivos.
              </p>
            </div>
          </div>
        )
      case "poligono":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center dark:bg-emerald-900">
                <AreaChartIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">
                Distribución: Frecuencia de Humedad y Precipitaciones
              </h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={frequencyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="categoria" tick={{ fill: "#4b5563" }} />
                  <YAxis
                    tick={{ fill: "#4b5563" }}
                    label={{ value: "Frecuencia (días)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    name="Humedad (días)"
                    dataKey="humedad"
                    stroke={COLORS.humedad}
                    fill={COLORS.humedad}
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    name="Lluvia (días)"
                    dataKey="lluvia"
                    stroke={COLORS.lluvia}
                    fill={COLORS.lluvia}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Este gráfico muestra la distribución de frecuencias de humedad y precipitaciones.</p>
              <p className="mt-2">
                Permite identificar los rangos más comunes de humedad y lluvia, facilitando la planificación de riego y
                otras actividades agrícolas.
              </p>
            </div>
          </div>
        )
      case "temperatura":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center dark:bg-emerald-900">
                <LineChartIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">Evolución de Temperatura</h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="fecha" tick={{ fill: "#4b5563" }} />
                  <YAxis
                    tick={{ fill: "#4b5563" }}
                    domain={["dataMin - 2", "dataMax + 2"]}
                    label={{ value: "Temperatura (°C)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                    formatter={(value) => [`${value} °C`, "Temperatura"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Temperatura (°C)"
                    dataKey="temperatura"
                    stroke={COLORS.temperatura}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    dot={{ stroke: COLORS.temperatura, strokeWidth: 2, r: 4, fill: "white" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperatura"
                    fill={COLORS.temperatura}
                    stroke="none"
                    fillOpacity={0.1}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Este gráfico muestra la evolución de la temperatura a lo largo del tiempo.</p>
              <p className="mt-2">
                Las fluctuaciones de temperatura son críticas para el desarrollo de cultivos y pueden indicar cambios
                estacionales o anomalías climáticas.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">Seleccione un tipo de gráfico</p>
          </div>
        )
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monitoreo Agrícola en Tiempo Real</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Análisis de datos de sensores para optimización de cultivos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <RefreshCwIcon className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar datos
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Volver
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Visualizaciones</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Seleccione un tipo de gráfico</p>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleChartChange("barras")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeChart === "barras"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <BarChart3Icon className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <div>Temperatura y Humedad</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Comparativa diaria</div>
                  </div>
                </button>
                <button
                  onClick={() => handleChartChange("lineas")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeChart === "lineas"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <LineChartIcon className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <div>Lluvia y Sol</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Correlación inversa</div>
                  </div>
                </button>
                <button
                  onClick={() => handleChartChange("poligono")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeChart === "poligono"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <AreaChartIcon className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <div>Distribución de Frecuencias</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Humedad y Lluvia</div>
                  </div>
                </button>
                <button
                  onClick={() => handleChartChange("temperatura")}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeChart === "temperatura"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <LineChartIcon className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <div>Evolución de Temperatura</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tendencia temporal</div>
                  </div>
                </button>
              </div>

              {!loading && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Última lectura de sensores
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Temperatura</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {latestReadings.temperatura}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Humedad</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {latestReadings.humedad}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Lluvia</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {latestReadings.lluvia} mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Sol</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{latestReadings.sol}%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Última actualización: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">{renderChartContent()}</div>
        </div>
      )}
    </Layout>
  )
}

export default GraficasAvanzadas

