import { useState, useEffect } from "react"
import axios from "axios"

// Interfaz para los datos del sensor
export interface Sensor {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}

// Interfaz para los datos de la parcela
export interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  ultimo_riego: string;
  latitud: string;
  longitud: string;
  sensor?: Sensor; // <- Hacemos opcional el sensor
  status: string;  // <- Agregar el estado de la parcela
}


// El tipo correcto debe ser un objeto con una propiedad 'parcelas' que sea un array de 'Parcela'
interface SensorData {
  parcelas: Parcela[] // Debe ser un objeto con una propiedad 'parcelas' que sea un array
}

export const useSensorData = () => {
  const [data, setData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos la solicitud GET a la URL de la API
        const response = await axios.get<SensorData>("http://127.0.0.1:8000/api/mediciones/ultimas-parcela")

        // Guardamos la respuesta correctamente en el estado
        setData({ parcelas: response.data }) // Ahora correctamente estamos almacenando un objeto con la propiedad 'parcelas'
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

export const useInactiveSensors = () => {
  const [data, setData] = useState<{ sensoresInactivos: Parcela[] } | null>(null) // <- Corrige la estructura
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInactiveSensors = async () => {
      try {
        // Llamada a la API para obtener parcelas con sensores inactivos
        const response = await axios.get<Parcela[]>("http://127.0.0.1:8000/api/parcelas/inactivas")

        // Guardamos los datos correctamente en el estado
        setData({ sensoresInactivos: response.data.map(parcela => ({
          ...parcela,
          sensor: parcela.sensor || undefined // Asegurar que las parcelas inactivas puedan manejar un sensor opcional
        }))});
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching inactive sensors:", error)
        setError("Error al cargar sensores inactivos")
        setLoading(false)
      }
    }

    fetchInactiveSensors()
  }, [])

  return { data, loading, error }
}

