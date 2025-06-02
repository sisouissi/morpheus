
import React, { ChangeEvent } from 'react';
import { BORDER_LIGHT, PRIMARY_BLUE, TEXT_PRIMARY } from '../../constants.ts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
  // value and onChange are part of React.InputHTMLAttributes<HTMLInputElement>
}

export const Input: React.FC<InputProps> = ({ label, name, error, className, ...props }) => {
  const baseClass = `w-full px-4 py-3.5 border-2 border-[${BORDER_LIGHT}] rounded-xl text-base transition-all duration-200 ease-in-out bg-white focus:outline-none focus:border-[${PRIMARY_BLUE}] focus:ring-2 focus:ring-[${PRIMARY_BLUE}] focus:ring-opacity-30`;
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={name} className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-2 uppercase tracking-wider`}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`${baseClass} ${error ? `border-red-500 focus:border-red-500 focus:ring-red-500` : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};