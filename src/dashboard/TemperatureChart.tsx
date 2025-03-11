import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TemperatureChart: React.FC = () => {
  // Datos simulados para el gráfico
  const data = [
    { time: '00:00', value: 18 },
    { time: '02:00', value: 20 },
    { time: '04:00', value: 22 },
    { time: '06:00', value: 24 },
    { time: '08:00', value: 23 },
    { time: '10:00', value: 25 },
    { time: '12:00', value: 26 },
    { time: '14:00', value: 25 },
    { time: '16:00', value: 24 },
    { time: '18:00', value: 22 },
    { time: '20:00', value: 21 },
    { time: '22:00', value: 20 }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-400 to-red-500"></div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Temperatura</h3>
          <div className="flex space-x-2">
            <select className="text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <option>Hoy</option>
              <option>Ayer</option>
              <option>Última semana</option>
              <option>Último mes</option>
            </select>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                unit="°C"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="url(#temperatureGradient)" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', stroke: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#60A5FA' }}
              />
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;