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
} from "recharts"

// Hook personalizado para obtener datos de sensores
const useSensorData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [historicalData, setHistoricalData] = useState([])
  const [frequencyData, setFrequencyData] = useState([])

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const response = await axios.get("https://moriahmkt.com/iotapp/updated/")
      setData(response.data)

      // Generar datos históricos basados en los datos actuales
      if (response.data.sensores) {
        const timeSeriesData = generateTimeSeriesData(response.data.sensores)
        setHistoricalData(timeSeriesData)

        // Generar datos de frecuencia para el polígono
        setFrequencyData(generateFrequencyData(timeSeriesData))
      }

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

  return { data, loading, error, refreshData: fetchData, refreshing, historicalData, frequencyData }
}

interface SensorData {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}

const COLORS = {
  humedad: "#10b981",
  temperatura: "#ef4444",
  lluvia: "#3b82f6",
  sol: "#f59e0b",
}

// Variables de estado para datos históricos y de frecuencia
// let historicalData = []
// let frequencyData = []

// Función para generar datos históricos simulados
const generateTimeSeriesData = (sensorData: SensorData) => {
  const now = new Date()
  const data = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const randomFactor = 0.8 + Math.random() * 0.4

    data.push({
      fecha: date.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
      humedad: Math.round(sensorData.humedad * randomFactor),
      temperatura: Math.round(sensorData.temperatura * randomFactor),
      lluvia: Math.round(sensorData.lluvia * randomFactor),
      sol: Math.round(sensorData.sol * randomFactor),
    })
  }

  return data
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
    { min: 0, max: 20, label: "0-20mm" },
    { min: 20, max: 40, label: "20-40mm" },
    { min: 40, max: 60, label: "40-60mm" },
    { min: 60, max: 80, label: "60-80mm" },
    { min: 80, max: 100, label: "80-100mm" },
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
  const { data, loading, error, refreshData, refreshing, historicalData, frequencyData } = useSensorData()

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
              <h2 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">Temperatura y Humedad</h2>
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
                  />
                  <Legend />
                  <Bar name="Temperatura (°C)" dataKey="temperatura" fill={COLORS.temperatura} />
                  <Bar name="Humedad (%)" dataKey="humedad" fill={COLORS.humedad} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Este gráfico de barras muestra la comparación entre temperatura y humedad por día.</p>
              <p className="mt-2">
                Permite visualizar la relación entre estos dos parámetros clave para el monitoreo agrícola.
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
                Lluvia y Sol a lo Largo del Tiempo
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
              <p>Este gráfico muestra la evolución de la lluvia y el sol a lo largo del tiempo.</p>
              <p className="mt-2">
                Permite identificar patrones y correlaciones entre estos dos factores climáticos importantes.
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
                Polígono de Frecuencias: Humedad y Lluvia
              </h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                    label={{ value: "Frecuencia", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Humedad"
                    dataKey="humedad"
                    stroke={COLORS.humedad}
                    strokeWidth={2}
                    dot={{ r: 5, fill: COLORS.humedad }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    name="Lluvia"
                    dataKey="lluvia"
                    stroke={COLORS.lluvia}
                    strokeWidth={2}
                    dot={{ r: 5, fill: COLORS.lluvia }}
                    activeDot={{ r: 7 }}
                  />
                  <Area type="monotone" dataKey="humedad" fill={COLORS.humedad} stroke="none" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="lluvia" fill={COLORS.lluvia} stroke="none" fillOpacity={0.1} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Este polígono de frecuencias muestra la distribución de los valores de humedad y lluvia.</p>
              <p className="mt-2">
                Permite identificar los rangos más comunes y comparar la distribución de ambas variables.
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Análisis Agrícola</h1>
          <p className="text-gray-500 dark:text-gray-400">Visualización de datos y tendencias</p>
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
                    <div className="text-xs text-gray-500 dark:text-gray-400">Gráfico de barras</div>
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
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tendencias temporales</div>
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
                    <div>Polígono de Frecuencias</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Humedad y Lluvia</div>
                  </div>
                </button>
              </div>

              {data && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Resumen de sensores</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Temperatura</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {data.sensores.temperatura}°C
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
                        {data.sensores.humedad}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Lluvia</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {data.sensores.lluvia} mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Sol</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{data.sensores.sol}%</span>
                    </div>
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

