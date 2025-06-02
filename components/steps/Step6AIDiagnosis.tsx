
import React from 'react';
import { ReportSession } from '../../types.ts'; 
import { Button } from '../ui/Button.tsx';
// Input removed as it's no longer used
import { STEPS, YELLOW_ACCENT, SECONDARY_BLUE, PRIMARY_BLUE, TEXT_SECONDARY, LIGHT_BLUE, TEXT_PRIMARY, BORDER_LIGHT } from '../../constants.ts';

interface Step5Props {
  consultation: ReportSession | null; 
  generateConclusion: () => void;
  isGenerating: boolean;
  previousStep: () => void;
  resetForm: () => void; 
  // handleChange prop removed
}

export const Step5Conclusion: React.FC<Step5Props> = ({ consultation, generateConclusion, isGenerating, previousStep, resetForm }) => {
  const currentStepConfig = STEPS.find(s => s.id === 5);
  if (!currentStepConfig) return null;

  const appConclusion = consultation?.appConclusion;
  const consultationDate = consultation?.data.consultationDate;
  // nextAppointmentDate related logic removed

  const handlePrint = () => window.print();
  // handleExportPDF function removed

  let riskTextColor = 'text-white';
  let riskBgColor = `bg-[${PRIMARY_BLUE}]`; // Default for 'Information' or unclassified

  if (appConclusion?.riskLevel) {
    const riskLower = appConclusion.riskLevel.toLowerCase();
    if (riskLower === 'faible' || riskLower.includes('léger')) {
      riskBgColor = 'bg-green-500';
    } else if (riskLower === 'modéré') {
      riskBgColor = `bg-[${YELLOW_ACCENT}]`;
      riskTextColor = `text-[${SECONDARY_BLUE}]`;
    } else if (riskLower === 'élevé' || riskLower.includes('sévère')) {
      riskBgColor = 'bg-red-500';
    }
  }


  return (
    <div className={`bg-[${LIGHT_BLUE}] text-[${TEXT_PRIMARY}] rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-[${BORDER_LIGHT}] print:shadow-none print:border-gray-300`}>
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100/30 rounded-full animate-pulse delay-100 print-hidden"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-100/50 rounded-full animate-pulse delay-300 print-hidden"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-8 pb-4 border-b-2 border-gray-200">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 ${currentStepConfig.iconBgGradient} rounded-2xl flex items-center justify-center shrink-0 mr-4 sm:mr-5 text-2xl sm:text-3xl text-white`}>
            {currentStepConfig.icon}
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold text-[${SECONDARY_BLUE}] mb-1`}>{currentStepConfig.title}</h2>
            <p className={`text-sm sm:text-base text-[${TEXT_SECONDARY}]`}>
              {currentStepConfig.description}
            </p>
            {consultationDate && (
                 <p className={`text-xs text-[${TEXT_SECONDARY}]`}>Date du rapport: {new Date(consultationDate).toLocaleDateString('fr-FR')}</p>
            )}
          </div>
        </div>

        {!appConclusion && (
          <div className="text-center py-10">
            <div className="text-5xl mb-6 print-hidden">🤔</div>
            <h3 className={`text-2xl font-semibold text-[${SECONDARY_BLUE}] mb-3`}>Prêt à générer la conclusion ?</h3>
            <p className={`text-sm text-[${TEXT_SECONDARY}] mb-6`}>
              Vérifiez les informations des étapes précédentes. La conclusion sera basée sur ces données.
            </p>
            {/* Input field for nextAppointmentDate removed */}
            <Button 
              variant="success" 
              onClick={generateConclusion} 
              loading={isGenerating} 
              icon={!isGenerating ? "💡" : undefined}
              className="text-lg px-8 py-4 print-hidden"
            >
              Générer la Conclusion
            </Button>
          </div>
        )}

        {appConclusion && consultation && (
          <div className="space-y-6">
            <div className={`bg-white rounded-xl p-6 border border-[${BORDER_LIGHT}] print:border-gray-300`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className={`text-xl font-semibold text-[${PRIMARY_BLUE}]`}>Synthèse Générale</h4>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${riskBgColor} ${riskTextColor}`}>
                    Niveau de Suspicion: {appConclusion.riskLevel}
                </span>
              </div>
              <ul className={`list-disc list-inside space-y-1.5 text-[${TEXT_SECONDARY}] text-sm`}>
                {appConclusion.summary.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            
            <div className={`bg-white rounded-xl p-6 border border-[${BORDER_LIGHT}] print:border-gray-300`}>
              <h4 className={`text-xl font-semibold mb-3 text-[${PRIMARY_BLUE}]`}>🎯 Propositions et Conseils</h4>
              <ul className={`list-disc list-inside space-y-1.5 text-[${TEXT_SECONDARY}]`}>
                {appConclusion.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
               {/* Display of nextAppointmentDate removed */}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200 print-hidden">
                <Button variant="warning" onClick={handlePrint} icon="🖨️">Imprimer</Button>
                {/* Export PDF button removed */}
            </div>
          </div>
        )}
        
        <div className="mt-10 flex justify-between print-hidden">
          <Button variant="secondary" onClick={previousStep} >← Précédent</Button>
          <Button variant="secondary" onClick={resetForm} icon="🔄" >Nouveau Rapport</Button>
        </div>
      </div>
    </div>
  );
};