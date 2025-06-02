
import React from 'react';
import { StepId, Step } from '../types.ts';
import { PRIMARY_BLUE, GREEN_SUCCESS, TEXT_SECONDARY, BORDER_LIGHT } from '../constants.ts';

interface ProgressNavbarProps {
  currentStep: StepId;
  completedSteps: StepId[];
  goToStep: (step: StepId) => void;
  steps: Step[];
  className?: string; // Added className prop
}

export const ProgressNavbar: React.FC<ProgressNavbarProps> = ({ currentStep, completedSteps, goToStep, steps, className }) => {
  let progressValue = 0;
  if (completedSteps.length > 0) {
    // Progress is based on the highest completed step ID
    progressValue = Math.max(...completedSteps);
  } else {
    // If no steps are completed, progress is based on the current step index (0-indexed for calculation)
    // Ensure currentStep -1 is not negative, minimum should be 0 if currentStep is 1
    progressValue = Math.max(0, currentStep -1); 
  }
  // Adjust progress calculation: if currentStep is the first step and not completed, progressValue could be 0.
  // The percentage should be (number of completed segments / total segments).
  // If step 1 is current, progress is 0. If step 1 is done, step 2 current, progress is 1/total_steps.
  // Max progress should be when the last step is completed.
  
  let effectiveProgressSegments = 0;
  if (completedSteps.includes(steps[steps.length-1].id)) { // If last step is completed
    effectiveProgressSegments = steps.length;
  } else if (completedSteps.length > 0) {
    effectiveProgressSegments = Math.max(...completedSteps);
  } else {
     // If no steps are completed, but user is on step 1 (or >1 but nothing saved yet)
     // Progress should reflect the position *before* the current step bar segment.
     // If on step 1, 0 segments are "filled". If on step 2 (and step 1 not marked completed), still 0.
     // This logic makes more sense if progressValue means 'number of *filled* segments'.
     // Let's say progress value is index of current step (1-based) for visual progress.
     effectiveProgressSegments = currentStep -1; // if current step is 1, 0 segments filled. If current step is 5, 4 segments filled.

     // If completed steps are present, they take precedence for filling the bar.
     if (completedSteps.length > 0) {
       effectiveProgressSegments = Math.max(...completedSteps);
       // If user is on a step beyond what's completed, progress should at least show up to current step
       // Example: completed [1,2], currentStep is 4. Progress shows 2/5. This is fine.
       // If completed [], currentStep is 3. Progress shows 2/5 (up to before step 3)
     }
  }
  
  const progressPercentage = steps.length > 0 ? (effectiveProgressSegments / steps.length) * 100 : 0;


  return (
    <div className={`bg-white py-4 border-b border-[#E5E7EB] sticky top-0 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 flex-wrap">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            // A step is considered "passed" if its ID is less than the current step,
            // or if it's explicitly in completedSteps.
            // This logic helps to color previous steps even if not "completed" but navigated past.
            // However, for strict "completed" state, just use isCompleted.
            const hasBeenPassed = step.id < currentStep || isCompleted;


            return (
              <button
                key={step.id}
                className={`flex items-center space-x-2 p-1 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${isActive ? `text-[${PRIMARY_BLUE}] font-semibold focus:ring-[${PRIMARY_BLUE}]` : `text-[${TEXT_SECONDARY}] focus:ring-gray-400`}
                  ${isCompleted ? `text-[${GREEN_SUCCESS}]` : ''}
                  ${(isCompleted || step.id < currentStep) && !isActive ? `hover:bg-gray-100` : isActive ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}
                `}
                onClick={() => goToStep(step.id)}
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200
                    ${isActive ? `bg-[${PRIMARY_BLUE}] text-white` : isCompleted ? `bg-[${GREEN_SUCCESS}] text-white` : `bg-[${BORDER_LIGHT}] text-[${TEXT_SECONDARY}]`}
                  `}
                >
                  {isCompleted && !isActive ? '✔' : step.id}
                </div>
                <span className="text-xs sm:text-sm">{step.name}</span>
              </button>
            );
          })}
        </div>
        <div className={`h-1.5 bg-[${BORDER_LIGHT}] rounded-full overflow-hidden`}>
          <div
            className={`h-full bg-gradient-to-r from-[${PRIMARY_BLUE}] via-[#6fa8f7] to-[${GREEN_SUCCESS}] transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression des étapes"
          ></div>
        </div>
      </div>
    </div>
  );
};