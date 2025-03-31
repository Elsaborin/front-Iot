import { useState, useEffect } from "react"
import axios from "axios"

// Interfaz para los datos del sensor
export interface Sensor {
  humedad?: number
  temperatura?: number
  lluvia?: number
  sol?: number
}

// Interfaz para los datos de la parcela
export interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimo_riego: string | null
  latitud?: string
  longitud?: string
  sensor?: Sensor
  status: string
}

// Hook para obtener las parcelas activas e inactivas
export const useSensorData = () => {
  const [data, setData] = useState<{ activas: Parcela[]; inactivas: Parcela[] } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseActivas = await axios.get("http://127.0.0.1:8000/api/mediciones/ultimas-parcela")
        const responseInactivas = await axios.get("http://127.0.0.1:8000/api/parcelas/inactivas")

        console.log("🔹 Respuesta API activas:", responseActivas.data)
        console.log("🔹 Respuesta API inactivas:", responseInactivas.data)

        // Revisar cómo la API devuelve los datos
        let parcelasActivas = []
        if (Array.isArray(responseActivas.data)) {
          parcelasActivas = responseActivas.data // Es un array directo
        } else if (responseActivas.data?.parcelas) {
          parcelasActivas = responseActivas.data.parcelas // Es un objeto con la clave "parcelas"
        }

        const parcelasInactivas = Array.isArray(responseInactivas.data) ? responseInactivas.data : []

        console.log("✅ Parcelas activas procesadas:", parcelasActivas)
        console.log("✅ Parcelas inactivas procesadas:", parcelasInactivas)

        setData({ activas: parcelasActivas, inactivas: parcelasInactivas })
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        setError("Error al obtener los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    console.log("📌 Datos guardados en el estado:", data)
  }, [data])

  return { data, loading, error }
}
