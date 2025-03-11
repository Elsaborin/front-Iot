import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  className,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 ${icon ? 'pl-10' : ''}
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white
            border-2 border-gray-200 dark:border-gray-700
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400
            focus:border-transparent
            transition-all duration-200
            placeholder-gray-500 dark:placeholder-gray-400
            ${error ? 'border-red-500 dark:border-red-500' : ''}
            ${className || ''}
          `}
          {...props}
        />
        
        {/* Efecto de gradiente en el borde al hacer focus */}
        <div className="absolute inset-0 rounded-lg opacity-0 overflow-hidden pointer-events-none transition-opacity duration-300 peer-focus:opacity-100">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 animate-gradient-x"></div>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;