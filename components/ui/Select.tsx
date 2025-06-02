
import React, { ChangeEvent } from 'react';
import { BORDER_LIGHT, PRIMARY_BLUE, TEXT_PRIMARY, TEXT_SECONDARY } from '../../constants.ts';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  options: { value: string | number; label: string }[];
  error?: string;
  placeholder?: string; // Added placeholder prop
}

export const Select: React.FC<SelectProps> = ({ label, name, options, error, className, placeholder, ...props }) => {
  const baseClass = `w-full px-4 py-3.5 border-2 border-[${BORDER_LIGHT}] rounded-xl text-base transition-all duration-200 ease-in-out bg-white appearance-none focus:outline-none focus:border-[${PRIMARY_BLUE}] focus:ring-2 focus:ring-[${PRIMARY_BLUE}] focus:ring-opacity-30`;
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={name} className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-2 uppercase tracking-wider`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          className={`${baseClass} ${error ? `border-red-500 focus:border-red-500 focus:ring-red-500` : ''} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[${TEXT_SECONDARY}]`}>
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};