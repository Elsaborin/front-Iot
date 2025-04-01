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
        let parcelasActivas = []
        let parcelasInactivas = []
  
        // Intentamos obtener las activas, pero si falla, seguimos con las inactivas
        try {
          const responseActivas = await axios.get("http://127.0.0.1:8000/api/mediciones/ultimas-parcela")
          if (Array.isArray(responseActivas.data)) {
            parcelasActivas = responseActivas.data
          } else if (responseActivas.data?.parcelas) {
            parcelasActivas = responseActivas.data.parcelas
          } else if (responseActivas.data?.error) {
            console.warn("⚠ No hay parcelas activas:", responseActivas.data.error)
          }
        } catch (error) {
          console.error("❌ Error obteniendo parcelas activas:", error)
        }
  
        // Intentamos obtener las inactivas, pero si falla, seguimos con las activas
        try {
          const responseInactivas = await axios.get("http://127.0.0.1:8000/api/parcelas/inactivas")
          parcelasInactivas = Array.isArray(responseInactivas.data) ? responseInactivas.data : []
        } catch (error) {
          console.error("❌ Error obteniendo parcelas inactivas:", error)
        }
  
        setData({ activas: parcelasActivas, inactivas: parcelasInactivas })
      } catch (error) {
        console.error("❌ Error general:", error)
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
