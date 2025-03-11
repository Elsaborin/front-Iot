import React from 'react';

import { ThermometerIcon, DropletIcon, AlertTriangleIcon, BatteryIcon } from 'lucide-react';
import Layout from '../layout/Layout';
import SummaryCard from '../dashboard/SummaryCard';
import TemperatureChart from '../dashboard/TemperatureChart';
import HumidityChart from '../dashboard/HumidityChart';
import DeviceTable from '../dashboard/DeviceTable';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitoreo de temperatura y humedad en tiempo real</p>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard
          title="Temperatura Promedio"
          value="24.5°C"
          icon={<ThermometerIcon className="h-6 w-6" />}
          change={{ value: 2.5, isPositive: true }}
          color="red"
        />
        <SummaryCard
          title="Humedad Promedio"
          value="48%"
          icon={<DropletIcon className="h-6 w-6" />}
          change={{ value: 5, isPositive: false }}
          color="blue"
        />
        <SummaryCard
          title="Alertas Activas"
          value="3"
          icon={<AlertTriangleIcon className="h-6 w-6" />}
          color="yellow"
        />
        <SummaryCard
          title="Batería Promedio"
          value="76%"
          icon={<BatteryIcon className="h-6 w-6" />}
          color="green"
        />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TemperatureChart />
        <HumidityChart />
      </div>
      
      {/* Tabla de dispositivos */}
      <div className="mb-6">
        <DeviceTable />
      </div>
    </Layout>
  );
};

export default Dashboard;