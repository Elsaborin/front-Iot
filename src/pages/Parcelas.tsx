import type React from "react"
import Layout from "../layout/Layout"
import ParcelaCard from "../components/ParcelaCard"
import { useSensorData } from "../hooks/useSensorData"

const Parcelas: React.FC = () => {
  const { data, loading, error } = useSensorData()

  console.log("📌 Data en Parcelas.tsx:", data)

  const parcelasActivas = data?.activas ?? []
  const parcelasInactivas = data?.inactivas ?? []

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parcelas Activas</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestión y monitoreo de parcelas</p>
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
      ) : parcelasActivas.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
          No hay parcelas activas registradas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcelasActivas.map((parcela) => (
            <ParcelaCard key={parcela.id} parcela={parcela} />
          ))}
        </div>
      )}
    </Layout>
  )
}

export default Parcelas
