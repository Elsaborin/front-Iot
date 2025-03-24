"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export interface Sensor {
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
}

export interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  sensor: Sensor
  ultimo_riego: string
  latitud: number
  longitud: number
}

interface SensorData {
  sensores: Sensor
  parcelas: Parcela[]
}

export const useSensorData = () => {
  const [data, setData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<SensorData>("http://moriahmkt.com/iotapp/")

        // Enhance the data with additional fields for demo purposes
        const enhancedData = {
          ...response.data,
          parcelas: response.data.parcelas.map((parcela) => ({
            ...parcela,
            ubicacion: parcela.ubicacion || "Zona Sur, Cancún",
            responsable: parcela.responsable || "Carlos Mendoza",
            tipo_cultivo: parcela.tipo_cultivo || "Maíz",
            ultimo_riego: parcela.ultimo_riego || new Date().toISOString(),
          })),
        }

        setData(enhancedData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Error al cargar datos de los sensores")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

