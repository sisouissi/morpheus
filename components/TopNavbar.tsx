
import React from 'react';
import { SECONDARY_BLUE, TEXT_SECONDARY, PRIMARY_BLUE } from '../constants.ts';

interface TopNavbarProps {
  className?: string;
  onNewReport: () => void; 
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ 
  className,
  onNewReport
}) => {
  return (
    <nav className={`bg-white border-b border-[#E5E7EB] shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-[${PRIMARY_BLUE}] rounded-xl flex items-center justify-center text-white text-2xl font-bold`}>
              M
            </div>
            <div>
              <h1 className={`text-2xl font-extrabold text-[${SECONDARY_BLUE}]`}>Morpheus</h1>
              <p className={`text-sm text-[${TEXT_SECONDARY}]`}>Aide au diagnostic des troubles obstructifs du sommeil</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={onNewReport} 
              className={`px-3 py-2 text-xs sm:text-sm font-medium text-[${PRIMARY_BLUE}] bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_BLUE}] focus:ring-opacity-50 flex items-center`}
              title="Créer un nouveau rapport"
            >
              <span className="mr-1 hidden sm:inline">🆕</span> Nouveau Rapport
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};