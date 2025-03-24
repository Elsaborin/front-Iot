import React, { type InputHTMLAttributes } from "react"

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
  error?: string
}

const InputField: React.FC<InputFieldProps> = ({ label, icon, error, className, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200",
            })}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 ${icon ? "pl-10" : ""}
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white
            border border-gray-200 dark:border-gray-700
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
            focus:border-blue-500 dark:focus:border-blue-400
            transition-all duration-200
            placeholder-gray-400 dark:placeholder-gray-500
            shadow-sm
            ${error ? "border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500" : ""}
            ${className || ""}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InputField

