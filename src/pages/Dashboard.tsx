import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Layout from "../layout/Layout"
import SensorCards from "../components/SensorCards"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

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
    sensor: {
      humedad: number
      temperatura: number
      lluvia: number
      sol: number
    }
  }>
}

const Dashboard: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [popupRef, setPopupRef] = useState<mapboxgl.Popup | null>(null)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const previousDataRef = useRef<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastStoredTime, setLastStoredTime] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("https://moriahmkt.com/iotapp/updated/")
      const newData = response.data
      const currentTime = Date.now()

      // Comparación profunda de datos
      if (JSON.stringify(newData) !== JSON.stringify(previousDataRef.current)) {
        setApiData(newData)
        previousDataRef.current = newData
      }

      // Almacenar cada 5 minutos si hay cambios
      if (!lastStoredTime || currentTime - lastStoredTime > 300000) {
        if (JSON.stringify(newData) !== JSON.stringify(previousDataRef.current)) {
          await storeData(newData)
          setLastStoredTime(currentTime)
        }
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error al cargar datos de los sensores")
      setLoading(false)
    }
  }, [lastStoredTime])

  const storeData = async (newData: ApiResponse) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/consumir-datos", newData)
      console.log("Datos almacenados correctamente")
    } catch (error) {
      console.error("Error al almacenar los datos:", error)
    }
  }

  useEffect(() => {
    fetchData() // Llamada inicial
    const interval = setInterval(fetchData, 120000) // Actualizar cada 2 minutos

    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (!apiData || !mapContainer.current) return
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-86.87474305194408, 21.063892829835364],
      zoom: 13,
      attributionControl: false,
    })

    map.current.on("load", () => {
      map.current?.addControl(new mapboxgl.NavigationControl(), "top-right")

      apiData.parcelas.forEach((parcela) => {
        const el = document.createElement("div")
        el.className = "custom-marker relative"

        // Crear marcador y popups (como lo tienes en el código original)
        const markerContainer = document.createElement("div")
        markerContainer.className = "flex flex-col items-center"

        const pin = document.createElement("div")
        pin.className =
          "w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg transform-gpu transition-transform duration-300 hover:scale-110 z-10"

        const icon = document.createElement("div")
        icon.className = "text-white"
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>`
        pin.appendChild(icon)

        const pulse = document.createElement("div")
        pulse.className = "absolute top-0 left-0 w-8 h-8 rounded-full bg-emerald-400 opacity-70 animate-ping"

        const connector = document.createElement("div")
        connector.className = "w-1 h-5 bg-emerald-500 -mt-1"

        const label = document.createElement("div")
        //es el div donde se muesta el nombre de la parcela
        label.className =
          "bg-white dark:bg-gray-800 text-xs font-medium text-emerald-800 dark:text-emerald-200 px-6 py-4 rounded-md shadow-md mt-1"
        label.textContent = parcela.nombre

        markerContainer.appendChild(pulse)
        markerContainer.appendChild(pin)
        markerContainer.appendChild(connector)
        markerContainer.appendChild(label)
        el.appendChild(markerContainer)

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          className:
            "custom-popup !bg-white dark:!bg-gray-800 !shadow-lg !rounded-lg !border !border-gray-200 dark:!border-gray-700",
        }).setHTML(` 
          <div class="p-2">
            <h class="font-bold text-gray-90 dark:text-white text-sm">${ parcela.nombre }</h5>
            <div class="space-y-1">
              <p class="text-gray-700 dark:text-gray-300 flex items-center">
                <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                Humedad: <span class="font-medium ml-1">${parcela.sensor.humedad}%</span>
              </p>
              <p class="text-gray-700 dark:text-gray-300 flex items-center">
                <span class="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Temperatura: <span class="font-medium ml-1">${parcela.sensor.temperatura}°C</span>
              </p>
              <p class="text-gray-700 dark:text-gray-300 flex items-center">
                <span class="inline-block w-3 h-3 rounded-full bg-cyan-500 mr-2"></span>
                Lluvia: <span class="font-medium ml-1">${parcela.sensor.lluvia}</span>
              </p>
              <p class="text-gray-700 dark:text-gray-300 flex items-center">
                <span class="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                Sol: <span class="font-medium ml-1">${parcela.sensor.sol}</span>
              </p>
            </div>
          </div>
        `)

        new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([parcela.longitud, parcela.latitud])
          .setPopup(popup)
          .addTo(map.current!)

        el.addEventListener("click", () => {
          setSelectedMarker(parcela.id)
          popupRef?.remove()
          setPopupRef(popup)
        })
      })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [apiData])



  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    )

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cultivos del Sur | Mapa de ubicaciones
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitoreo en tiempo real de sensores de temperatura y humedad
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
        <div className="w-full lg:w-[60%] bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-lg">
          <div className="h-full w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        </div>

        <div className="w-full lg:w-[40%]">
          {apiData && (
            <SensorCards
              temperatura={apiData.sensores.temperatura}
              humedad={apiData.sensores.humedad}
              lluvia={apiData.sensores.lluvia}
              sol={apiData.sensores.sol}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
