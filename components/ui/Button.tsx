
import React from 'react';
import { PRIMARY_BLUE, SECONDARY_BLUE, GREEN_SUCCESS, TEXT_SECONDARY, BORDER_LIGHT, YELLOW_ACCENT } from '../../constants.ts';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, loading = false, icon, className, ...props }) => {
  const baseStyle = "px-7 py-3.5 border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = `bg-[${PRIMARY_BLUE}] text-white hover:bg-[${SECONDARY_BLUE}] hover:-translate-y-0.5 focus:ring-[${PRIMARY_BLUE}]`;
      break;
    case 'secondary':
      variantStyle = `bg-transparent text-[${TEXT_SECONDARY}] border-2 border-[${BORDER_LIGHT}] hover:border-[${PRIMARY_BLUE}] hover:text-[${PRIMARY_BLUE}] focus:ring-[${PRIMARY_BLUE}]`;
      break;
    case 'success':
      variantStyle = `bg-[${GREEN_SUCCESS}] text-white hover:bg-[#059669] hover:-translate-y-0.5 focus:ring-[${GREEN_SUCCESS}]`;
      break;
    case 'warning':
       variantStyle = `bg-[${YELLOW_ACCENT}] text-[${SECONDARY_BLUE}] hover:opacity-90 hover:-translate-y-0.5 focus:ring-[${YELLOW_ACCENT}]`;
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};