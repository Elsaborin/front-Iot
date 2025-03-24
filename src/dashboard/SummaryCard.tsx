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
  color 
}) => {
  const getIconBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50';
      case 'cyan':
        return 'bg-cyan-50';
      case 'purple':
        return 'bg-purple-50';
      case 'green':
        return 'bg-green-50';
      case 'yellow':
        return 'bg-yellow-50';
      case 'red':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getTextColor = () => {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-start">
          <div className={`${getIconBgColor()} p-3 rounded-lg w-12 h-12 flex items-center justify-center`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-6 h-6 ${getIconColor()}`
            })}
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-3xl font-bold ${getTextColor()}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
