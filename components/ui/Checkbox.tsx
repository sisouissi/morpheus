
import React, { ChangeEvent } from 'react';
import { PRIMARY_BLUE, LIGHT_BLUE, TEXT_PRIMARY, BORDER_LIGHT } from '../../constants.ts';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  dataCategory: string; 
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, name, dataCategory, checked, onChange, ...props }) => {
  const uniqueId = `${dataCategory}-${name}`;
  return (
    <label 
      htmlFor={uniqueId} 
      className={`flex items-center space-x-3 p-3.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out group border-2
        ${checked 
          ? `bg-[${PRIMARY_BLUE}] text-white border-[${PRIMARY_BLUE}] shadow-md` 
          : `bg-[${LIGHT_BLUE}] text-[${TEXT_PRIMARY}] border-transparent hover:bg-blue-200 hover:border-[${PRIMARY_BLUE}]`}
      `}
    >
      <input
        type="checkbox"
        id={uniqueId}
        name={name}
        data-category={dataCategory}
        checked={checked}
        onChange={onChange}
        className={`form-checkbox h-5 w-5 rounded transition duration-150 ease-in-out 
          ${checked 
            ? `text-white bg-[${PRIMARY_BLUE}] border-white ring-1 ring-white` // Ensure checkmark is visible on colored bg
            : `text-[${PRIMARY_BLUE}] border-[${BORDER_LIGHT}] focus:ring-[${PRIMARY_BLUE}]`}
        `}
        {...props}
      />
      <span className="text-sm select-none">{label}</span>
    </label>
  );
};