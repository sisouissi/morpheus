
import React, { ChangeEvent } from 'react';
import { CombinedFormData } from '../../types.ts';
import { Checkbox } from '../ui/Checkbox.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { Button } from '../ui/Button.tsx';
import { SectionWrapper } from '../SectionWrapper.tsx';
import { STEPS, TEXT_PRIMARY, PRIMARY_BLUE } from '../../constants.ts';

interface Step3Props {
  combinedFormData: CombinedFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const Step3Clinical: React.FC<Step3Props> = ({ 
  combinedFormData, 
  handleChange, 
  nextStep, 
  previousStep 
}) => {
  const currentStepConfig = STEPS.find(s => s.id === 3);
  if (!currentStepConfig) return null;


  const symptomsOptions = [
    { name: 'ronflements', label: 'Ronflements', dataCategory: 'symptoms' },
    { name: 'apnees', label: 'Apnées observées par l\'entourage', dataCategory: 'symptoms' },
    { name: 'somnolence', label: 'Somnolence diurne excessive', dataCategory: 'symptoms' },
    { name: 'fatigue', label: 'Fatigue matinale / Non réparatrice', dataCategory: 'symptoms' },
    { name: 'cephalees', label: 'Céphalées matinales', dataCategory: 'symptoms' },
    { name: 'nycturie', label: 'Nycturie (plusieurs levers nocturnes)', dataCategory: 'symptoms' },
    { name: 'troublesConcentration', label: 'Troubles de concentration / mémoire', dataCategory: 'symptoms' },
  ];
  
  const additionalSymptomsOptions = [
    { name: 'morningDryMouth', label: 'Bouche sèche ou pâteuse au réveil', dataCategory: 'root' },
    { name: 'nocturnalChokingGasping', label: 'Réveils nocturnes avec sensation d\'étouffement ou suffocation', dataCategory: 'root' },
  ];

  const motivationOptions = [
    { name: 'motivationSomnolence', label: "Somnolence diurne excessive" },
    { name: 'motivationRonflements', label: "Ronflements importants / gênants" },
    { name: 'motivationApneesEntourage', label: "Apnées rapportées par l'entourage" },
    { name: 'motivationBilanPreOp', label: "Bilan pré-opératoire (ex: chirurgie bariatrique)" },
    { name: 'motivationFatigueChronique', label: "Fatigue chronique inexpliquée" },
    { name: 'motivationHTAResistante', label: "HTA résistante / mal équilibrée" },
  ];

  const mallampatiOptions = [
    { value: "", label: "Non évalué / Ne sait pas" },
    { value: "I", label: "Classe I (Visibilité complète du palais mou, de la luette et des piliers)" },
    { value: "II", label: "Classe II (Visibilité complète du palais mou et de la luette)" },
    { value: "III", label: "Classe III (Visibilité du palais mou et de la base de la luette)" },
    { value: "IV", label: "Classe IV (Palais mou non visible)" },
  ];

  const tonsilOptions = [
    { value: "", label: "Non évalué / Ne sait pas" },
    { value: "0", label: "Grade 0 (Amygdales absentes ou en loges)" },
    { value: "1", label: "Grade 1 (Amygdales visibles, contenues dans les loges)" },
    { value: "2", label: "Grade 2 (Amygdales dépassant les piliers, <50% de l'espace)" },
    { value: "3", label: "Grade 3 (Amygdales occupant >50% de l'espace, proches de la luette)" },
    { value: "4", label: "Grade 4 (Amygdales se touchant sur la ligne médiane)" },
  ];

  const renderInitialClinicalContent = () => (
    <div className="space-y-8">
      <div>
        <label className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-3 uppercase tracking-wider`}>Symptômes rapportés</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {symptomsOptions.map(opt => (
            <Checkbox
              key={opt.name}
              label={opt.label}
              name={opt.name}
              dataCategory={opt.dataCategory}
              checked={combinedFormData.symptoms[opt.name as keyof typeof combinedFormData.symptoms]}
              onChange={handleChange}
            />
          ))}
          {additionalSymptomsOptions.map(opt => (
            <Checkbox
              key={opt.name}
              label={opt.label}
              name={opt.name}
              dataCategory={opt.dataCategory}
              checked={combinedFormData[opt.name as keyof Pick<CombinedFormData, 'morningDryMouth' | 'nocturnalChokingGasping'>]}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-3 uppercase tracking-wider`}>Motivation de l'exploration</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {motivationOptions.map(opt => (
                <Checkbox
                    key={opt.name}
                    label={opt.label}
                    name={opt.name}
                    dataCategory="root" 
                    checked={combinedFormData[opt.name as keyof Pick<CombinedFormData, 'motivationSomnolence' | 'motivationRonflements' | 'motivationApneesEntourage' | 'motivationBilanPreOp' | 'motivationFatigueChronique' | 'motivationHTAResistante'>]}
                    onChange={handleChange}
                />
            ))}
        </div>
        <Textarea
          label="Autres motivations / Précisions"
          name="explorationReasonOther"
          value={combinedFormData.explorationReasonOther}
          onChange={handleChange}
          placeholder="Si autre motif ou pour plus de détails..."
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          <Select
            label="Score de Mallampati (si évalué)"
            name="mallampatiScore"
            value={combinedFormData.mallampatiScore}
            onChange={handleChange}
            options={mallampatiOptions}
          />
          <Select
            label="Taille des Amygdales (si évaluée)"
            name="tonsilSize"
            value={combinedFormData.tonsilSize}
            onChange={handleChange}
            options={tonsilOptions}
          />
      </div>

      <div>
          <label htmlFor="sleepinessScale" className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-2 uppercase tracking-wider`}>
              Échelle de somnolence subjective (1-10)
          </label>
          <input
              id="sleepinessScale"
              name="sleepinessScale"
              type="range"
              min="1"
              max="10"
              value={combinedFormData.sleepinessScale}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F9CF9]"
          />
          <div className={`text-center mt-2 font-semibold text-[${PRIMARY_BLUE}]`}>
              {combinedFormData.sleepinessScale}/10
          </div>
      </div>
    </div>
  );

  return (
    <SectionWrapper stepConfig={currentStepConfig}>
      {renderInitialClinicalContent()}
      {/* PolygraphyInputs and PPCFollowUpInputs removed */}
      <div className="mt-10 flex justify-between">
        <Button variant="secondary" onClick={previousStep}>← Précédent</Button>
        <Button onClick={nextStep}>Suivant →</Button>
      </div>
    </SectionWrapper>
  );
};