import React from 'react';
import { MoreVerticalIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  lastReading: string;
  battery: number;
}

const DeviceTable: React.FC = () => {
  // Datos simulados para la tabla
  const devices: Device[] = [
    { id: '1', name: 'Sensor Temperatura 01', location: 'Sala de Servidores', status: 'online', lastReading: '24.5°C / 45%', battery: 85 },
    { id: '2', name: 'Sensor Temperatura 02', location: 'Oficina Principal', status: 'online', lastReading: '22.1°C / 50%', battery: 72 },
    { id: '3', name: 'Sensor Temperatura 03', location: 'Almacén', status: 'warning', lastReading: '28.7°C / 62%', battery: 45 },
    { id: '4', name: 'Sensor Temperatura 04', location: 'Laboratorio', status: 'offline', lastReading: '19.8°C / 38%', battery: 12 },
    { id: '5', name: 'Sensor Temperatura 05', location: 'Recepción', status: 'online', lastReading: '21.3°C / 48%', battery: 90 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Online
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            Advertencia
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            Offline
          </span>
        );
      default:
        return null;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dispositivos</h3>
          
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ubicación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Última Lectura
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Batería
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {device.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{device.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(device.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {device.lastReading}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                        <div 
                          className={`h-full rounded-full ${getBatteryColor(device.battery)}`} 
                          style={{ width: `${device.battery}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{device.battery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceTable;