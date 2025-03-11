import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'cyan' | 'purple' | 'green' | 'yellow' | 'red';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  color 
}) => {
  const getGradient = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-400 to-blue-600';
      case 'cyan':
        return 'from-cyan-400 to-cyan-600';
      case 'purple':
        return 'from-purple-400 to-purple-600';
      case 'green':
        return 'from-green-400 to-green-600';
      case 'yellow':
        return 'from-yellow-400 to-yellow-600';
      case 'red':
        return 'from-red-400 to-red-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-500';
      case 'cyan':
        return 'text-cyan-500';
      case 'purple':
        return 'text-purple-500';
      case 'green':
        return 'text-green-500';
      case 'yellow':
        return 'text-yellow-500';
      case 'red':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${getGradient()}`}></div>
      <div className="p-5">
        <div className="flex items-center">
          <div className={`rounded-full p-3 ${getIconColor()} bg-opacity-10 bg-current`}>
            {icon}
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
              {change && (
                <p className={`ml-2 text-sm font-medium ${change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;