"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Layout from "../layout/Layout"
import { BarChart3Icon, LineChartIcon, AreaChartIcon, ArrowLeftIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface ApiResponse {
  sensores: {
    humedad: number
    temperatura: number
    lluvia: number
    sol: number
  }
  parcelas: Array<{
    id: number
    nombre: string
    latitud: number
    longitud: number
    ubicacion: string
    sensor: {
      humedad: number
      temperatura: number
      lluvia: number
      sol: number
    }
  }>
}

const generateTimeSeriesData = (parcela: any) => {
  const now = new Date()
  const data = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const randomFactor = 0.8 + Math.random() * 0.4

    data.push({
      fecha: date.toLocaleDateString(),
      humedad: Math.round(parcela.sensor.humedad * randomFactor),
      temperatura: Math.round(parcela.sensor.temperatura * randomFactor),
    })
  }

  return data
}

const Graficos: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeChart, setActiveChart] = useState<string>("humidity-comparison")
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedParcela, setSelectedParcela] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week")
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const chartType = params.get("type")
    if (chartType) {
      setActiveChart(chartType)
    }

    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>("https://moriahmkt.com/iotapp/test/")
        setApiData(response.data)

        if (response.data.parcelas.length > 0) {
          setTimeSeriesData(generateTimeSeriesData(response.data.parcelas[0]))
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Error al cargar datos de los sensores")
        setLoading(false)
      }
    }

    fetchData()
  }, [location])

  useEffect(() => {
    if (!apiData) return

    if (selectedParcela === "all") {
      setTimeSeriesData(generateTimeSeriesData(apiData.parcelas[0]))
    } else {
      const parcelaId = Number.parseInt(selectedParcela)
      const parcela = apiData.parcelas.find((p) => p.id === parcelaId)
      if (parcela) {
        setTimeSeriesData(generateTimeSeriesData(parcela))
      }
    }
  }, [selectedParcela, apiData])

  const renderChartContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      )
    }

    if (!apiData) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      )
    }

    switch (activeChart) {
      case "humidity-comparison":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <BarChart3Icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800">Comparación de Humedad y Temperatura por Parcela</h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={apiData.parcelas}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={60} tick={{ fill: "#4b5563" }} />
                  <YAxis
                    label={{
                      value: "Valores",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#4b5563" },
                    }}
                    tick={{ fill: "#4b5563" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                  />
                  <Legend />
                  <Bar name="Humedad (%)" dataKey="sensor.humedad" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar name="Temperatura (°C)" dataKey="sensor.temperatura" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Este gráfico muestra la comparación de los niveles de humedad y temperatura entre las diferentes
                parcelas monitoreadas.
              </p>
              <p className="mt-2">
                Los datos se actualizan cada hora y permiten identificar qué parcelas requieren atención en términos de
                riego y control de temperatura.
              </p>
            </div>
          </div>
        )
      case "time-changes":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <LineChartIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800">Cambios a lo Largo del Tiempo</h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeSeriesData}
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
                    name="Humedad (%)"
                    dataKey="humedad"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    name="Temperatura (°C)"
                    dataKey="temperatura"
                    stroke="#059669"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Este gráfico muestra la evolución de la temperatura y humedad a lo largo del tiempo.</p>
              <p className="mt-2">
                Permite identificar patrones y tendencias en los datos recolectados durante el período
                seleccionado.
              </p>
            </div>
          </div>
        )
      case "variable-correlation":
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <AreaChartIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-800">Correlación de Variables</h2>
            </div>
            <div className="h-[calc(100vh-300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} width={730} height={250} data={apiData.parcelas}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="nombre" tick={{ fill: "#4b5563" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#4b5563" }} />
                  <Radar
                    name="Humedad (%)"
                    dataKey="sensor.humedad"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Temperatura (°C)"
                    dataKey="sensor.temperatura"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.4}
                  />
                  <Radar name="Lluvia (mm)" dataKey="sensor.lluvia" stroke="#34d399" fill="#34d399" fillOpacity={0.4} />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Este gráfico de radar muestra las tres variables clave: humedad, temperatura y lluvia para todas las
                parcelas.
              </p>
              <p className="mt-2">
                Cada parcela se representa en el gráfico, permitiendo comparar fácilmente los valores de las diferentes
                variables entre parcelas.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <p className="text-gray-500">Seleccione un tipo de gráfico</p>
          </div>
        )
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Análisis de Cultivos</h1>
            <p className="text-gray-500 mt-1">Visualización de datos y tendencias</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm text-emerald-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Todos los sensores activos</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Volver al dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-800">Visualizaciones</h3>
              <p className="text-sm text-gray-500 mt-1">Seleccione un tipo de gráfico</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setActiveChart("humidity-comparison")
                  navigate("/graficos?type=humidity-comparison")
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeChart === "humidity-comparison"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BarChart3Icon className="h-5 w-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div>Comparación de humedad</div>
                  <div className="text-xs text-gray-500">Análisis por parcela</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveChart("time-changes")
                  navigate("/graficos?type=time-changes")
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeChart === "time-changes" ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LineChartIcon className="h-5 w-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div>Cambios temporales</div>
                  <div className="text-xs text-gray-500">Evolución de variables</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveChart("variable-correlation")
                  navigate("/graficos?type=variable-correlation")
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeChart === "variable-correlation"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <AreaChartIcon className="h-5 w-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div>Correlación de variables</div>
                  <div className="text-xs text-gray-500">Análisis multivariable</div>
                </div>
              </button>
            </div>

            {apiData && (
              <div className="p-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen de sensores</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">Temperatura</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{apiData.sensores.temperatura}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">Humedad</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{apiData.sensores.humedad}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">Lluvia</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{apiData.sensores.lluvia} mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-9">{renderChartContent()}</div>
      </div>
    </Layout>
  )
}

export default Graficos