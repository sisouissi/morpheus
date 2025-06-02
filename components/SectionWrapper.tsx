
import React from 'react';
import { Step } from '../types.ts';
import { SECONDARY_BLUE, TEXT_SECONDARY } from '../constants.ts';


interface SectionWrapperProps {
  stepConfig: Step;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ stepConfig, children }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-[#E5E7EB] animate-slideIn">
      <div className="flex items-center mb-8 pb-4 border-b-2 border-[#F7F9FF]">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mr-4 sm:mr-5 text-2xl sm:text-3xl text-white ${stepConfig.iconBgGradient}`}>
          {stepConfig.icon}
        </div>
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold text-[${SECONDARY_BLUE}] mb-1`}>{stepConfig.title}</h2>
          <p className={`text-sm sm:text-base text-[${TEXT_SECONDARY}]`}>{stepConfig.description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

// Add this to your index.html or a global style if needed, or use Tailwind's animation config
// For CDN, you might not have a global CSS file easily, so this is for documentation.
// Tailwind config would be:
// theme: {
//   extend: {
//     animation: {
//       slideIn: 'slideIn 0.5s ease-out forwards',
//     },
//     keyframes: {
//       slideIn: {
//         '0%': { opacity: '0', transform: 'translateY(20px)' },
//         '100%': { opacity: '1', transform: 'translateY(0)' },
//       },
//     },
//   },
// },
// Since we use CDN, we apply a simple opacity transition often.
// The 'animate-slideIn' class can be defined by adding keyframes directly to tailwind.config.js
// but with CDN, we use simpler Tailwind transitions or rely on default animations.
// For this example, 'animate-slideIn' is a placeholder for a desired animation.
// Using tailwind's built-in 'animate-fade-in' and 'animate-slide-in-up' could be options if defined in config.
// With CDN only, you can try using classes that achieve similar effects, e.g. on mount, set opacity from 0 to 1 with a transition.
// A simple way for React component visibility:
// <div className={`transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
// This component will rely on the 'animate-slideIn' class being available or will just appear.
// For now, let's assume a simple transition is good enough or we'll adjust if needed.
// The original HTML used @keyframes slideIn. Tailwind doesn't directly support custom keyframes via CDN classes in the same way.
// However, we can use transition utilities to achieve a similar effect when the component mounts or becomes visible.
// This component implies it's used when a section becomes active.
// The `animate-slideIn` class name is a convention from the original HTML.
// It can be replaced with Tailwind transition classes on the parent that controls visibility.
// For the purpose of this structure, this component applies `animate-slideIn` assuming it might be globally defined or we adapt.
// We will use a simplified opacity transition for this.