
import React, { ChangeEvent } from 'react';
import { BORDER_LIGHT, PRIMARY_BLUE, TEXT_PRIMARY } from '../../constants.ts';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, name, error, className, ...props }) => {
  const baseClass = `w-full px-4 py-3.5 border-2 border-[${BORDER_LIGHT}] rounded-xl text-base transition-all duration-200 ease-in-out bg-white focus:outline-none focus:border-[${PRIMARY_BLUE}] focus:ring-2 focus:ring-[${PRIMARY_BLUE}] focus:ring-opacity-30 min-h-[100px] resize-vertical`;
  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={name} className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-2 uppercase tracking-wider`}>
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className={`${baseClass} ${error ? `border-red-500 focus:border-red-500 focus:ring-red-500` : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};