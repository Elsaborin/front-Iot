import React from "react";
import WeatherCard from "./WeatherCard";
import {
  MapPinIcon,
  UserIcon,
  SproutIcon as SeedlingIcon,
  DropletIcon,
} from "lucide-react";

interface Sensor {
  temperatura?: number;
  humedad?: number;
  lluvia?: number;
  sol?: number;
}

interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  sensor?: Sensor; // Puede ser undefined si es inactiva
  ultimo_riego: string | null; // Aseguramos que puede ser null
  status: string; // Estado de la parcela
}

interface ParcelaCardProps {
  parcela: Parcela;
}

const ParcelaCard: React.FC<ParcelaCardProps> = ({ parcela }) => {
  const isInactive = parcela.status === "inactive";

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
      <div className="mb-4 flex justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {parcela.nombre} {isInactive && "(Inactiva)"}
          </h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <p className="text-sm">{parcela.ubicacion}</p>
          </div>
        </div>
        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <SeedlingIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-sm flex items-center">
          <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Responsable</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {parcela.responsable}
            </p>
          </div>
        </div>
        <div className="text-sm flex items-center">
          <SeedlingIcon className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">Cultivo</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {parcela.tipo_cultivo}
            </p>
          </div>
        </div>
      </div>

      {/* Sensores (si la parcela está inactiva, muestra "Datos no disponibles") */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {!parcela.sensor ? (
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
            Datos no disponibles
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <WeatherCard
              name="Temperatura"
              value={`${parcela.sensor.temperatura ?? "N/A"}°C`}
              icon="thermometer"
              color="red"
            />
            <WeatherCard
              name="Humedad"
              value={`${parcela.sensor.humedad ?? "N/A"}%`}
              icon="droplet"
              color="blue"
            />
            <WeatherCard
              name="Lluvia"
              value={`${parcela.sensor.lluvia ?? "N/A"}mm`}
              icon="cloud-rain"
              color="cyan"
            />
            <WeatherCard
              name="Intensidad del sol"
              value={`${parcela.sensor.sol ?? "N/A"}%`}
              icon="sun"
              color="yellow"
            />
          </div>
        )}
      </div>

      {/* Último riego */}
      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <DropletIcon className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
        <p>
          Último riego:{" "}
          <span className="font-medium">
            {parcela.ultimo_riego
              ? new Date(parcela.ultimo_riego).toLocaleString()
              : "No registrado"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ParcelaCard;
